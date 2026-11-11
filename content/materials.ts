import type { HandleGroup, OptionValue } from '@/lib/commerce/types';
import swatches from './products/data/swatches.json';

const SWATCHES = new Set(swatches as string[]);

interface Material {
  label: string;
  group: HandleGroup;
  /** Pastille réelle disponible dans public/images/matieres. */
  swatch?: boolean;
  /** Formulation dans une phrase : « manche en chêne ». */
  phrase?: string;
}

/** Matières de manche, dans l'ordre d'affichage des tuiles (cahier 8.4). */
export const MATERIALS: Record<string, Material> = {
  // bois d'Ariège
  chene: { label: 'Chêne', group: 'bois-locaux', swatch: true },
  noyer: { label: 'Noyer', group: 'bois-locaux', swatch: true },
  platane: { label: 'Platane', group: 'bois-locaux', swatch: true },
  olivier: { label: 'Olivier', group: 'bois-locaux', swatch: true },
  prunier: { label: 'Prunier', group: 'bois-locaux', swatch: true },
  buis: { label: 'Buis', group: 'bois-locaux', swatch: true },
  frene: { label: 'Frêne', group: 'bois-locaux', swatch: true },
  'bois-assortis': { label: 'Bois assortis', group: 'bois-locaux', swatch: true },
  bois: { label: 'Bois', group: 'bois-locaux', swatch: true },
  // bois précieux
  ebene: { label: 'Ébène', group: 'bois-precieux', swatch: true },
  'ebene-royal': { label: 'Ébène royal', group: 'bois-precieux', swatch: true },
  bocote: { label: 'Bocote', group: 'bois-precieux', swatch: true },
  'bois-de-serpent': { label: 'Bois de serpent', group: 'bois-precieux', swatch: true },
  'palmier-noir': { label: 'Palmier noir', group: 'bois-precieux', swatch: true },
  palmier: { label: 'Palmier', group: 'bois-precieux', swatch: true },
  bouleau: { label: 'Bouleau', group: 'bois-precieux', swatch: true },
  'bouleau-madre': { label: 'Bouleau madré', group: 'bois-precieux', swatch: true },
  'bouleau-madre-stabilise': { label: 'Bouleau madré stabilisé', group: 'bois-precieux', swatch: true },
  'erable-onde': { label: 'Érable ondé', group: 'bois-precieux', swatch: true },
  'loupe-de-noyer': { label: 'Loupe de noyer', group: 'bois-precieux', swatch: true },
  'loupe-d-erable': { label: 'Loupe d’érable', group: 'bois-precieux', swatch: true },
  'bois-de-fer': { label: 'Bois de fer', group: 'bois-precieux', swatch: true },
  'bois-de-fer-arizona': { label: 'Bois de fer d’Arizona', group: 'bois-precieux', swatch: true },
  'chene-fonce': { label: 'Chêne foncé', group: 'bois-precieux', swatch: true },
  'chene-ebonise': { label: 'Chêne ébonisé', group: 'bois-precieux', swatch: true },
  'chene-vert': { label: 'Chêne vert', group: 'bois-precieux', swatch: true },
  'bocote-osage': { label: 'Bocote et osage', group: 'bois-precieux', swatch: true },
  // corne et bois de cerf
  'corne-noire': { label: 'Corne noire', group: 'corne', swatch: true },
  'corne-blonde': { label: 'Corne blonde', group: 'corne', swatch: true },
  'corne-noire-facettes': { label: 'Corne noire à facettes', group: 'corne', swatch: true },
  'corne-belier': { label: 'Corne de bélier', group: 'corne', swatch: true },
  'bois-de-cerf': { label: 'Bois de cerf', group: 'corne', swatch: true },
  // synthétiques
  'fibre-de-carbone': { label: 'Fibre de carbone', group: 'synthetique', swatch: true },
  'fat-carbon-rouge': { label: 'Fat Carbon rouge', group: 'synthetique', swatch: true },
  'corian-noir': { label: 'Corian noir', group: 'synthetique', swatch: true },
  'corian-blanc': { label: 'Corian blanc', group: 'synthetique', swatch: true },
  corian: { label: 'Corian', group: 'synthetique', swatch: true },
  paperstone: { label: 'Paperstone', group: 'synthetique' },
  // exception
  'ivoire-phacochere': { label: 'Ivoire de phacochère', group: 'exception', swatch: true },
  // bi-matière
  'bi-matiere': { label: 'Bi-matière', group: 'bi-matiere', swatch: true },
  'bi-matiere-ebene-royal': { label: 'Bi-matière ébène et ébène royal', group: 'bi-matiere', swatch: true },
  'bi-matiere-bocote': { label: 'Bi-matière bocote', group: 'bi-matiere', swatch: true },
  // métal
  'tout-inox': { label: 'Tout inox', group: 'metal', swatch: true },
  // accessoires
  noir: { label: 'Noir', group: 'synthetique' },
  marron: { label: 'Marron', group: 'synthetique' },
};

export const GROUP_LABELS: Record<HandleGroup, string> = {
  'bois-locaux': 'Bois d’Ariège',
  'bois-precieux': 'Bois précieux',
  corne: 'Corne et bois de cerf',
  synthetique: 'Synthétiques',
  exception: 'Exception',
  'bi-matiere': 'Bi-matière',
  metal: 'Métal',
};

export const GROUP_ORDER: HandleGroup[] = ['bois-locaux', 'bois-precieux', 'corne', 'synthetique', 'exception', 'bi-matiere', 'metal'];

export const MATERIAL_IDS = Object.keys(MATERIALS);

export function materialValue(id: string): OptionValue {
  const m = MATERIALS[id];
  if (!m) return { id, label: id };
  return { id, label: m.label, group: m.group, swatch: SWATCHES.has(id) ? `/images/matieres/sw-${id}.jpg` : undefined };
}

export const STEEL_LABELS: Record<string, string> = {
  '14C28': 'Inox 14C28',
  XC75: 'Carbone XC75',
  RWL34: 'RWL34',
  damas: 'Damas',
};
export const STEEL_PHRASE: Record<string, string> = {
  '14C28': 'lame inox 14C28',
  XC75: 'lame carbone XC75',
  RWL34: 'lame RWL34',
  damas: 'lame damas',
};
export const MECHANISM_LABELS: Record<string, string> = {
  friction: 'À friction',
  'cran-plat': 'Cran plat',
  piemontais: 'Lentille piémontaise',
  fixe: 'Lame fixe',
};
export const FORMAT_LABELS: Record<string, string> = {
  unite: 'À l’unité',
  duo: 'Duo',
  'coffret-6': 'Coffret de 6',
  pm: 'Petit modèle',
  mm: 'Moyen modèle',
  gm: 'Grand modèle',
  petit: 'Petit',
  grand: 'Grand',
  court: 'Ciselage court',
  long: 'Ciselage long',
};
