export type Mechanism = 'friction' | 'cran-plat' | 'piemontais' | 'fixe';
export type Steel = '14C28' | 'XC75' | 'RWL34' | 'damas' | 'damasteel' | 'N690' | 'D2' | 'suminagashi';
export type Category = 'poche' | 'table' | 'cuisine' | 'prestige' | 'fixes' | 'accessoires';
export type HandleGroup = 'bois-locaux' | 'bois-precieux' | 'corne' | 'synthetique' | 'exception' | 'bi-matiere' | 'metal';
export type OptionId = 'mecanisme' | 'format' | 'manche' | 'lame';

export interface OptionValue {
  id: string; // 'noyer', 'corne-blonde'…
  label: string; // 'Noyer'
  swatch?: string; // /images/matieres/sw-noyer.jpg (pastille ronde)
  group?: HandleGroup;
}

export interface VariantImages {
  troisQuarts?: string;
  ferme?: string;
  dos?: string;
  /** La photo montre-t-elle exactement cette finition ? Sinon, légende honnête. */
  exact?: boolean;
  /** Ce que montre réellement la photo (« corne noire à facettes, lame inox »). */
  shows?: string;
}

export interface Variant {
  sku: string; // ex. 'ROQ-FRI-NOYER-14C28'
  /** Titre exact du site actuel, conservé pour la correspondance Shopify. */
  title: string;
  /** Prix TTC en centimes : 7300. */
  price: number;
  options: Partial<Record<OptionId, string>>;
  images: VariantImages;
  /** Prototype : true partout (consigne client). */
  available: boolean;
  /** Donnée du site actuel, masquée tant que NEXT_PUBLIC_SHOW_LEAD_TIMES=false. */
  madeToOrder?: { delayLabel: string };
  /** Identifiant de la fiche sur le site actuel (redirections 301). */
  legacyId?: string;
  tags?: string[]; // 'prestige'…
}

export interface ProductOption {
  id: OptionId;
  label: string;
  values: OptionValue[];
}

export interface Spec {
  label: string;
  value: string;
  /** Limite la ligne à un mécanisme donné. */
  when?: { mecanisme?: string };
}

export interface ProductStory {
  label?: string; // 'FOIX, 2011'
  title: string;
  paragraphs: string[];
  quote?: string;
  quoteSource?: string;
  image: string;
  imageAlt: string;
  /** Récit propre à un mécanisme (ex. cran plat). */
  when?: { mecanisme?: string };
}

/** Une carte de catalogue : un modèle, éventuellement restreint à un mécanisme. */
export interface ListingDef {
  id: string; // 'l-ariegeois-cran-plat'
  name: string;
  kicker: string;
  shortLine: string;
  preset?: Partial<Record<OptionId, string>>;
  image: string;
  imageClosed?: string;
  imageAlt: string;
}

export interface Product {
  handle: string; // 'le-roques'
  name: string; // 'Le Roques'
  /** 'modele' = fiche avec configurateur ; 'produit' = fiche simple. */
  template: 'modele' | 'produit';
  category: Exclude<Category, 'prestige'>;
  subcategory?: string; // rubrique d'accessoires, type de cuisine…
  mechanisms: Mechanism[];
  kicker: string; // 'Friction · signature'
  eyebrow: string; // 'Pliant · fabriqué à Foix'
  shortLine: string; // une phrase pour la carte
  description?: string[]; // fiche simple
  stories: ProductStory[];
  specs: Spec[];
  options: ProductOption[];
  variants: Variant[];
  defaultVariantSku?: string;
  engraving?: { enabled: boolean; maxChars: number; priceCents: number; beta: true };
  chiseling?: { enabled: boolean; priceCents: number };
  upsells?: string[]; // handles d'accessoires
  isSignature?: boolean;
  listings: ListingDef[];
  seo: { title: string; description: string };
  legacyCategoryId?: string;
  /** Message affiché quand un choix impose une autre option. */
  optionNotes?: { when: Partial<Record<OptionId, string>>; note: string; prefer?: Partial<Record<OptionId, string>> }[];
}

/** Carte prête à afficher (calculée par l'adaptateur). */
export interface Listing extends ListingDef {
  productHandle: string;
  href: string;
  category: Product['category'];
  fromPrice: number;
  toPrice: number;
  variantCount: number;
  swatches: { id: string; label: string; swatch?: string }[];
  facets: { mecanisme: string[]; manche: string[]; acier: string[] };
  isNew?: boolean;
}

export interface CartLine {
  id: string;
  sku: string;
  productHandle: string;
  href: string;
  name: string;
  variantTitle: string;
  finish: string;
  image?: string;
  unitPrice: number; // variante + options, en centimes
  quantity: number;
  /** Attributs de ligne, exactement comme les propriétés de ligne Shopify. */
  attributes: Record<string, string>;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  totalQuantity: number;
}

export interface Collection {
  handle: string;
  title: string;
  intro: string;
  seo: { title: string; description: string };
  editorial?: { title: string; columns: string[] };
  dark?: boolean;
}
