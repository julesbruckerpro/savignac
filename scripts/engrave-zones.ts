/**
 * Zone de gravure de chaque photo produit (lame vers la gauche, cadrage 1600 × 470).
 * Pour chaque photo : contour de l'objet, puis, sur la partie lame, ligne médiane et épaisseur
 * → position, inclinaison et taille du texte gravé, en pourcentages de l'image.
 * Résultat commité : content/products/data/engrave-zones.json
 * Usage : npx tsx scripts/engrave-zones.ts
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const DIRS = ['public/images/produits', 'public/images/produits/site'];

export interface EngraveZone {
  /** Centre du texte, en % de la largeur et de la hauteur de l'image. */
  x: number;
  y: number;
  /** Largeur disponible, en % de la largeur de l'image. */
  w: number;
  /** Hauteur de lettre, en % de la hauteur de l'image. */
  h: number;
  /** Inclinaison, en degrés. */
  rot: number;
}

async function zone(file: string): Promise<EngraveZone | null> {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const lum = (x: number, y: number) => {
    const i = (y * width + x) * 3;
    return Math.min(data[i], data[i + 1], data[i + 2]);
  };
  // colonnes occupées par l'objet
  const cols: { top: number; bottom: number }[] = [];
  let x0 = -1;
  let x1 = -1;
  for (let x = 0; x < width; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < height; y++)
      if (lum(x, y) < 232) {
        if (top < 0) top = y;
        bottom = y;
      }
    cols.push({ top, bottom });
    if (top >= 0 && bottom - top > 4) {
      if (x0 < 0) x0 = x;
      x1 = x;
    }
  }
  if (x0 < 0) return null;
  const w = x1 - x0;
  // partie lame : de 18 % à 42 % de la longueur (ni la pointe, ni le talon)
  const pts: { x: number; mid: number; th: number }[] = [];
  for (let x = Math.round(x0 + w * 0.18); x <= x0 + w * 0.42; x += 2) {
    const c = cols[x];
    if (c.top < 0) continue;
    // le bord bas de la lame : on ignore l'ombre portée (pixels pâles sous l'objet)
    let bottom = c.bottom;
    while (bottom > c.top && lum(x, bottom) > 205) bottom--;
    pts.push({ x, mid: (c.top + bottom) / 2, th: bottom - c.top });
  }
  if (pts.length < 10) return null;
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.mid, 0) / n;
  const slope = pts.reduce((s, p) => s + (p.x - mx) * (p.mid - my), 0) / pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const th = pts.map((p) => p.th).sort((a, b) => a - b)[Math.floor(n / 2)];
  // sous le marquage SAVIGNAC, vers le tranchant
  const cx = x0 + w * 0.3;
  const cy = my + slope * (cx - mx) + th * 0.16;
  const r = (v: number) => Math.round(v * 100) / 100;
  return {
    x: r((cx / width) * 100),
    y: r((cy / height) * 100),
    w: r(((w * 0.24) / width) * 100),
    h: r(((th * 0.2) / height) * 100),
    rot: r((Math.atan(slope) * 180) / Math.PI),
  };
}

async function main() {
  const out: Record<string, EngraveZone> = {};
  for (const dir of DIRS) {
    for (const f of await readdir(path.join(ROOT, dir))) {
      if (!f.endsWith('.jpg') || f.includes('ferme') || f.includes('capucin')) continue;
      const z = await zone(path.join(ROOT, dir, f));
      if (z) out[`/${dir.replace('public/', '')}/${f}`] = z;
    }
  }
  await writeFile(path.join(ROOT, 'content/products/data/engrave-zones.json'), JSON.stringify(out, null, 1));
  console.log(`${Object.keys(out).length} zones de gravure`);
}
main();
