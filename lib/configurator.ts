import { MECHANISM_LABELS, STEEL_PHRASE } from '@/content/materials';
import type { OptionId, Product, Variant } from './commerce/types';

export type Selection = Partial<Record<OptionId, string>>;

/** Ordre des choix (cahier 8.2) : mécanisme → format → manche → lame. */
export const ORDER: OptionId[] = ['mecanisme', 'format', 'manche', 'lame'];

export function defaultVariant(product: Product, preset: Selection = {}): Variant {
  const wanted = Object.entries(preset).filter(([k, v]) => v && ORDER.includes(k as OptionId)) as [OptionId, string][];
  if (wanted.length === 0) return product.variants.find((v) => v.sku === product.defaultVariantSku) ?? product.variants[0];
  return pick(product, preset, undefined) ?? product.variants[0];
}

/**
 * Choisit la variante la plus proche d'une sélection : la valeur que l'on vient de choisir est imposée,
 * les autres sont conservées quand la combinaison existe, sinon on bascule sur la première compatible.
 * Une combinaison qui n'existe pas sur le site actuel n'est jamais sélectionnable.
 */
export function pick(product: Product, wanted: Selection, locked: OptionId | undefined, prefer: Selection = {}): Variant | null {
  let pool = product.variants;
  if (locked && wanted[locked]) pool = pool.filter((v) => v.options[locked] === wanted[locked]);
  if (pool.length === 0) return null;
  const score = (v: Variant) => {
    let s = 0;
    ORDER.forEach((id, i) => {
      const weight = 2 ** (ORDER.length - i + 4);
      if (wanted[id] && v.options[id] === wanted[id]) s += weight;
      if (prefer[id] && v.options[id] === prefer[id]) s += 8;
    });
    if (v.sku === product.defaultVariantSku) s += 1;
    return s;
  };
  return pool.reduce((best, v) => (score(v) > score(best) ? v : best), pool[0]);
}

/** Valeurs proposées pour une option, compte tenu des choix faits en amont. */
export function valuesFor(product: Product, id: OptionId, selection: Selection): { id: string; fromPrice: number; compatible: boolean }[] {
  const upstream = ORDER.slice(0, ORDER.indexOf(id));
  // la lame se choisit parmi tous les aciers du mécanisme : choisir le damas bascule le manche si besoin
  const scope = id === 'lame' ? upstream.filter((u) => u === 'mecanisme' || u === 'format') : upstream;
  const inScope = product.variants.filter((v) => scope.every((u) => !selection[u] || v.options[u] === selection[u]));
  const strict = product.variants.filter((v) => upstream.every((u) => !selection[u] || v.options[u] === selection[u]));
  const option = product.options.find((o) => o.id === id);
  if (!option) return [];
  return option.values
    .filter((val) => inScope.some((v) => v.options[id] === val.id))
    .map((val) => {
      const exact = strict.filter((v) => v.options[id] === val.id);
      const any = inScope.filter((v) => v.options[id] === val.id);
      return { id: val.id, fromPrice: Math.min(...(exact.length ? exact : any).map((v) => v.price)), compatible: exact.length > 0 };
    });
}

export function label(product: Product, id: OptionId, value: string | undefined): string {
  if (!value) return '';
  return product.options.find((o) => o.id === id)?.values.find((v) => v.id === value)?.label ?? value;
}

/** « Corne noire à facettes, lame inox 14C28 » */
export function finishLabel(product: Product, v: Variant): string {
  const parts: string[] = [];
  if (v.options.format) parts.push(label(product, 'format', v.options.format));
  if (v.options.manche) parts.push(label(product, 'manche', v.options.manche));
  if (v.options.lame) parts.push(STEEL_PHRASE[v.options.lame] ?? v.options.lame);
  if (v.options.mecanisme && product.mechanisms.length > 1 && v.options.mecanisme !== 'friction') parts.push((MECHANISM_LABELS[v.options.mecanisme] ?? '').toLowerCase());
  const s = parts.join(', ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function selectionToQuery(product: Product, v: Variant): string {
  const params = new URLSearchParams();
  for (const id of ORDER) {
    const val = v.options[id];
    if (val && product.options.some((o) => o.id === id)) params.set(id, val);
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

/** Caractères admis pour la gravure : lettres, chiffres, espaces, apostrophe, tiret, point, esperluette. */
export function sanitizeEngraving(raw: string, max: number): string {
  return raw
    .replace(/[^\p{L}\p{N} '’\-.&]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, max);
}

/* ------------------------------------------------------------------ fiche produit : détail technique */

const MADE_TO_ORDER_MECHANISMS = new Set(['cran-plat', 'piemontais']);

/** Délai affiché sans chiffre tant que l'atelier n'a pas confirmé les règles exactes. */
export function availability(product: Product, v: Variant): { kind: 'stock' | 'commande'; label: string } {
  const mechanism = v.options.mecanisme ?? product.mechanisms[0];
  const onOrder = v.tags?.includes('prestige') || v.options.lame === 'damas' || MADE_TO_ORDER_MECHANISMS.has(mechanism ?? '') || !!v.madeToOrder;
  return onOrder ? { kind: 'commande', label: 'Fabriqué à la commande à Foix' } : { kind: 'stock', label: 'Généralement expédié sous 48 h' };
}

const MECHANISM_TEXT: Record<string, string> = {
  friction: 'Deux clous : la lame tourne sur l’un, s’arrête sur l’autre. Léger, simple, sans ressort.',
  'cran-plat': 'Un ressort maintient la lame ouverte et l’arrête à 90° ; il faut prolonger le geste pour la refermer.',
  piemontais: 'Lentille dite piémontaise : il s’ouvre et se ferme d’une main et reste bloqué en position ouverte.',
};

const STEEL_TEXT: Record<string, { name: string; text: string }> = {
  '14C28': { name: 'Inox 14C28', text: 'Acier inoxydable Sandvik, dureté 59 ± 1 HRC. Il ne craint pas l’humidité et se laisse oublier.' },
  XC75: { name: 'Carbone XC75', text: 'Acier carbone des aciéries de Bonpertuis, dureté 59 ± 1 HRC. Il s’affûte volontiers et se patine : à essuyer et huiler.' },
  RWL34: { name: 'RWL34', text: 'Acier inoxydable fritté, dureté 60 ± 1 HRC.' },
  damas: { name: 'Damas', text: 'Damasteel, mélange de RWL34 et de PMC27 : un damas inoxydable, dureté 60 ± 1 HRC.' },
};

const CARE_TEXT: Record<string, string> = {
  corne: 'Nourrir la corne d’un peu d’huile de temps en temps ; ne pas la laisser tremper, jamais de lave-vaisselle.',
  bois: 'Huiler le manche de temps en temps ; ne pas le laisser tremper, jamais de lave-vaisselle.',
  autre: 'Essuyer la lame avec un chiffon humide plutôt que sous l’eau ; jamais de lave-vaisselle.',
};

export interface DetailRow {
  label: string;
  value: string;
  note?: string;
}

/** Les rubriques de la fiche, dans l'ordre demandé : mécanisme, lame, manche, fabrication, mesures, colis, entretien. */
export function detailRows(product: Product, v: Variant, specs: { label: string; value: string }[]): DetailRow[] {
  const rows: DetailRow[] = [];
  const mechanism = v.options.mecanisme ?? product.mechanisms[0];
  if (mechanism && MECHANISM_TEXT[mechanism]) rows.push({ label: 'Mécanisme', value: MECHANISM_LABELS[mechanism], note: MECHANISM_TEXT[mechanism] });
  const steel = v.options.lame ? STEEL_TEXT[v.options.lame] : undefined;
  if (steel) rows.push({ label: 'Lame', value: steel.name, note: steel.text });
  const manche = v.options.manche;
  const mancheOption = product.options.find((o) => o.id === 'manche')?.values.find((x) => x.id === manche);
  if (manche && product.category !== 'accessoires') {
    const group = mancheOption?.group;
    const groupText = group === 'bois-locaux' ? 'Bois d’Ariège, séché sur place et imprégné d’huile de lin.' : group === 'corne' ? 'Corne taillée dans la masse.' : undefined;
    rows.push({ label: 'Manche', value: label(product, 'manche', manche), note: groupText });
  }
  if (product.category === 'poche') {
    const atelier = v.tags?.includes('prestige') || v.options.lame === 'damas' ? 'Entièrement façonné à l’atelier de Foix.' : 'Monté à l’atelier de Foix.';
    rows.push({ label: 'Fabrication', value: atelier });
  }
  for (const s of specs) rows.push({ label: s.label, value: s.value });
  if (v.included?.length) rows.push({ label: 'Livré avec', value: v.included.join(', ') });
  if (product.category !== 'accessoires') {
    const group = mancheOption?.group;
    const care = group === 'corne' ? CARE_TEXT.corne : group === 'bois-locaux' || group === 'bois-precieux' ? CARE_TEXT.bois : CARE_TEXT.autre;
    rows.push({ label: 'Entretien', value: v.options.lame === 'XC75' ? `${care} La lame carbone s’essuie et s’huile après usage.` : care });
  }
  return rows;
}
