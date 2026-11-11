import { KNIFE_UPSELLS, define, site } from './_site';

export const leCathare = define({
  handle: 'le-cathare',
  name: 'Le Cathare',
  template: 'modele',
  category: 'poche',
  mechanisms: ['friction'],
  kicker: 'Friction',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'Le plus grand modèle, manche rond et droit, robuste en prise franche.',
  legacyCategoryId: '19',
  engraving: true,
  chiseling: true,
  upsells: KNIFE_UPSELLS,
  variants: [
    ...site(17, { manche: 'chene' }),
    ...site(18, { manche: 'noyer' }),
    ...site(19, { manche: 'platane' }),
    ...site(20, { manche: 'olivier' }),
    ...site(21, { manche: 'prunier' }),
    ...site(22, { manche: 'buis' }),
  ],
  stories: [
    {
      label: 'Terres cathares',
      title: 'Le plus grand, le plus franc.',
      paragraphs: [
        'Alain Montariol l’a imaginé d’après un capucin traditionnel fabriqué par les maîtres couteliers de Thiers, commercialisé sous la marque 31 Besset et très répandu dans les Pyrénées ariégeoises. Olivier Montariol en a modernisé le dessin au début des années 2010, pour distinguer ce couteau rustique fabriqué en terres cathares.',
        'Lame en feuille de sauge, manche plus droit et plus rond que celui de L’Ariégeois, lacet de cuir pour le tirer de son fourreau : un pliant robuste et simple, confortable en prise franche. C’est le plus grand modèle de la collection.',
      ],
      image: '/images/paysage/montagne-nb.jpg',
      imageAlt: 'Les montagnes ariégeoises',
    },
  ],
  specs: [
    { label: 'Poids', value: '48 g' },
    { label: 'Tranchant', value: '8,2 cm' },
    { label: 'Longueur du manche', value: '11,5 cm' },
    { label: 'Montage', value: 'Deux clous ; modèles inox montés à vis' },
    { label: 'Dessin', value: 'Lame en feuille de sauge, manche rond et droit, lacet de cuir' },
  ],
  listings: [
    {
      id: 'le-cathare',
      name: 'Le Cathare',
      kicker: 'Friction',
      shortLine: 'Le plus grand modèle, manche rond et droit, robuste en prise franche.',
      image: '/images/produits/cathare.jpg',
      imageAlt: 'Le Cathare, manche en bois, lame inox, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Cathare, couteau pliant fabriqué à Foix',
    description: 'Le Cathare : le plus grand pliant de la Maison, lame en feuille de sauge et manche rond en bois d’Ariège. 73 €.',
  },
});
