import type { OptionId } from '@/lib/commerce/types';

export interface GiftPick {
  product: string;
  options?: Partial<Record<OptionId, string>>;
  /** Carte du modèle entier plutôt qu'une finition. */
  whole?: boolean;
}

/** Sélections par budget (cahier 7.5). Chaque ligne pointe une variante existante, au prix du site. */
export const giftRows: { title: string; picks: GiftPick[] }[] = [
  {
    title: 'Moins de 80 €',
    picks: [
      { product: 'le-montagnol', whole: true },
      { product: 'le-grat', options: { manche: 'chene', lame: '14C28' } },
      { product: 'l-ariegeois', options: { mecanisme: 'friction', manche: 'noyer', lame: '14C28' } },
      { product: 'le-roques', options: { mecanisme: 'friction', manche: 'noyer', lame: '14C28' } },
      { product: 'le-cathare', whole: true },
      { product: 'grat-office', options: { manche: 'chene', lame: '14C28' } },
    ],
  },
  {
    title: 'De 80 à 150 €',
    picks: [
      { product: 'l-ariegeois', options: { mecanisme: 'friction', manche: 'corne-blonde', lame: '14C28' } },
      { product: 'le-roques', options: { mecanisme: 'friction', manche: 'corne-noire-facettes', lame: '14C28' } },
      { product: 'le-capi', options: { manche: 'noyer' } },
      { product: 'le-phasme', options: { manche: 'olivier', lame: '14C28' } },
      { product: 'grat-cuisine', options: { manche: 'chene' } },
    ],
  },
  {
    title: 'Plus de 150 €',
    picks: [
      { product: 'l-ariegeois', options: { mecanisme: 'cran-plat', manche: 'ebene' } },
      { product: 'le-capi', options: { manche: 'ebene-royal' } },
      { product: 'le-roques', options: { mecanisme: 'cran-plat', manche: 'fat-carbon-rouge', lame: '14C28' } },
      { product: 'le-roques', options: { mecanisme: 'friction', manche: 'corne-noire-facettes', lame: 'damas' } },
    ],
  },
  {
    title: 'Pour la table',
    picks: [
      { product: 'l-ariegeois-de-table', options: { format: 'duo', manche: 'corne-noire' } },
      { product: 'coffret-chef-office-grat', options: { manche: 'chene' } },
      { product: 'l-ariegeois-de-table', options: { format: 'coffret-6', manche: 'bois-assortis' } },
    ],
  },
];
