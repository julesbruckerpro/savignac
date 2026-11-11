/**
 * Récupère textes et images du site actuel (couteau-savignac.com).
 * - catégories → liste des produits (titre exact, prix, URL, images)
 * - pages de contenu (légales, revendeurs, visites virtuelles, presse…)
 * - images produits en plus grande taille (thickbox_default)
 * Les originaux vont dans scripts/raw/ (non commité). Délai d'1 s entre requêtes.
 *
 * Usage : npx tsx scripts/scrape-site.ts [--no-images] [--no-products]
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const BASE = 'https://www.couteau-savignac.com';
const RAW = path.join(process.cwd(), 'scripts', 'raw');
const UA = 'Mozilla/5.0 (compatible; site-migration-prototype)';
const args = new Set(process.argv.slice(2));

const CATEGORIES: Record<string, string> = {
  '12': 'couteau-pliants-poches',
  '16': 'couteau-ariegeois',
  '49': 'l-ariegeois-cran-plat',
  '19': 'le-cathare',
  '17': 'le-roques',
  '59': 'le-roques-cran-plat',
  '65': 'le-montagnol',
  '18': 'le-grat',
  '50': 'le-phasme',
  '72': 'le-capi',
  '37': 'tables',
  '55': 'l-ariegeois-de-table',
  '42': 'le-grat-de-table',
  '71': 'le-roques-de-table',
  '54': 'le-calla',
  '38': 'couteaux-de-cuisine',
  '66': 'cuisine-66',
  '68': 'cuisine-68',
  '69': 'cuisine-69',
  '40': 'prestiges',
  '44': 'fixes',
  '15': 'accessoires-pour-couteaux',
  '33': 'accessoires-33',
  '35': 'accessoires-35',
  '36': 'accessoires-36',
  '45': 'accessoires-45',
  '56': 'accessoires-56',
};

const CMS: Record<string, string> = {
  'livraison': '/fr/content/1-livraison-couteau',
  'mentions-legales': '/content/2-mentions-legales',
  'cgv': '/content/3-conditions-generales-de-vente',
  'historique': '/fr/content/4-historique-couteau-savignac',
  'etablissements': '/fr/content/8-Etablissements_historiques',
  'entretien': '/fr/content/9-conseils-et-entretien-des-couteaux',
  'production-locale': '/fr/content/10-une-production-locale',
  'gamme': '/fr/content/11-notre-gamme-de-couteaux',
  'brevets': '/fr/content/12-les-brevets-couteaux',
  'presse': '/fr/content/13-la-presse-en-parle',
  'fabrication-illustree': '/fr/content/14-Fabrication-illustree',
  'communication': '/fr/content/15-communication-de-presse',
  'catalogue': '/fr/content/16-catalogue',
  'video': '/fr/content/17-video',
  'revendeurs': '/fr/content/18-nos-revendeurs',
  'visite': '/fr/content/19-visitez-notre-boutique',
  'confidentialite': '/fr/content/20-politique-de-protection-de-la-vie-privee',
  'peysales': '/fr/content/21-atelier-production-peysales',
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const exists = (p: string) => access(p).then(() => true, () => false);

async function get(rawUrl: string, binary = false): Promise<Buffer | string | null> {
  const url = rawUrl.replace(/^http:\/\//, 'https://');
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      await sleep(1000);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP ${res.status}`);
      }
      return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) {
      console.warn(`  nouvelle tentative ${url} (${(e as Error).message})`);
      await sleep(2000 * (attempt + 1));
    }
  }
  return null;
}

async function cached(file: string, url: string): Promise<string | null> {
  const p = path.join(RAW, file);
  if (await exists(p)) return readFile(p, 'utf8');
  const html = (await get(url)) as string | null;
  if (html) await writeFile(p, html);
  return html;
}

export interface RawProduct {
  id: string;
  title: string;
  price: number; // centimes
  url: string;
  categories: string[];
  available: boolean;
  images: string[]; // identifiants d'image PrestaShop
  slug: string;
  description?: string;
  shortDescription?: string;
  availabilityText?: string;
  reference?: string;
}

async function main() {
  for (const d of ['', 'cat', 'cms', 'prod', 'img', 'cms-img']) await mkdir(path.join(RAW, d), { recursive: true });

  // 1. Pages de contenu
  for (const [name, url] of Object.entries(CMS)) {
    const html = await cached(`cms/${name}.html`, BASE + url);
    console.log(`cms ${name}: ${html ? html.length : 'introuvable'}`);
    if (html && !args.has('--no-images')) {
      const $ = cheerio.load(html);
      const srcs = new Set<string>();
      $('.rte img, .rte a').each((_, el) => {
        const s = $(el).attr('src') ?? $(el).attr('href') ?? '';
        if (/\/img\/cms\/.+\.(jpe?g|png|pdf)$/i.test(s)) srcs.add(new URL(s, BASE + url).href);
      });
      for (const s of srcs) {
        const file = path.join(RAW, 'cms-img', name + '__' + decodeURIComponent(s.split('/img/cms/')[1]).replace(/[\/\s]+/g, '_'));
        if (await exists(file)) continue;
        const buf = (await get(s, true)) as Buffer | null;
        if (buf) await writeFile(file, buf);
      }
    }
  }

  // 2. Catégories → produits
  const products = new Map<string, RawProduct>();
  for (const [id, slug] of Object.entries(CATEGORIES)) {
    const html = await cached(`cat/${id}.html`, `${BASE}/fr/${id}-${slug}?n=300`);
    if (!html) { console.log(`cat ${id}: introuvable`); continue; }
    const $ = cheerio.load(html);
    let n = 0;
    $('ul.product_list > li').each((_, li) => {
      const a = $(li).find('a.product-name').first();
      const url = a.attr('href') ?? '';
      const m = url.match(/\/(\d+)-([^/]+)\.html/);
      if (!m) return;
      const pid = m[1];
      const priceTxt = $(li).find('.right-block .product-price').first().text().trim();
      const price = Math.round(parseFloat(priceTxt.replace(/[^\d,]/g, '').replace(',', '.')) * 100);
      const img = $(li).find('img.img-responsive').attr('src') ?? '';
      const im = img.match(/\/(\d+)-home_default\//);
      const avail = $(li).find('link[itemprop=availability]').attr('href') ?? '';
      const p = products.get(pid) ?? {
        id: pid, title: a.attr('title')?.trim() ?? a.text().trim(), price, url, slug: m[2], categories: [],
        available: /InStock/.test(avail), images: im ? [im[1]] : [],
      };
      if (!p.categories.includes(id)) p.categories.push(id);
      products.set(pid, p);
      n++;
    });
    console.log(`cat ${id} (${slug}): ${n} produits · ${$('h1').first().text().trim().replace(/\s+/g, ' ')}`);
  }

  // 3. Fiches produits (toutes les images, description, disponibilité)
  if (!args.has('--no-products')) {
    for (const p of products.values()) {
      const html = await cached(`prod/${p.id}.html`, p.url);
      if (!html) continue;
      const $ = cheerio.load(html);
      const ids = new Set<string>(p.images);
      $('#thumbs_list a, #bigpic, #image-block img').each((_, el) => {
        const s = $(el).attr('href') ?? $(el).attr('src') ?? '';
        const m = s.match(/\/(\d+)-[a-z_]+_default\//);
        if (m) ids.add(m[1]);
      });
      p.images = [...ids];
      p.shortDescription = $('#short_description_content').text().trim().replace(/\s+/g, ' ') || undefined;
      p.description = $('#center_column .page-product-box .rte').first().text().trim().replace(/[ \t]+/g, ' ') || undefined;
      p.availabilityText = $('#availability_value').text().trim() || undefined;
      p.reference = $('#product_reference span').text().trim() || undefined;
    }
  }
  const list = [...products.values()].sort((a, b) => Number(a.id) - Number(b.id));
  await writeFile(path.join(RAW, 'catalogue.json'), JSON.stringify(list, null, 2));
  console.log(`${list.length} produits relevés`);

  // 4. Images produits : d'abord la vue principale de chaque fiche, puis les vues secondaires
  if (!args.has('--no-images')) {
    const maxViews = Math.max(...list.map((p) => p.images.length));
    for (let i = 0; i < maxViews; i++) {
      for (const p of list) {
        const img = p.images[i];
        if (!img) continue;
        const file = path.join(RAW, 'img', `${p.id}-${i}.jpg`);
        if (await exists(file)) continue;
        let buf: Buffer | null = null;
        for (const size of ['thickbox_default', 'large_default']) {
          buf = (await get(`${BASE}/${img}-${size}/${p.slug}.jpg`, true)) as Buffer | null;
          if (buf) break;
        }
        if (buf) await writeFile(file, buf);
        else console.warn(`image introuvable: ${p.id} ${img}`);
      }
      console.log(`vues n° ${i + 1} récupérées`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
