import { collections } from '@/content/collections';
import { products as rawProducts } from '@/content/products';
import { typoDeep } from '@/lib/typo';
import type { CommerceAdapter } from './adapter';
import type { Listing, OptionId, Product, Variant } from './types';

/** Prototype : lit /content. Seul ce fichier importe les données ; les composants passent par `commerce`. */
const products: Product[] = rawProducts.map((p) => typoDeep(p));

const STEEL_FACET: Record<string, string> = { '14C28': 'inox-14c28', XC75: 'carbone-xc75', RWL34: 'rwl34', damas: 'damas' };
const HANDLE_FACETS = new Set(['bois-locaux', 'bois-precieux', 'corne', 'synthetique']);

export function productHref(p: Pick<Product, 'template' | 'handle'>, options?: Partial<Record<OptionId, string>>): string {
  const base = p.template === 'modele' ? `/modele/${p.handle}` : `/produit/${p.handle}`;
  const entries = Object.entries(options ?? {}).filter(([, v]) => v);
  return entries.length ? `${base}?${entries.map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&')}` : base;
}

export function matches(v: Variant, preset?: Partial<Record<OptionId, string>>): boolean {
  return Object.entries(preset ?? {}).every(([k, val]) => v.options[k as OptionId] === val);
}

function buildListings(p: Product): Listing[] {
  const defs =
    p.listings.length > 0
      ? p.listings
      : [
          {
            id: p.handle,
            name: p.name,
            kicker: p.kicker,
            shortLine: p.shortLine,
            image: (p.variants.find((v) => v.sku === p.defaultVariantSku) ?? p.variants[0]).images.troisQuarts ?? '',
            imageAlt: p.name,
          },
        ];
  const mancheOption = p.options.find((o) => o.id === 'manche');
  return defs.map((def) => {
    const variants = p.variants.filter((v) => matches(v, def.preset));
    const prices = variants.map((v) => v.price);
    const mancheIds = [...new Set(variants.map((v) => v.options.manche).filter(Boolean))] as string[];
    const swatches = (mancheOption?.values ?? []).filter((v) => mancheIds.includes(v.id)).map((v) => ({ id: v.id, label: v.label, swatch: v.swatch }));
    const groups = new Set((mancheOption?.values ?? []).filter((v) => mancheIds.includes(v.id)).map((v) => v.group as string));
    const mecanismes = def.preset?.mecanisme ? [def.preset.mecanisme] : p.mechanisms.filter((m) => m !== 'fixe');
    return {
      ...def,
      productHandle: p.handle,
      href: productHref(p, p.listings.length > 1 ? def.preset : undefined),
      category: p.category,
      fromPrice: Math.min(...prices),
      toPrice: Math.max(...prices),
      variantCount: variants.length,
      swatches,
      facets: {
        mecanisme: mecanismes,
        manche: [...groups].filter((g) => HANDLE_FACETS.has(g)),
        acier: [...new Set(variants.map((v) => STEEL_FACET[v.options.lame ?? '']).filter(Boolean))],
      },
    };
  });
}

const listings: Listing[] = products.flatMap(buildListings);
const NEW = new Set(['le-capi', 'le-roques-cran-plat', 'le-phasme']);
for (const l of listings) if (NEW.has(l.id)) l.isNew = true;

const IN_COLLECTION: Record<string, (l: Listing) => boolean> = {
  tous: (l) => l.category !== 'accessoires',
  poche: (l) => l.category === 'poche',
  friction: (l) => l.category === 'poche' && (l.facets.mecanisme.includes('friction') || l.facets.mecanisme.includes('piemontais')),
  systeme: (l) => l.category === 'poche' && l.facets.mecanisme.includes('cran-plat'),
  table: (l) => l.category === 'table',
  cuisine: (l) => l.category === 'cuisine',
  fixes: (l) => l.category === 'fixes',
  accessoires: (l) => l.category === 'accessoires',
};

export interface PrestigePiece {
  id: string;
  product: Pick<Product, 'handle' | 'name' | 'template'>;
  title: string;
  mechanism?: string;
  variants: Variant[];
  mancheLabels: Record<string, string>;
  href: string;
}

export const commerce: CommerceAdapter & {
  getListingsById(ids: string[], locale: string): Promise<Listing[]>;
  getPrestigePieces(locale: string): Promise<PrestigePiece[]>;
  getCollections(): typeof collections;
} = {
  async getProduct(handle) {
    return products.find((p) => p.handle === handle) ?? null;
  },
  async getAllProducts() {
    return products;
  },
  async getListings() {
    return listings;
  },
  async getListingsById(ids) {
    return ids.map((id) => listings.find((l) => l.id === id)).filter((l): l is Listing => !!l);
  },
  async getCollection(handle) {
    const collection = collections.find((c) => c.handle === handle);
    if (!collection) return null;
    const c = typoDeep(collection);
    const filter = IN_COLLECTION[handle];
    const ls = filter ? listings.filter(filter) : [];
    const handles = new Set(ls.map((l) => l.productHandle));
    return { collection: c, title: c.title, products: products.filter((p) => handles.has(p.handle)), listings: ls };
  },
  /** Prestige = variantes étiquetées « prestige » : une seule source de données, deux affichages. */
  async getPrestigePieces() {
    const order = ['48', '51', '52', '105', '110', '124', '132', '194', '195'];
    const pieces: PrestigePiece[] = [];
    for (const p of products) {
      const byLegacy = new Map<string, Variant[]>();
      for (const v of p.variants) if (v.tags?.includes('prestige') && v.legacyId) byLegacy.set(v.legacyId, [...(byLegacy.get(v.legacyId) ?? []), v]);
      for (const [id, unsorted] of byLegacy) {
        // la finition réellement photographiée d'abord
        const variants = [...unsorted].sort((a, b) => Number(b.images.exact !== false) - Number(a.images.exact !== false));
        const manche = p.options.find((o) => o.id === 'manche');
        pieces.push({
          id,
          product: { handle: p.handle, name: p.name, template: p.template },
          title: variants[0].title,
          mechanism: variants[0].options.mecanisme,
          variants,
          mancheLabels: Object.fromEntries((manche?.values ?? []).map((v) => [v.id, v.label])),
          href: productHref(p, variants[0].options),
        });
      }
    }
    return pieces.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  },
  getCollections() {
    return collections.map((c) => typoDeep(c));
  },
};
