import { define, site } from './_site';

const FIXES_UPSELLS = ['pierre-a-aiguiser-synthetique', 'prestation-atelier'];

export const leCharognard = define({
  handle: 'le-charognard',
  name: 'Le Charognard',
  template: 'produit',
  category: 'fixes',
  mechanisms: ['fixe'],
  kicker: 'Lame fixe',
  eyebrow: 'Lame fixe · fabriquée à Foix',
  shortLine: 'Créé pour le 1ᵉʳ Régiment de Chasseurs Parachutistes.',
  legacyCategoryId: '44',
  upsells: FIXES_UPSELLS,
  variants: site(130, { manche: 'paperstone', lame: false }),
  description: [
    'Un couteau de survie de fabrication artisanale française, créé pour le 1ᵉʳ Régiment de Chasseurs Parachutistes de l’armée française. Il sert au bushcraft comme à la chasse.',
    'Les plaquettes du manche sont en Paperstone, un matériau fait de papier recyclé et de résine, qui résiste à l’eau, au feu et aux chocs.',
  ],
  specs: [{ label: 'Manche', value: 'Plaquettes en Paperstone noir' }],
  seo: {
    title: 'Le Charognard, couteau à lame fixe fabriqué à Foix',
    description: 'Le Charognard : couteau à lame fixe créé pour le 1er Régiment de Chasseurs Parachutistes, manche en Paperstone. 199 €.',
  },
});

export const leBosc = define({
  handle: 'le-bosc',
  name: 'Le Bosc',
  template: 'produit',
  category: 'fixes',
  mechanisms: ['fixe'],
  kicker: 'Lame fixe · série limitée',
  eyebrow: 'Lame fixe · fabriquée à Foix',
  shortLine: 'Le Bosc, « la forêt » en occitan : cent couteaux numérotés.',
  legacyCategoryId: '44',
  upsells: FIXES_UPSELLS,
  variants: site(113, { mancheGroup: true, lame: false }),
  description: [
    'Le Bosc, « la forêt » en occitan. Un couteau robuste pour le bois et la chasse, réalisé en série limitée de cent modèles numérotés.',
    'Le crantage et la garde donnent une prise franche. La courbe, l’épaisseur et l’émouture de la lame sont pensées pour un usage polyvalent et intensif. Il est livré avec son étui en cuir, fait en Ariège au point sellier.',
  ],
  specs: [
    { label: 'Manche', value: 'Bois de fer ou ébène royal' },
    { label: 'Longueur du manche', value: '11 cm' },
    { label: 'Poids', value: '210 g' },
    { label: 'Dureté', value: '60 HRC' },
  ],
  seo: {
    title: 'Le Bosc, couteau à lame fixe fabriqué à Foix',
    description: 'Le Bosc : couteau à lame fixe pour le bois et la chasse, série limitée de cent modèles numérotés, étui en cuir. 250 €.',
  },
});
