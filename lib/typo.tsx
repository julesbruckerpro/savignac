import { Fragment, type ReactNode } from 'react';

const NNBSP = ' '; // espace fine insécable
const NBSP = ' ';

/** Typographie française : apostrophes courbes, espaces insécables avant ; ? ! : et dans « 73 € ». */
export function typo(s: string): string {
  return s
    .replace(/(\p{L})'(\p{L})/gu, '$1’$2')
    .replace(/ ([;?!])/g, `${NNBSP}$1`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (€|%|h\b|g\b|cm\b|mm\b|°)/g, `$1${NNBSP}$2`)
    .replace(/(\d) (\d{3})\b/g, `$1${NNBSP}$2`);
}

const TECHNICAL = new Set(['handle', 'sku', 'id', 'href', 'image', 'imageClosed', 'swatch', 'troisQuarts', 'ferme', 'dos', 'legacyId', 'src', 'url', 'slug', 'from', 'to', 'file', 'embed', 'source', 'destination']);

/** Applique typo() à toutes les chaînes affichables d'un objet de contenu. */
export function typoDeep<T>(value: T, key?: string, parent?: string): T {
  if (typeof value === 'string') {
    if ((key && TECHNICAL.has(key)) || value.startsWith('/') || value.startsWith('http')) return value;
    if (parent === 'variants' && key === 'title') return value; // titre exact du site, conservé tel quel
    return typo(value) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => typoDeep(v, key, key)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = k === 'options' && parent === 'variants' ? v : typoDeep(v, k, Array.isArray(v) ? k : key === 'variants' || parent === 'variants' ? 'variants' : k);
    }
    return out as T;
  }
  return value;
}

/** Rendu des exposants : « XVIIIᵉ » → XVIII<sup>e</sup>, « 1ᵉʳ » → 1<sup>er</sup>. */
export function rich(s: string): ReactNode {
  if (!/[ᵉʳ]/.test(s)) return s;
  const parts = s.split(/(ᵉʳ|ᵉ)/);
  return parts.map((p, i) => (p === 'ᵉ' ? <sup key={i}>e</sup> : p === 'ᵉʳ' ? <sup key={i}>er</sup> : <Fragment key={i}>{p}</Fragment>));
}
