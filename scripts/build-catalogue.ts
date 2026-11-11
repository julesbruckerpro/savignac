/**
 * Transforme le relevé brut (scripts/raw) en données de catalogue commitées :
 * content/products/data/site-catalogue.json
 * Pour chaque fiche du site : titre exact, prix TTC, déclinaisons (attributs et écarts de prix),
 * disponibilité et mention de délai (stockées, masquées dans le prototype).
 *
 * Usage : npx tsx scripts/build-catalogue.ts
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { RawProduct } from './scrape-site';

const RAW = path.join(process.cwd(), 'scripts', 'raw');

export interface SiteCombo {
  attrs: Record<string, string>;
  /** Prix TTC de la déclinaison, en centimes. */
  price: number;
}
export interface SiteProduct {
  id: string;
  title: string;
  /** Prix TTC affiché sur le site (déclinaison par défaut), en centimes. */
  price: number;
  path: string;
  categories: string[];
  inStock: boolean;
  availabilityText?: string;
  groups: Record<string, string[]>;
  combos: SiteCombo[];
  views: number;
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

async function main() {
  const list = JSON.parse(await readFile(path.join(RAW, 'catalogue.json'), 'utf8')) as RawProduct[];
  const out: SiteProduct[] = [];
  for (const p of list) {
    const html = await readFile(path.join(RAW, 'prod', `${p.id}.html`), 'utf8');
    const num = (name: string) => {
      const m = html.match(new RegExp(`var ${name}\\s*=\\s*([\\d.]+);`));
      return m ? parseFloat(m[1]) : NaN;
    };
    const priceHT = num('productPriceTaxExcluded');
    const taxRate = num('taxRate');
    const groupNames: Record<string, string> = {};
    const gm = html.match(/var attributesCombinations\s*=\s*(\[.*?\]);/s);
    if (gm) {
      for (const a of JSON.parse(gm[1]) as { id_attribute_group: string; group: string }[]) groupNames[a.id_attribute_group] = a.group;
    }
    // libellés lisibles des groupes
    const labels: Record<string, string> = {};
    for (const m of html.matchAll(/<fieldset class="attribute_fieldset">\s*<label[^>]*>(.*?)<\/label>[\s\S]*?(?:name|id)="group_(\d+)"/g)) {
      labels[m[2]] = decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s*:?\s*$/, '');
    }
    const combos: SiteCombo[] = [];
    const groups: Record<string, string[]> = {};
    const cm = html.match(/var combinations\s*=\s*(\{.*?\});\s*var/s);
    if (cm && Number.isFinite(priceHT)) {
      const raw = JSON.parse(cm[1]) as Record<string, { attributes_values: Record<string, string>; price: number }>;
      for (const c of Object.values(raw)) {
        const attrs: Record<string, string> = {};
        for (const [gid, value] of Object.entries(c.attributes_values)) {
          const g = labels[gid] ?? groupNames[gid] ?? gid;
          const v = decode(value);
          attrs[g] = v;
          (groups[g] ??= []).includes(v) || groups[g].push(v);
        }
        combos.push({ attrs, price: Math.round((priceHT + Number(c.price)) * (1 + taxRate / 100) * 100) });
      }
    }
    // Les prix du site sont des euros ronds : on absorbe l'arrondi HT → TTC (ex. 561,9996 €).
    const tidy = (c: number) => (Math.abs(c - Math.round(c / 100) * 100) <= 2 ? Math.round(c / 100) * 100 : c);
    for (const c of combos) c.price = tidy(c.price);
    const am = html.match(/id="availability_value"[^>]*>([\s\S]*?)<\/span>/);
    const availabilityText = am ? decode(am[1].replace(/<[^>]+>/g, '')) : '';
    out.push({
      id: p.id,
      title: p.title,
      price: tidy(p.price),
      path: new URL(p.url).pathname,
      categories: p.categories,
      inStock: p.available,
      availabilityText: availabilityText || undefined,
      groups,
      combos,
      views: p.images.length,
    });
    const min = combos.length ? Math.min(...combos.map((c) => c.price)) : p.price;
    if (combos.length && !combos.some((c) => c.price === tidy(p.price))) console.warn(`! ${p.id} ${p.title}: prix affiché ${p.price / 100} € absent des déclinaisons (min ${min / 100} €)`);
  }
  await writeFile(path.join(process.cwd(), 'content/products/data/site-catalogue.json'), JSON.stringify(out, null, 1));
  console.log(`${out.length} fiches écrites`);
  const names = new Set(out.flatMap((p) => Object.keys(p.groups)));
  console.log('groupes :', [...names].join(' | '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
