import { KNIFE_UPSELLS, define, site } from './_site';

export const leCapi = define({
  handle: 'le-capi',
  name: 'Le Capi',
  template: 'modele',
  category: 'poche',
  mechanisms: ['cran-plat'],
  kicker: 'Système · cran plat',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'La capuche du capucin sur une ligne droite, tout en pans.',
  legacyCategoryId: '72',
  engraving: true,
  upsells: KNIFE_UPSELLS.filter((u) => u !== 'ciselage'),
  variants: [
    ...site(200, { manche: 'tout-inox' }),
    ...site(198, { manche: 'noyer' }),
    ...site(201, { manche: 'olivier' }),
    ...site(202, { manche: 'ebene' }),
    ...site(210, { manche: 'chene-fonce' }),
    ...site(209, { manche: 'bocote' }),
    ...site(211, { manche: 'bois-de-serpent' }),
    ...site(212, { manche: 'bouleau' }),
    ...site(199, { manche: 'bi-matiere-ebene-royal' }),
    ...site(204, { manche: 'ebene-royal' }),
    ...site(205, { manche: 'corne-noire' }),
    ...site(208, { manche: 'corne-blonde' }),
    ...site(203, { manche: 'fibre-de-carbone' }),
    ...site(206, { manche: 'chene-vert', lame: 'damas' }),
  ],
  optionNotes: [{ when: { lame: 'damas' }, note: 'Le damas se monte sur chêne vert.' }],
  stories: [
    {
      label: 'À système · cran plat',
      title: 'La capuche, sur une ligne droite.',
      paragraphs: [
        'Dérivé du Montagnol, il porte la capuche, l’un de nos critères esthétiques traditionnels. Couteau à système dit cran plat : le ressort maintient la lame ouverte, la ramène à 90°, puis l’entraîne en position fermée.',
        'Là où nos modèles jouent des courbes, le Capi rompt : des pans sur tout le pourtour du manche, une ligne rectiligne, un style géométrique.',
      ],
      image: '/images/atelier/production-systeme-en-cours.jpg',
      imageAlt: 'Couteaux à système en cours de montage à l’atelier',
    },
  ],
  specs: [
    { label: 'Montage', value: 'Ressort à cran plat : arrêt de la lame à 90°' },
    { label: 'Dessin', value: 'Capuche en bout de manche, pans sur tout le pourtour, ligne rectiligne' },
  ],
  listings: [
    {
      id: 'le-capi',
      name: 'Le Capi',
      kicker: 'Système · cran plat',
      shortLine: 'La capuche du capucin sur une ligne droite, tout en pans.',
      image: '/images/produits/site/198.jpg',
      imageAlt: 'Le Capi, manche en noyer, lame inox, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Capi, couteau à cran plat fabriqué à Foix',
    description: 'Le Capi : dérivé du Montagnol, système à cran plat, manche à pans. Inox, bois, corne ou fibre de carbone, dès 100 €.',
  },
});
