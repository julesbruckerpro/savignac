/**
 * Transforme les pages de contenu récupérées (scripts/raw/cms) en données commitées :
 *   content/dealers.json      revendeurs et restaurants partenaires (sans coordonnées)
 *   content/legal/*.json      CGV, mentions légales, confidentialité : texte intégral, non réécrit
 * Usage : npx tsx scripts/parse-content.ts
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = process.cwd();
const RAW = path.join(ROOT, 'scripts', 'raw', 'cms');

const DEPARTMENTS: Record<string, string> = {
  '01': 'Ain', '03': 'Allier', '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '09': 'Ariège', '11': 'Aude', '12': 'Aveyron',
  '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente', '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze',
  '21': 'Côte-d’Or', '24': 'Dordogne', '26': 'Drôme', '29': 'Finistère', '31': 'Haute-Garonne', '33': 'Gironde', '34': 'Hérault',
  '35': 'Ille-et-Vilaine', '37': 'Indre-et-Loire', '40': 'Landes', '43': 'Haute-Loire', '45': 'Loiret', '46': 'Lot', '48': 'Lozère',
  '51': 'Marne', '56': 'Morbihan', '59': 'Nord', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '69': 'Rhône',
  '71': 'Saône-et-Loire', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris', '81': 'Tarn', '83': 'Var', '84': 'Vaucluse',
};

export interface Dealer {
  id: string;
  kind: 'revendeur' | 'partenaire';
  name: string;
  address: string;
  postalCode: string;
  city: string;
  department: string;
  departmentCode: string;
  country: 'France' | 'Belgique';
  phone?: string;
  url?: string;
  /** Partenaires : le couteau de la Maison présent à table. */
  note?: string;
  lat?: number;
  lng?: number;
}

const SMALL = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'à', 'au', 'aux', 'sur', 'sous', "d'", "l'", 'd’', 'l’']);
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|[\s\-'’"(])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .split(/(?<=[ -])/)
    .map((w, i) => (i > 0 && SMALL.has(w.replace(/[ -]$/, '').toLowerCase()) ? w.toLowerCase() : w))
    .join('')
    .replace(/\b([DL])['’](\p{L})/gu, (_, a: string, b: string) => `${a.toLowerCase()}’${b.toUpperCase()}`)
    .replace(/^([dl])’/, (m) => m.toUpperCase())
    .replace(/'/g, '’');
}
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function dealers() {
  const $ = cheerio.load(await readFile(path.join(RAW, 'revendeurs.html'), 'utf8'));
  const rte = $('.rte').first();
  rte.find('br').replaceWith('\n');
  rte.find('h1,h2,h3,p,div,li').each((_, el) => {
    $(el).prepend('\n');
    $(el).append('\n');
  });
  rte.find('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && /^https?:/.test(href)) $(el).text(href);
  });
  rte.find('strong,b').each((_, el) => {
    const t = $(el).text().trim();
    if (t) $(el).text(`**${t}**`);
  });
  const lines = rte
    .text()
    .split('\n')
    .map((l) => l.replace(/ /g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const out: Dealer[] = [];
  let kind: Dealer['kind'] = 'revendeur';
  let dept = { code: '', name: '' };
  let country: Dealer['country'] = 'France';
  let cur: (Partial<Dealer> & { pre: string[] }) | null = null;
  const flush = () => {
    if (cur?.name && cur.postalCode) {
      const { pre, ...d } = cur;
      void pre;
      out.push({ ...(d as Dealer), id: slug(`${d.name}-${d.city}`) });
    }
    cur = null;
  };
  for (const raw of lines) {
    const bold = /^\*\*.*\*\*$/.test(raw);
    const line = raw.replace(/\*\*/g, '').trim();
    if (!line || line === '##') continue;
    if (/^nos partenaires$/i.test(line)) { flush(); kind = 'partenaire'; country = 'France'; continue; }
    if (/^nos revendeurs$/i.test(line) || /^cliquez/i.test(line)) continue;
    if (/^belgique$/i.test(line)) { flush(); country = 'Belgique'; dept = { code: 'BE', name: 'Belgique' }; continue; }
    const dm = line.match(/^(.+?)\s*[-–]\s*(\d{2})$/);
    if (dm && line === line.toUpperCase()) { flush(); dept = { code: dm[2], name: DEPARTMENTS[dm[2]] ?? titleCase(dm[1]) }; country = 'France'; continue; }
    if (bold) {
      flush();
      cur = { kind, name: /[a-zà-ÿ]/.test(line) ? line.replace(/'/g, '’') : titleCase(line), pre: [], country };
      continue;
    }
    if (!cur) continue;
    const pm = line.match(/^(\d{4,5})\s+(.+)$/);
    if (pm && !cur.postalCode) {
      cur.address = cur.pre.join(', ').replace(/'/g, '’');
      cur.postalCode = pm[1];
      cur.city = titleCase(pm[2]).replace(/\bCedex.*$/i, '').trim();
      continue;
    }
    if (!cur.postalCode) { cur.pre.push(line); continue; }
    if (/^(\+?\d[\d .]{8,})$/.test(line)) { cur.phone = line.trim(); continue; }
    if (/^(https?:\/\/|www\.)\S+$/i.test(line) || (/^\S+\.\S+$/.test(line) && !/\s/.test(line))) {
      if (!/facebook\.com$/i.test(line)) cur.url = /^https?:/.test(line) ? line : `https://${line}`;
      continue;
    }
    if (kind === 'partenaire' && !cur.note) cur.note = line.replace(/'/g, '’');
  }
  flush();

  for (const d of out) {
    // Le département suit le code postal (corrige « Coutellerie du Vieil Antibes », classée 05 sur le site actuel).
    if (d.country === 'France') {
      const code = d.postalCode.slice(0, 2);
      d.departmentCode = code;
      d.department = DEPARTMENTS[code] ?? d.department ?? code;
    } else {
      d.departmentCode = 'BE';
      d.department = 'Belgique';
    }
  }
  // on conserve les coordonnées déjà calculées
  const dest = path.join(ROOT, 'content', 'dealers.json');
  if (existsSync(dest)) {
    const prev = new Map((JSON.parse(await readFile(dest, 'utf8')) as Dealer[]).map((d) => [d.id, d]));
    for (const d of out) {
      const p = prev.get(d.id);
      if (p?.lat !== undefined && p.address === d.address) { d.lat = p.lat; d.lng = p.lng; }
    }
  }
  await writeFile(dest, JSON.stringify(out, null, 1));
  console.log(`${out.filter((d) => d.kind === 'revendeur').length} revendeurs, ${out.filter((d) => d.kind === 'partenaire').length} partenaires`);
}

interface LegalBlock { type: 'h2' | 'h3' | 'p' | 'ul'; text?: string; items?: string[]; id?: string }

async function legal(name: string, title: string) {
  const $ = cheerio.load(await readFile(path.join(RAW, `${name}.html`), 'utf8'));
  const rte = $('.rte').first();
  rte.find('br').replaceWith('\n');
  const blocks: LegalBlock[] = [];
  const clean = (s: string) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const push = (b: LegalBlock) => {
    if (b.type === 'ul' ? b.items?.length : b.text) blocks.push(b);
  };
  const walk = (nodes: cheerio.Cheerio<never>) => {
    nodes.each((_, node) => {
      const el = $(node);
      const tag = (node as { tagName?: string }).tagName?.toLowerCase();
      if (!tag) {
        const t = clean(el.text());
        if (t) push({ type: 'p', text: t });
        return;
      }
      if (/^h[1-6]$/.test(tag)) return push({ type: tag === 'h1' || tag === 'h2' ? 'h2' : 'h3', text: clean(el.text()) });
      if (tag === 'ul' || tag === 'ol') return push({ type: 'ul', items: el.children('li').map((__, li) => clean($(li).text())).get().filter(Boolean) });
      if (tag === 'p') {
        const text = clean(el.text());
        if (!text) return;
        const strong = clean(el.find('strong,b').first().text());
        // un paragraphe entièrement en gras, court et sans point final est un intertitre
        if (strong && strong === text && text.length < 70 && !/[.;,]$/.test(text)) return push({ type: 'h3', text });
        for (const part of el.text().split('\n').map(clean).filter(Boolean)) push({ type: 'p', text: part });
        return;
      }
      if (tag === 'div' || tag === 'section' || tag === 'span' || tag === 'blockquote') return walk(el.contents() as never);
      if (tag === 'table') {
        el.find('tr').each((__, tr) => push({ type: 'p', text: clean($(tr).text()) }));
        return;
      }
      const t = clean(el.text());
      if (t) push({ type: 'p', text: t });
    });
  };
  walk(rte.contents() as never);
  let n = 0;
  for (const b of blocks) if (b.type === 'h2' || b.type === 'h3') b.id = `section-${++n}`;
  await mkdir(path.join(ROOT, 'content', 'legal'), { recursive: true });
  await writeFile(path.join(ROOT, 'content', 'legal', `${name}.json`), JSON.stringify({ title, source: 'couteau-savignac.com', retrieved: '2026-11-11', blocks }, null, 1));
  console.log(`${name}: ${blocks.length} blocs, ${blocks.filter((b) => b.type !== 'p' && b.type !== 'ul').length} titres`);
}

async function main() {
  await dealers();
  await legal('cgv', 'Conditions générales de vente');
  await legal('mentions-legales', 'Mentions légales');
  await legal('confidentialite', 'Politique de protection de la vie privée');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
