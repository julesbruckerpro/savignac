import { KNIFE_UPSELLS, define, site } from './_site';

const P = '/images/produits';

export const leGrat = define({
  handle: 'le-grat',
  name: 'Le Grat',
  template: 'modele',
  category: 'poche',
  mechanisms: ['friction'],
  kicker: 'Friction',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'Le capucin pyrénéen, droit et fin, lame en feuille de sauge.',
  legacyCategoryId: '18',
  engraving: true,
  chiseling: true,
  upsells: KNIFE_UPSELLS,
  variants: [
    ...site(34, { manche: 'chene' }),
    ...site(35, { manche: 'noyer' }),
    ...site(36, { manche: 'platane' }),
    ...site(37, { manche: 'olivier' }),
    ...site(38, { manche: 'prunier' }),
    ...site(39, { manche: 'buis' }),
    ...site(135, { manche: 'corne-noire' }),
    ...site(103, { manche: 'corne-blonde', images: { troisQuarts: `${P}/grat-corne-blonde.jpg` } }),
    ...site(193, { manche: 'corne-noire-facettes', images: { troisQuarts: `${P}/grat-facettes.jpg` } }),
  ],
  stories: [
    {
      label: 'Foix, XIXᵉ siècle · 2012',
      title: 'Le capucin, tel qu’on le faisait à Foix.',
      paragraphs: [
        'Il correspond au capucin traditionnel : modèle droit, lame en feuille de sauge, un rivet de rotation, un rivet de butée. Son nom vient du maître coutelier Ferdinand Grat, qui transmit son entreprise aux Savignac et fabriquait ce capucin très largement diffusé autour de Foix aux XVIIIᵉ et XIXᵉ siècles.',
        'Le nouveau Grat, réinterprété en 2012, garde la forme droite et fine du capucin pyrénéen, avec des lignes plus tendues.',
      ],
      quote: 'Capucin de Ferdinand Grat, fin du XIXᵉ siècle.',
      image: '/images/produits/capucin-grat-xixe.jpg',
      imageAlt: 'Capucin de Ferdinand Grat, fin du XIXᵉ siècle',
    },
  ],
  specs: [
    { label: 'Poids', value: '28 g' },
    { label: 'Tranchant', value: '7,5 cm' },
    { label: 'Longueur du manche', value: '10,5 cm' },
    { label: 'Montage', value: 'Un rivet de rotation, un rivet de butée' },
    { label: 'Dessin', value: 'Modèle droit et fin, lame en feuille de sauge' },
  ],
  listings: [
    {
      id: 'le-grat',
      name: 'Le Grat',
      kicker: 'Friction',
      shortLine: 'Le capucin pyrénéen, droit et fin, lame en feuille de sauge.',
      image: `${P}/grat-corne-blonde.jpg`,
      imageAlt: 'Le Grat, manche en corne blonde, lame inox, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Grat, capucin pyrénéen fabriqué à Foix',
    description: 'Le Grat : le capucin traditionnel de Foix, droit et fin, lame en feuille de sauge. Bois d’Ariège ou corne, dès 69 €.',
  },
});
