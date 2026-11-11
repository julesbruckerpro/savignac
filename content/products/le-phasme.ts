import { KNIFE_UPSELLS, define, site } from './_site';

export const lePhasme = define({
  handle: 'le-phasme',
  name: 'Le Phasme',
  template: 'modele',
  category: 'poche',
  mechanisms: ['piemontais'],
  kicker: 'Lentille piémontaise',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'Inspiré du coupe-chou, il s’ouvre et se ferme d’une main.',
  legacyCategoryId: '50',
  engraving: true,
  upsells: KNIFE_UPSELLS.filter((u) => u !== 'ciselage'),
  variants: [
    ...site(150, { manche: 'tout-inox' }),
    ...site(94, { manche: 'olivier' }),
    ...site(134, { manche: 'ebene' }),
    ...site(122, { manche: 'bocote' }),
    ...site(149, { manche: 'bois-de-fer' }),
    ...site(162, { manche: 'ebene-royal' }),
    ...site(172, { manche: 'erable-onde' }),
    ...site(173, { manche: 'loupe-de-noyer' }),
    ...site(217, { manche: 'chene-ebonise' }),
    ...site(215, { manche: 'palmier', lame: 'damas' }),
    ...site(52, { manche: 'bois-de-fer-arizona', lame: 'damas', tags: ['prestige'] }),
    ...site(105, { manche: 'ebene-royal', lame: 'damas', tags: ['prestige'] }),
  ],
  stories: [
    {
      label: 'Foix, 2016',
      title: 'Un coupe-chou qui tient dans la poche.',
      paragraphs: [
        'Créé en 2016, il doit son nom à l’insecte. Il s’inspire du coupe-chou, le rasoir traditionnel fabriqué par le maître coutelier Ferdinand Grat.',
        'Monté à friction avec une lentille dite piémontaise, il s’ouvre et se ferme d’une main et reste bloqué en position ouverte. Son allure surprend ; sa prise en main rassure. Deux versions de manche : façonné ou plat.',
      ],
      image: '/images/atelier/production-fab-phasme.jpg',
      imageAlt: 'Fabrication d’un Phasme à l’atelier',
    },
  ],
  specs: [
    { label: 'Poids', value: '80 g' },
    { label: 'Tranchant', value: '7 cm, plat et courbe' },
    { label: 'Longueur du manche', value: '11 cm' },
    { label: 'Montage', value: 'Axe monté avec une vis à six pans, resserrable avec une clé Allen' },
    { label: 'Dessin', value: 'Biseau pouvant servir de racloir' },
  ],
  listings: [
    {
      id: 'le-phasme',
      name: 'Le Phasme',
      kicker: 'Lentille piémontaise',
      shortLine: 'Inspiré du coupe-chou, il s’ouvre et se ferme d’une main.',
      image: '/images/produits/phasme-damas.jpg',
      imageAlt: 'Le Phasme, lame damas, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Phasme, couteau à lentille piémontaise fabriqué à Foix',
    description: 'Le Phasme : inspiré du coupe-chou, il s’ouvre et se ferme d’une main. Inox, bois précieux ou damas, dès 120 €.',
  },
});
