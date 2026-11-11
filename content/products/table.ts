import { define, site, siteImage } from './_site';

const TABLE_STORY = {
  label: 'Art de la table',
  title: 'Le couteau qui reste sur la nappe.',
  paragraphs: [
    'Inspirés de nos modèles historiques ou des formes de la nature. Lame inox 14C28 qui résiste à l’humidité ; manche de bois, de corne ou de Corian. Tous sont des créations de la Maison.',
  ],
  image: '/images/atelier/production-manche-table.jpg',
  imageAlt: 'Façonnage d’un manche de couteau de table à l’atelier',
};
const TABLE_SPECS = [
  { label: 'Lame', value: 'Inox 14C28, qui résiste à l’humidité' },
  { label: 'Entretien', value: 'Un couteau ne se lave pas, il s’essuie : chiffon humide, jamais de lave-vaisselle' },
];
const TABLE_UPSELLS = ['pierre-a-aiguiser-synthetique', 'gravure-personnalisee-sur-lame'];

export const lAriegeoisDeTable = define({
  handle: 'l-ariegeois-de-table',
  name: 'L’Ariégeois de table',
  template: 'modele',
  category: 'table',
  mechanisms: ['fixe'],
  kicker: 'Table · dessin déposé',
  eyebrow: 'Couteau de table · fabriqué à Foix',
  shortLine: 'La courbe de L’Ariégeois, en version fixe pour la table.',
  legacyCategoryId: '55',
  upsells: TABLE_UPSELLS,
  variants: [
    ...site(109, { format: 'unite', manche: 'bois', lame: false }),
    ...site(41, { format: 'duo', manche: 'corne-noire', lame: false }),
    ...site(165, { format: 'coffret-6', manche: 'bois-assortis', lame: false }),
    ...site(180, { format: 'coffret-6', mancheGroup: true, photoManche: 'corian-noir', lame: false }),
    ...site(42, { format: 'coffret-6', manche: 'corne-noire', lame: false }),
    ...site(59, { format: 'coffret-6', manche: 'bois-de-cerf', lame: false }),
  ],
  stories: [
    {
      ...TABLE_STORY,
      label: 'Depuis 2010',
      paragraphs: [
        'L’Ariégeois de table est la version fixe, pour la table, du pliant de la Maison. Ses formes arrondies sont étudiées pour couper aisément ; son dessin est déposé.',
        'Lame inox 14C28 qui résiste à l’humidité ; manche de bois, de corne ou de Corian. À l’unité, en duo ou en coffret de six. Le duo en corne noire est vendu avec son fourreau en cuir.',
      ],
    },
  ],
  specs: [...TABLE_SPECS, { label: 'Longueurs', value: 'Lame 10,5 cm, manche 11,3 cm' }, { label: 'Poids', value: '64 g' }],
  listings: [
    {
      id: 'l-ariegeois-de-table',
      name: 'L’Ariégeois de table',
      kicker: 'Table · dessin déposé',
      shortLine: 'La courbe de L’Ariégeois, en version fixe pour la table.',
      image: siteImage(109)!,
      imageAlt: 'L’Ariégeois de table, manche en bois, lame inox',
    },
  ],
  seo: {
    title: 'L’Ariégeois de table, couteau de table fabriqué à Foix',
    description: 'L’Ariégeois de table : lame inox 14C28, manche de bois, de corne ou de Corian. À l’unité, en duo ou en coffret de six, dès 74 €.',
  },
});

export const leGratDeTable = define({
  handle: 'le-grat-de-table',
  name: 'Le Grat de table',
  template: 'modele',
  category: 'table',
  mechanisms: ['fixe'],
  kicker: 'Table · coffret de six',
  eyebrow: 'Couteau de table · fabriqué à Foix',
  shortLine: 'Le capucin passe à table, avec sa petite capuche au bout du manche.',
  legacyCategoryId: '42',
  upsells: TABLE_UPSELLS,
  variants: [...site(89, { format: 'coffret-6', manche: 'bois-assortis', lame: false }), ...site(128, { format: 'coffret-6', manche: 'corne-noire', lame: false })],
  stories: [
    {
      ...TABLE_STORY,
      paragraphs: [
        'Comme le Grat pliant, il vient du capucin des bergers des Pyrénées et se reconnaît à son manche, qui se termine par une petite capuche.',
        'Lame inox 14C28 qui résiste à l’humidité. Vendu en coffret de six : six essences de bois assorties, ou corne noire.',
      ],
    },
  ],
  specs: TABLE_SPECS,
  listings: [
    {
      id: 'le-grat-de-table',
      name: 'Le Grat de table',
      kicker: 'Table · coffret de six',
      shortLine: 'Le capucin passe à table, avec sa petite capuche au bout du manche.',
      image: siteImage(89)!,
      imageAlt: 'Coffret de six Grat de table, manches en bois assortis',
    },
  ],
  seo: {
    title: 'Le Grat de table, coffret de couteaux de table fabriqués à Foix',
    description: 'Le Grat de table : six couteaux en coffret, lame inox 14C28, manches en bois assortis ou en corne noire. Dès 399 €.',
  },
});

export const leRoquesDeTable = define({
  handle: 'le-roques-de-table',
  name: 'Le Roques de table',
  template: 'modele',
  category: 'table',
  mechanisms: ['fixe'],
  kicker: 'Table · coffret de six',
  eyebrow: 'Couteau de table · fabriqué à Foix',
  shortLine: 'La ligne tendue du Roques, manche en Corian, pour la table.',
  legacyCategoryId: '71',
  upsells: TABLE_UPSELLS,
  variants: site(196, { format: 'coffret-6', mancheGroup: true, photoManche: 'corian-noir', lame: false }),
  stories: [
    {
      ...TABLE_STORY,
      paragraphs: [
        'Le Roques représente la ligne moderne de la Maison ; le Roques de table en est la version fixe. Formes tendues, manche élancé.',
        'Le manche est en Corian, un matériau composite dense, hygiénique, très résistant à l’humidité. Lame inox 14C28. Vendu en coffret de six, Corian noir ou blanc.',
      ],
    },
  ],
  specs: TABLE_SPECS,
  listings: [
    {
      id: 'le-roques-de-table',
      name: 'Le Roques de table',
      kicker: 'Table · coffret de six',
      shortLine: 'La ligne tendue du Roques, manche en Corian, pour la table.',
      image: siteImage(196)!,
      imageAlt: 'Le Roques de table, manche en Corian noir, lame inox',
    },
  ],
  seo: {
    title: 'Le Roques de table, coffret de couteaux de table fabriqués à Foix',
    description: 'Le Roques de table : six couteaux en coffret, lame inox 14C28, manche en Corian noir ou blanc. 410 €.',
  },
});

export const leCalla = define({
  handle: 'le-calla',
  name: 'Le Calla',
  template: 'produit',
  category: 'table',
  mechanisms: ['fixe'],
  kicker: 'Table · Corian',
  eyebrow: 'Couteau de table · fabriqué à Foix',
  shortLine: 'Dessiné pour un restaurant, d’après la forme du lys dont il tient son nom.',
  legacyCategoryId: '54',
  upsells: TABLE_UPSELLS,
  defaultVariantSku: 'SAV-118-CORIAN-NOIR-COFFRET-6',
  variants: site(118, { mancheGroup: true, formatGroup: 'Assortiment de table', photoManche: 'corian-noir', lame: false }),
  description: [
    'Créé à l’origine pour un restaurant, le Calla s’inspire de la forme du lys dont il tient son nom. La courbe du manche rappelle la fleur et tombe bien en main.',
    'Le manche est en Corian, noir ou blanc : un matériau composite choisi pour sa solidité, qui s’use très peu avec le temps. Lame inox 14C28. À l’unité, en duo ou en coffret de six.',
  ],
  specs: TABLE_SPECS,
  seo: {
    title: 'Le Calla, couteau de table en Corian fabriqué à Foix',
    description: 'Le Calla : couteau de table dessiné d’après la forme du lys, manche en Corian noir ou blanc. À l’unité, en duo ou en coffret de six.',
  },
});
