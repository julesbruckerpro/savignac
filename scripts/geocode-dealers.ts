/**
 * Adresses des revendeurs → coordonnées (Nominatim, 1 requête par seconde).
 * À lancer une seule fois : le résultat est commité dans content/dealers.json.
 * Usage : NODE_USE_ENV_PROXY=1 npx tsx scripts/geocode-dealers.ts
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Dealer } from './parse-content';

const FILE = path.join(process.cwd(), 'content', 'dealers.json');
const UA = 'savignac-site-prototype/1.0 (geocodage ponctuel des revendeurs)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function search(q: string, country: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=${country}&q=${encodeURIComponent(q)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'fr' } });
      await sleep(1100);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { lat: string; lon: string }[];
      return data[0] ? { lat: Number(Number(data[0].lat).toFixed(5)), lng: Number(Number(data[0].lon).toFixed(5)) } : null;
    } catch (e) {
      console.warn(`  nouvelle tentative (${(e as Error).message})`);
      await sleep(3000);
    }
  }
  return null;
}

async function main() {
  const dealers = JSON.parse(await readFile(FILE, 'utf8')) as Dealer[];
  let approx = 0;
  for (const d of dealers) {
    if (d.lat !== undefined && d.lng !== undefined) continue;
    const cc = d.country === 'Belgique' ? 'be' : 'fr';
    const exact = await search(`${d.address}, ${d.postalCode} ${d.city}`, cc);
    const hit = exact ?? (await search(`${d.postalCode} ${d.city}`, cc)) ?? (await search(d.city, cc));
    if (hit) {
      d.lat = hit.lat;
      d.lng = hit.lng;
      if (!exact) approx++;
    } else console.warn(`introuvable : ${d.name}, ${d.city}`);
    await writeFile(FILE, JSON.stringify(dealers, null, 1));
  }
  console.log(`${dealers.filter((d) => d.lat !== undefined).length}/${dealers.length} géocodés (${approx} au niveau de la commune)`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
