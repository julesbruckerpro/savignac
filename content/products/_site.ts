import type { ListingDef, OptionId, Product, ProductOption, Variant, VariantImages } from '@/lib/commerce/types';
import { FORMAT_LABELS, MATERIALS, MATERIAL_IDS, MECHANISM_LABELS, STEEL_LABELS, STEEL_PHRASE, materialValue } from '../materials';
import catalogue from './data/site-catalogue.json';
import manifest from './data/images.json';

interface SiteProduct {
  id: string;
  title: string;
  price: number;
  path: string;
  categories: string[];
  inStock: boolean;
  availabilityText?: string;
  groups: Record<string, string[]>;
  combos: { attrs: Record<string, string>; price: number }[];
  views: number;
}
const SITE = new Map((catalogue as unknown as SiteProduct[]).map((p) => [p.id, p]));
const IMAGES = manifest as unknown as Record<string, { troisQuarts?: string; ferme?: string; detoure: boolean }>;

const LAME: Record<string, string> = { 'Inoxydable 14C28': '14C28', 'Carbone XC75': 'XC75', Damasteel: 'damas' };
const MANCHE: Record<string, string> = {
  'Corne blonde': 'corne-blonde',
  'Corne noire': 'corne-noire',
  'Corian blanc': 'corian-blanc',
  'Corian Noir': 'corian-noir',
  Chêne: 'chene',
  Noyer: 'noyer',
  Frêne: 'frene',
  Prunier: 'prunier',
  Buis: 'buis',
  "Bois de fer d'arizona": 'bois-de-fer-arizona',
  'Ebène royale': 'ebene-royal',
  'Bouleau madré': 'bouleau-madre',
  Noir: 'noir',
  Marron: 'marron',
};
const FORMAT: Record<string, string> = {
  "Couteau à l'unité": 'unite',
  'Duo de table': 'duo',
  'Coffret de 6 couteaux': 'coffret-6',
  'Pierre naturelle à aiguiser PM': 'pm',
  'Pierre naturelle à aiguiser MM': 'mm',
  'Pierre naturelle à aiguiser GM': 'gm',
  'Pierre synthétique corindon PM': 'pm',
  'Pierre synthétique corindon MM': 'mm',
  'Pierre synthétique corindon GM': 'gm',
  Petit: 'petit',
  Grand: 'grand',
  'Ciselage court': 'court',
  'Ciselage Long': 'long',
};
const MANCHE_GROUPS = ['Choix du manche', "Couleur de l'accessoire"];

const DELAYS: [RegExp, string][] = [
  [/1 ?semaine/i, 'Fabriqué sur mesure. Délai : une semaine.'],
  [/2 ?semaines/i, 'Fabriqué sur mesure. Délai : deux semaines.'],
  [/1 ?mois/i, 'Fabriqué sur mesure. Délai : un mois.'],
  [/contacter|consulter/i, 'Fabriqué sur mesure. Délai sur demande.'],
];

export interface Pick {
  mecanisme?: string;
  manche?: string;
  format?: string;
  /** Acier imposé (titre « damas », ou fiche sans choix de lame). `false` : pas d'option lame (accessoires). */
  lame?: string | false;
  /** Restreint les aciers proposés par le site (ex. Montagnol : inox seulement). */
  lames?: string[];
  /** Déploie le choix de manche (ou de couleur) proposé sur la fiche du site. */
  mancheGroup?: boolean;
  /** Déploie ce groupe d'attributs du site comme option « format ». */
  formatGroup?: string;
  /** La photo du site montre ce manche (pour une légende honnête sur les autres). */
  photoManche?: string;
  tags?: string[];
  /** Photos du pack fourni, prioritaires sur celles du site. */
  images?: VariantImages;
}

/** Une fiche du site actuel → une ou plusieurs variantes, aux prix exacts de ses déclinaisons. */
export function site(id: number, pick: Pick = {}): Variant[] {
  const p = SITE.get(String(id));
  if (!p) throw new Error(`Fiche ${id} absente du relevé`);
  const lameGroup = p.groups['Choix de la lame'];
  const lames: (string | undefined)[] =
    pick.lame === false ? [undefined] : pick.lame ? [pick.lame] : lameGroup ? lameGroup.map((v) => LAME[v]).filter((l) => !pick.lames || pick.lames.includes(l)) : ['14C28'];
  const mancheGroupName = pick.mancheGroup ? MANCHE_GROUPS.find((g) => p.groups[g]) : undefined;
  const manches: (string | undefined)[] = mancheGroupName ? p.groups[mancheGroupName].map((v) => MANCHE[v] ?? v) : [pick.manche];
  const formats: (string | undefined)[] = pick.formatGroup && p.groups[pick.formatGroup] ? p.groups[pick.formatGroup].map((v) => FORMAT[v] ?? v) : [pick.format];
  const photoLame = pick.lame || (lameGroup ? LAME[lameGroup[0]] : '14C28');
  const delay = p.availabilityText ? DELAYS.find(([re]) => re.test(p.availabilityText!))?.[1] : undefined;
  const img = IMAGES[p.id];

  const variants: Variant[] = [];
  for (const manche of manches)
    for (const lame of lames)
      for (const format of formats) {
        const wanted: Record<string, string> = {};
        if (lameGroup && lame && !pick.lame) wanted['Choix de la lame'] = Object.keys(LAME).find((k) => LAME[k] === lame)!;
        if (mancheGroupName && manche) wanted[mancheGroupName] = p.groups[mancheGroupName].find((v) => (MANCHE[v] ?? v) === manche)!;
        if (pick.formatGroup && format && p.groups[pick.formatGroup]) wanted[pick.formatGroup] = p.groups[pick.formatGroup].find((v) => (FORMAT[v] ?? v) === format)!;
        const matching = p.combos.filter((c) => Object.entries(wanted).every(([g, v]) => c.attrs[g] === v));
        if (p.combos.length && Object.keys(wanted).length && matching.length === 0) continue; // combinaison inexistante sur le site
        const price = matching.length && Object.keys(wanted).length ? Math.min(...matching.map((c) => c.price)) : p.price;
        const options: Partial<Record<OptionId, string>> = {};
        if (pick.mecanisme) options.mecanisme = pick.mecanisme;
        if (format) options.format = format;
        if (manche) options.manche = manche;
        if (lame) options.lame = lame;
        const shownManche = pick.photoManche ?? manche;
        const exact = (!lame || lame === photoLame) && (!pick.photoManche || manche === pick.photoManche);
        const shows = [shownManche ? MATERIALS[shownManche]?.label.toLowerCase() : undefined, lame ? STEEL_PHRASE[photoLame] : undefined].filter(Boolean).join(', ');
        variants.push({
          sku: ['SAV', p.id, manche, lame, format].filter(Boolean).join('-').toUpperCase(),
          title: p.title,
          price,
          options,
          images: pick.images ? { exact, shows, ...pick.images } : { troisQuarts: img?.troisQuarts, ferme: img?.ferme, exact, shows },
          available: true,
          madeToOrder: delay ? { delayLabel: delay } : undefined,
          legacyId: p.id,
          tags: pick.tags,
        });
      }
  return variants;
}

export function sitePath(id: number): string {
  return SITE.get(String(id))?.path ?? '';
}
export function siteHasChiseling(id: number): boolean {
  return !!SITE.get(String(id))?.groups['Ciselage'];
}
export function siteImage(id: number): string | undefined {
  return IMAGES[String(id)]?.troisQuarts;
}
export function siteImageIsCutout(id: number): boolean {
  return IMAGES[String(id)]?.detoure ?? false;
}

const LAME_ORDER = ['14C28', 'XC75', 'RWL34', 'damas'];
const FORMAT_ORDER = ['unite', 'duo', 'coffret-6', 'pm', 'mm', 'gm', 'petit', 'grand', 'court', 'long'];

/** Les options affichées sont déduites des variantes : une valeur n'existe que si une variante la porte. */
export function deriveOptions(variants: Variant[], labels: Partial<Record<OptionId, string>> = {}): ProductOption[] {
  const present = (id: OptionId) => [...new Set(variants.map((v) => v.options[id]).filter((x): x is string => !!x))];
  const out: ProductOption[] = [];
  const mec = present('mecanisme');
  if (mec.length > 1) out.push({ id: 'mecanisme', label: labels.mecanisme ?? 'Mécanisme', values: mec.map((id) => ({ id, label: MECHANISM_LABELS[id] ?? id })) });
  const fmt = present('format').sort((a, b) => FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b));
  if (fmt.length > 0) out.push({ id: 'format', label: labels.format ?? 'Format', values: fmt.map((id) => ({ id, label: FORMAT_LABELS[id] ?? id })) });
  const man = present('manche').sort((a, b) => MATERIAL_IDS.indexOf(a) - MATERIAL_IDS.indexOf(b));
  if (man.length > 0) out.push({ id: 'manche', label: labels.manche ?? 'Manche', values: man.map(materialValue) });
  const lam = present('lame').sort((a, b) => LAME_ORDER.indexOf(a) - LAME_ORDER.indexOf(b));
  if (lam.length > 0) out.push({ id: 'lame', label: labels.lame ?? 'Lame', values: lam.map((id) => ({ id, label: STEEL_LABELS[id] ?? id })) });
  return out;
}

type ModelInput = Omit<Product, 'options' | 'engraving' | 'chiseling' | 'listings' | 'stories' | 'specs' | 'upsells'> & {
  optionLabels?: Partial<Record<OptionId, string>>;
  engraving?: boolean;
  chiseling?: boolean;
  listings?: ListingDef[];
  stories?: Product['stories'];
  specs?: Product['specs'];
  upsells?: string[];
};

export const KNIFE_UPSELLS = ['fourreaux-en-cuir', 'pierre-a-aiguiser-des-pyrenees', 'ciselage'];

export function define(input: ModelInput): Product {
  const { optionLabels, engraving, chiseling, listings, ...rest } = input;
  return {
    stories: [],
    specs: [],
    upsells: [],
    ...rest,
    options: deriveOptions(input.variants, optionLabels),
    engraving: engraving ? { enabled: true, maxChars: 20, priceCents: 1200, beta: true } : undefined,
    chiseling: chiseling ? { enabled: true, priceCents: 400 } : undefined,
    listings: listings ?? [],
  };
}
