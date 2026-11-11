/**
 * Traitement des images (cahier, section 6.2), avec sharp.
 *
 * Photos produits (site actuel → public/images/produits/site/) :
 *   1. détection de l'objet sur fond clair (composante minimale < 236, 3 px de bord ignorés) ;
 *   2. rognage au plus près, ombre naturelle incluse ;
 *   3. blanchiment du fond (composante minimale ≥ 244 → #FFFFFF) ;
 *   4. pose centrée sur une toile blanche 1600 × 470 (ratio 3,4:1), marges 6 % / 10 % ;
 *   5. export JPEG qualité 82 (AVIF et WebP sont servis par next/image à la volée).
 * Archives, atelier, boutique : noir et blanc (+4 % de contraste), bords blancs supprimés.
 * Pastilles de matière : carré de 240 px pris au milieu du manche.
 *
 * Recadrages et retouches manuels : scripts/crops.json.
 * Usage : npx tsx scripts/process-images.ts [produits|nb|pastilles|pack]
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const RAW = path.join(ROOT, 'scripts', 'raw');
const PUB = path.join(ROOT, 'public', 'images');
const CANVAS = { w: 1600, h: 470, mx: 0.06, my: 0.1 };

interface CropRule {
  /** Boîte de recadrage manuelle dans l'image d'origine [x, y, largeur, hauteur]. */
  box?: [number, number, number, number];
  /** Zones à blanchir (traces de mise en page, objet voisin) [x, y, largeur, hauteur]. */
  erase?: [number, number, number, number][];
  /** Ne pas utiliser cette image. */
  skip?: boolean;
  /** Fond non détourable : conserver le cadrage d'origine. */
  keep?: boolean;
}
interface Crops {
  /** Vue « fermé » par fiche : indice de l'image, ou false s'il n'y en a pas d'utilisable. */
  ferme: Record<string, number | false>;
  /** Vue principale par fiche si ce n'est pas la première image. */
  cover: Record<string, number>;
  /** Fiches dont la première image montre plusieurs objets : on cherche la vue du couteau seul, ouvert. */
  autoCover: string[];
  rules: Record<string, CropRule>;
}

interface Measured {
  data: Buffer;
  width: number;
  height: number;
  bbox: { x: number; y: number; w: number; h: number } | null;
  /** Part des pixels de bord qui ne sont pas blancs après balance : fond non détourable si élevée. */
  dirtyBorder: number;
  /** Nombre d'objets distincts (étui + couteau = 2). */
  objects: number;
}

async function measure(file: string, rule: CropRule = {}): Promise<Measured> {
  let img = sharp(file).rotate().flatten({ background: '#ffffff' }).removeAlpha();
  if (rule.box) img = img.extract({ left: rule.box[0], top: rule.box[1], width: rule.box[2], height: rule.box[3] });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const px = (x: number, y: number) => (y * width + x) * 3;

  for (const [ex, ey, ew, eh] of rule.erase ?? []) {
    for (let y = Math.max(0, ey); y < Math.min(height, ey + eh); y++)
      for (let x = Math.max(0, ex); x < Math.min(width, ex + ew); x++) data.fill(255, px(x, y), px(x, y) + 3);
  }

  // Balance du fond : la médiane du bord devient le blanc.
  const border: number[][] = [[], [], []];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 200));
  for (let x = 3; x < width - 3; x += step) for (const y of [3, height - 4]) for (let c = 0; c < 3; c++) border[c].push(data[px(x, y) + c]);
  for (let y = 3; y < height - 3; y += step) for (const x of [3, width - 4]) for (let c = 0; c < 3; c++) border[c].push(data[px(x, y) + c]);
  const med = border.map((a) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)]);
  if (Math.min(...med) >= 205 && Math.min(...med) < 250) {
    const gain = med.map((m) => 252 / m);
    for (let i = 0; i < data.length; i += 3) for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.round(data[i + c] * gain[c]));
  }

  // 1. Cœur de l'objet : composantes connexes sombres sur une grille réduite (les poussières et
  //    les textures pâles du fond sont écartées).
  const k = Math.max(1, Math.round(width / 260));
  const gw = Math.ceil(width / k);
  const gh = Math.ceil(height / k);
  const grid = new Uint8Array(gw * gh);
  for (let gy = 0; gy < gh; gy++)
    for (let gx = 0; gx < gw; gx++) {
      let dark = 0;
      let n = 0;
      for (let y = gy * k; y < Math.min(height - 3, (gy + 1) * k); y++)
        for (let x = gx * k; x < Math.min(width - 3, (gx + 1) * k); x++) {
          if (x < 3 || y < 3) continue;
          n++;
          const i = px(x, y);
          if (Math.min(data[i], data[i + 1], data[i + 2]) < 212) dark++;
        }
      if (n && dark / n >= 0.5) grid[gy * gw + gx] = 1;
    }
  const label = new Int32Array(gw * gh).fill(-1);
  const comps: { area: number; x0: number; x1: number; y0: number; y1: number }[] = [];
  for (let start = 0; start < grid.length; start++) {
    if (!grid[start] || label[start] >= 0) continue;
    const id = comps.length;
    const c = { area: 0, x0: gw, x1: 0, y0: gh, y1: 0 };
    const stack = [start];
    label[start] = id;
    while (stack.length) {
      const cur = stack.pop()!;
      const cx = cur % gw;
      const cy = (cur - cx) / gw;
      c.area++;
      c.x0 = Math.min(c.x0, cx); c.x1 = Math.max(c.x1, cx); c.y0 = Math.min(c.y0, cy); c.y1 = Math.max(c.y1, cy);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const ni = ny * gw + nx;
          if (grid[ni] && label[ni] < 0) { label[ni] = id; stack.push(ni); }
        }
    }
    comps.push(c);
  }
  const biggest = Math.max(0, ...comps.map((c) => c.area));
  const kept = comps.filter((c) => c.area >= Math.max(6, biggest * 0.05));
  let x0 = -1, x1 = -1, y0 = -1, y1 = -1;
  let objects = 0;
  if (kept.length) {
    x0 = Math.min(...kept.map((c) => c.x0)) * k;
    x1 = Math.min(width - 1, (Math.max(...kept.map((c) => c.x1)) + 1) * k);
    y0 = Math.min(...kept.map((c) => c.y0)) * k;
    y1 = Math.min(height - 1, (Math.max(...kept.map((c) => c.y1)) + 1) * k);
    // objets distincts : composantes séparées par un vide horizontal d'au moins 3 %
    const spans = kept.filter((c) => c.area >= biggest * 0.2).map((c) => [c.x0, c.x1]).sort((p, q) => p[0] - q[0]);
    let end = -Infinity;
    for (const [a, b] of spans) { if (a - end > gw * 0.03) objects++; end = Math.max(end, b); }

    // 2. On étend la boîte aux parties claires de l'objet et à son ombre, de proche en proche.
    const dark = (x: number, y: number) => { const i = px(x, y); return Math.min(data[i], data[i + 1], data[i + 2]) < 236; };
    const gapX = Math.round(width * 0.012);
    const gapY = Math.round(height * 0.012);
    const colCount = (x: number) => { let n = 0; for (let y = Math.max(3, y0 - gapY); y <= Math.min(height - 4, y1 + gapY); y++) if (dark(x, y)) n++; return n; };
    const rowCount = (y: number) => { let n = 0; for (let x = Math.max(3, x0 - gapX); x <= Math.min(width - 4, x1 + gapX); x++) if (dark(x, y)) n++; return n; };
    for (let pass = 0; pass < 3; pass++) {
      for (let miss = 0, x = x0 - 1; x >= 3 && miss <= gapX; x--) { if (colCount(x) >= 3) { x0 = x; miss = 0; } else miss++; }
      for (let miss = 0, x = x1 + 1; x < width - 3 && miss <= gapX; x++) { if (colCount(x) >= 3) { x1 = x; miss = 0; } else miss++; }
      for (let miss = 0, y = y0 - 1; y >= 3 && miss <= gapY; y--) { if (rowCount(y) >= 4) { y0 = y; miss = 0; } else miss++; }
      for (let miss = 0, y = y1 + 1; y < height - 3 && miss <= gapY; y++) { if (rowCount(y) >= 4) { y1 = y; miss = 0; } else miss++; }
    }
  }

  let dirty = 0;
  let total = 0;
  for (let x = 3; x < width - 3; x += step) for (const y of [4, height - 5]) { total++; if (Math.min(data[px(x, y)], data[px(x, y) + 1], data[px(x, y) + 2]) < 236) dirty++; }
  for (let y = 3; y < height - 3; y += step) for (const x of [4, width - 5]) { total++; if (Math.min(data[px(x, y)], data[px(x, y) + 1], data[px(x, y) + 2]) < 236) dirty++; }

  return {
    data,
    width,
    height,
    bbox: x0 < 0 || y0 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 },
    dirtyBorder: total ? dirty / total : 0,
    objects,
  };
}

/** Pose l'objet détouré sur la toile 3,4:1. `fill` réduit la largeur utile (vue fermée plus petite que l'ouverte). */
async function toCanvas(m: Measured, out: string, fill = 1): Promise<void> {
  const { data, width, height } = m;
  const b = m.bbox ?? { x: 0, y: 0, w: width, h: height };
  const pad = Math.round(Math.max(b.w, b.h) * 0.015);
  const x = Math.max(0, b.x - pad);
  const y = Math.max(0, b.y - pad);
  const w = Math.min(width - x, b.w + 2 * pad);
  const h = Math.min(height - y, b.h + 2 * pad);
  for (let i = 0; i < data.length; i += 3) if (Math.min(data[i], data[i + 1], data[i + 2]) >= 242) data.fill(255, i, i + 3);
  const boxW = Math.round(CANVAS.w * (1 - 2 * CANVAS.mx) * fill);
  const boxH = Math.round(CANVAS.h * (1 - 2 * CANVAS.my));
  const scale = Math.min(boxW / w, boxH / h, 2.4);
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));
  const object = await sharp(data, { raw: { width, height, channels: 3 } })
    .extract({ left: x, top: y, width: w, height: h })
    .resize(tw, th, { kernel: 'lanczos3' })
    .sharpen({ sigma: scale > 1.2 ? 0.8 : 0.5 })
    .png()
    .toBuffer();
  await sharp({ create: { width: CANVAS.w, height: CANVAS.h, channels: 3, background: '#ffffff' } })
    .composite([{ input: object, left: Math.round((CANVAS.w - tw) / 2), top: Math.round((CANVAS.h - th) / 2) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
}

async function loadCrops(): Promise<Crops> {
  const file = path.join(ROOT, 'scripts', 'crops.json');
  const base: Crops = { ferme: {}, cover: {}, autoCover: [], rules: {} };
  if (!existsSync(file)) return base;
  return { ...base, ...(JSON.parse(await readFile(file, 'utf8')) as Partial<Crops>) };
}

/** Photos du site actuel → vues « trois-quarts » et « fermé » par fiche. */
async function produits() {
  const crops = await loadCrops();
  const dir = path.join(RAW, 'img');
  const out = path.join(PUB, 'produits', 'site');
  await mkdir(out, { recursive: true });
  const files = (await readdir(dir)).filter((f) => /^\d+-\d+\.jpg$/.test(f));
  const ids = [...new Set(files.map((f) => f.split('-')[0]))].sort((a, b) => Number(a) - Number(b));
  const manifest: Record<string, { troisQuarts?: string; ferme?: string; ratio?: number; detoure: boolean }> = {};
  const report: string[] = [];

  for (const id of ids) {
    let coverIdx = crops.cover[id] ?? 0;
    const views = files.filter((f) => f.startsWith(`${id}-`)).map((f) => Number(f.split('-')[1].replace('.jpg', ''))).sort((a, b) => a - b);
    if (crops.cover[id] === undefined && crops.autoCover.includes(id)) {
      for (const idx of views) {
        const c = await measure(path.join(dir, `${id}-${idx}.jpg`));
        if (c.bbox && c.objects === 1 && c.dirtyBorder < 0.06 && c.bbox.w / c.bbox.h >= 3.1 && c.bbox.w > c.width * 0.4) { coverIdx = idx; break; }
      }
    }
    const coverFile = `${id}-${coverIdx}.jpg`;
    const rule = crops.rules[coverFile] ?? {};
    if (rule.skip || !files.includes(coverFile)) continue;
    const m = await measure(path.join(dir, coverFile), rule);
    const detoure = !rule.keep && m.dirtyBorder < 0.06 && m.bbox !== null;
    if (detoure) await toCanvas(m, path.join(out, `${id}.jpg`));
    else {
      // fond non détourable : on garde le cadrage, la page l'affiche dans un cadre
      await sharp(path.join(dir, coverFile)).rotate().resize(1200, 900, { fit: 'inside' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, `${id}.jpg`));
    }
    const ratio = m.bbox ? m.bbox.w / m.bbox.h : 0;
    manifest[id] = { troisQuarts: `/images/produits/site/${id}.jpg`, ratio: Math.round(ratio * 100) / 100, detoure };
    report.push(`${id}\tcover ${coverIdx}\tratio ${ratio.toFixed(2)}\tbord ${m.dirtyBorder.toFixed(2)}\t${detoure ? 'détouré' : 'CADRE'}`);

    // vue fermée : image plus trapue que la vue ouverte, sur fond détourable
    const wanted = crops.ferme[id];
    if (wanted === false || !detoure || ratio < 3.1) continue;
    const candidates = wanted !== undefined ? [wanted] : views.filter((v) => v !== coverIdx);
    for (const idx of candidates) {
      const f = `${id}-${idx}.jpg`;
      if (!files.includes(f) || crops.rules[f]?.skip) continue;
      const c = await measure(path.join(dir, f), crops.rules[f] ?? {});
      if (!c.bbox || c.dirtyBorder >= 0.06) continue;
      const r = c.bbox.w / c.bbox.h;
      if (wanted === undefined && (c.objects !== 1 || r < 1.7 || r > ratio * 0.82 || c.bbox.w < c.width * 0.3)) continue;
      await toCanvas(c, path.join(out, `${id}-ferme.jpg`), 0.6);
      manifest[id].ferme = `/images/produits/site/${id}-ferme.jpg`;
      report.push(`${id}\tfermé ${idx}\tratio ${r.toFixed(2)}`);
      break;
    }
  }
  await writeFile(path.join(ROOT, 'content/products/data/images.json'), JSON.stringify(manifest, null, 1));
  await writeFile(path.join(RAW, 'process-report.tsv'), report.join('\n'));
  console.log(`${Object.keys(manifest).length} fiches traitées, ${Object.values(manifest).filter((m) => m.ferme).length} vues fermées, ${Object.values(manifest).filter((m) => !m.detoure).length} en cadre`);
}

/** Photos du pack fourni : déjà cadrées ; on applique seulement les retouches de crops.json. */
async function pack() {
  const crops = await loadCrops();
  const src = path.join(ROOT, 'scripts', 'pack', 'produits');
  const out = path.join(PUB, 'produits');
  for (const f of await readdir(src)) {
    const rule = crops.rules[`pack/${f}`];
    if (!rule?.erase) {
      await sharp(path.join(src, f)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(out, f));
      continue;
    }
    const m = await measure(path.join(src, f), rule);
    await sharp(m.data, { raw: { width: m.width, height: m.height, channels: 3 } }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(out, f));
  }
  console.log('pack produits copié');
}

interface NbJob {
  from: string;
  to: string;
  /** Recadrage relatif après suppression des bords [gauche, haut, largeur, hauteur] en fractions. */
  crop?: [number, number, number, number];
  maxWidth?: number;
  noTrim?: boolean;
}

/** Archives, atelier, boutique : toujours en noir et blanc. */
async function nb() {
  const jobs = JSON.parse(await readFile(path.join(ROOT, 'scripts', 'nb-jobs.json'), 'utf8')) as NbJob[];
  let n = 0;
  for (const j of jobs) {
    const src = path.join(ROOT, 'scripts', j.from);
    if (!existsSync(src)) {
      console.warn(`source absente : ${j.from}`);
      continue;
    }
    let buf = await sharp(src).rotate().flatten({ background: '#ffffff' }).toBuffer();
    if (!j.noTrim) {
      try {
        buf = await sharp(buf).trim({ background: '#ffffff', threshold: 28 }).toBuffer();
      } catch {
        /* image uniforme : rien à rogner */
      }
    }
    const meta = await sharp(buf).metadata();
    let img = sharp(buf);
    const W = meta.width ?? 0;
    const H = meta.height ?? 0;
    const inset = j.noTrim ? 0 : 3;
    const c = j.crop ?? [0, 0, 1, 1];
    img = img.extract({
      left: Math.min(W - 1, Math.round(c[0] * W) + inset),
      top: Math.min(H - 1, Math.round(c[1] * H) + inset),
      width: Math.max(1, Math.round(c[2] * W) - 2 * inset),
      height: Math.max(1, Math.round(c[3] * H) - 2 * inset),
    });
    const dest = path.join(PUB, j.to);
    await mkdir(path.dirname(dest), { recursive: true });
    await img
      .resize({ width: j.maxWidth ?? 1800, withoutEnlargement: true })
      .grayscale()
      .linear(1.04, -(128 * 0.04))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dest);
    n++;
  }
  console.log(`${n} photos passées en noir et blanc`);
}

interface SwatchJob {
  id: string;
  from: string; // image détourée 1600 × 470 (public/images/…)
  /** Position horizontale dans le manche, en fraction de la largeur de l'objet (0 = pointe, 1 = bout du manche). */
  at?: number;
  /** Matière claire ou métallique : pas de recherche de rivet, découpe à l'abscisse `at`. */
  light?: boolean;
}

/** Pastilles : carré pris au centre du manche, zone sans rivet. */
async function pastilles() {
  const jobs = JSON.parse(await readFile(path.join(ROOT, 'scripts', 'swatch-jobs.json'), 'utf8')) as SwatchJob[];
  const out = path.join(PUB, 'matieres');
  for (const j of jobs) {
    const src = path.join(ROOT, 'public', j.from);
    if (!existsSync(src)) {
      console.warn(`source absente : ${j.from}`);
      continue;
    }
    const m = await measure(src);
    if (!m.bbox) continue;
    const minAt = (x: number, y: number) => { const i = (y * m.width + x) * 3; return Math.min(m.data[i], m.data[i + 1], m.data[i + 2]); };
    const maxAt = (x: number, y: number) => { const i = (y * m.width + x) * 3; return Math.max(m.data[i], m.data[i + 1], m.data[i + 2]); };
    const extent = (cx: number) => {
      let top = -1;
      let bottom = -1;
      for (let y = 0; y < m.height; y++) if (minAt(cx, y) < 228) { if (top < 0) top = y; bottom = y; }
      return { top, bottom };
    };
    // Recherche du plus grand carré entièrement dans le manche, sans fond blanc ni rivet.
    let best: { left: number; top: number; size: number; score: number } | null = null;
    const from = j.light ? (j.at ?? 0.78) : 0.52;
    const to = j.light ? (j.at ?? 0.78) : 0.95;
    for (let at = from; at <= to + 1e-9; at += 0.01) {
      const cx = Math.round(m.bbox.x + m.bbox.w * (j.at !== undefined && !j.light ? Math.min(0.95, Math.max(0.52, j.at + (at - 0.735) * 0.5)) : at));
      const { top, bottom } = extent(cx);
      if (top < 0) continue;
      for (const f of j.light ? [0.32] : [0.7, 0.58, 0.46, 0.36]) {
        const size = Math.round((bottom - top) * f);
        if (size < 28) continue;
        const left = Math.max(0, Math.min(m.width - size, cx - Math.round(size / 2)));
        const topY = Math.max(0, Math.min(m.height - size, Math.round((top + bottom) / 2 - size / 2)));
        let bad = 0;
        let n = 0;
        for (let y = topY; y < topY + size; y += 2)
          for (let x = left; x < left + size; x += 2) {
            n++;
            const lo = minAt(x, y);
            const hi = maxAt(x, y);
            // fond blanc, ou métal de rivet (clair et sans couleur)
            if (lo >= 236 || (!j.light && lo > 150 && hi - lo < 26)) bad++;
          }
        const ratio = bad / n;
        if (!j.light && ratio > 0.004) continue;
        const score = size - ratio * 1000;
        if (!best || score > best.score) best = { left, top: topY, size, score };
        break;
      }
    }
    if (!best) {
      console.warn(`pastille ${j.id} : aucune zone propre trouvée`);
      continue;
    }
    const { left, top: topY, size } = best;
    await sharp(src).extract({ left, top: topY, width: size, height: size }).resize(240, 240, { kernel: 'lanczos3' }).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(out, `sw-${j.id}.jpg`));
  }
  const available = (await readdir(out)).filter((f) => /^sw-.+\.jpg$/.test(f)).map((f) => f.slice(3, -4)).sort();
  await writeFile(path.join(ROOT, 'content/products/data/swatches.json'), JSON.stringify(available));
  console.log(`${jobs.length} pastilles traitées, ${available.length} disponibles`);
}

async function main() {
  const what = process.argv[2] ?? 'tout';
  if (what === 'pack' || what === 'tout') await pack();
  if (what === 'produits' || what === 'tout') await produits();
  if (what === 'nb' || what === 'tout') await nb();
  if (what === 'pastilles' || what === 'tout') await pastilles();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
