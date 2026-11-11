/**
 * Anciennes fiches produits (…/NNN-nom.html) → nouvelle fiche, variante pré-sélectionnée.
 * Résultat commité : content/data/legacy-redirects.json (lu par content/redirects.ts).
 * Usage : npx tsx scripts/build-redirects.ts
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { products } from '../content/products';
import catalogue from '../content/products/data/site-catalogue.json';

async function main() {
  const out: { source: string; destination: string }[] = [];
  const missing: string[] = [];
  for (const sp of catalogue as unknown as { id: string; path: string; title: string }[]) {
    const product = products.find((p) => p.variants.some((v) => v.legacyId === sp.id));
    if (!product) {
      missing.push(`${sp.id} ${sp.title}`);
      continue;
    }
    const variant = product.variants.filter((v) => v.legacyId === sp.id).sort((a, b) => a.price - b.price)[0];
    const params = new URLSearchParams();
    for (const o of product.options) if (variant.options[o.id]) params.set(o.id, variant.options[o.id]!);
    const base = `${product.template === 'modele' ? '/modele' : '/produit'}/${product.handle}`;
    const q = params.toString();
    out.push({ source: sp.path, destination: q ? `${base}?${q}` : base });
  }
  await mkdir(path.join(process.cwd(), 'content', 'data'), { recursive: true });
  await writeFile(path.join(process.cwd(), 'content', 'data', 'legacy-redirects.json'), JSON.stringify(out, null, 1));
  console.log(`${out.length} redirections de fiches`, missing.length ? `— sans correspondance : ${missing.join(' | ')}` : '');
}
main();
