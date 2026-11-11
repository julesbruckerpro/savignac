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
