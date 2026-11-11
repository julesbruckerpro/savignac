import { define, site } from './_site';

const CUISINE_UPSELLS = ['pierre-a-aiguiser-synthetique', 'pierre-a-aiguiser-des-pyrenees', 'gravure-personnalisee-sur-lame'];
const CARE = { label: 'Entretien', value: 'Chiffon humide plutôt qu’eau courante, jamais de lave-vaisselle ; huiler le manche de temps à autre' };

export const gratOffice = define({
  handle: 'grat-office',
  name: 'Grat office',
  template: 'produit',
  category: 'cuisine',
  subcategory: 'office',
  mechanisms: ['fixe'],
  kicker: 'Cuisine · office',
  eyebrow: 'Couteau de cuisine · fabriqué à Foix',
  shortLine: 'Lame fine et aiguisée, de l’émondage des tomates au parage de la viande.',
  legacyCategoryId: '66',
  upsells: CUISINE_UPSELLS,
  variants: [
    ...site(69, { manche: 'chene' }),
    ...site(68, { manche: 'noyer' }),
    ...site(71, { manche: 'platane' }),
    ...site(72, { manche: 'olivier' }),
    ...site(70, { manche: 'prunier' }),
    ...site(73, { manche: 'buis' }),
    ...site(147, { mancheGroup: true }),
  ],
  description: [
    'Adaptation du Grat pliant, lui-même tiré du capucin : la petite capuche est restée au bout du manche. Lame fine et aiguisée, de l’émondage des tomates au parage de la viande.',
    'Manche tout en rondeur, en bois d’Ariège ou en Corian. Léger, il sert aussi à table.',
  ],
  specs: [{ label: 'Dessin', value: 'Lame étroite à émouture plate, capuche en bout de manche' }, CARE],
  seo: {
    title: 'Grat office, couteau d’office fabriqué à Foix',
    description: 'Le Grat passe en cuisine : couteau d’office à lame fine, manche en bois d’Ariège ou en Corian. Dès 68 €.',
  },
});

export const gratCuisine = define({
  handle: 'grat-cuisine',
  name: 'Grat cuisine',
  template: 'produit',
  category: 'cuisine',
  subcategory: 'chef',
  mechanisms: ['fixe'],
  kicker: 'Cuisine · chef',
  eyebrow: 'Couteau de cuisine · fabriqué à Foix',
  shortLine: 'Le couteau de chef : émincer, découper la viande ou le poisson.',
  legacyCategoryId: '68',
  upsells: CUISINE_UPSELLS,
  variants: [
    ...site(146, { manche: 'chene' }),
    ...site(175, { manche: 'noyer' }),
    ...site(177, { manche: 'platane' }),
    ...site(176, { manche: 'olivier' }),
    ...site(174, { manche: 'prunier' }),
    ...site(152, { manche: 'buis' }),
    ...site(145, { manche: 'corian-noir' }),
  ],
  description: [
    'Développé pour un usage polyvalent : émincer, découper la viande ou le poisson. Taille intermédiaire, lame en feuille de sauge, extrémité du manche en moine capucin.',
    'Manche en bois d’Ariège ou en Corian.',
  ],
  specs: [{ label: 'Dessin', value: 'Lame en feuille de sauge, extrémité du manche en moine capucin' }, CARE],
  seo: {
    title: 'Grat cuisine, couteau de chef fabriqué à Foix',
    description: 'Le couteau de chef de la Maison : lame en feuille de sauge, manche en bois d’Ariège ou en Corian. Dès 141 €.',
  },
});

export const couteauAFromage = define({
  handle: 'couteau-a-fromage',
  name: 'Couteau à fromage',
  template: 'produit',
  category: 'cuisine',
  subcategory: 'fromage',
  mechanisms: ['fixe'],
  kicker: 'Cuisine · fromage',
  eyebrow: 'Couteau de cuisine · fabriqué à Foix',
  shortLine: 'Pour trancher et piquer, avec la capuche du capucin en bas de manche.',
  legacyCategoryId: '69',
  upsells: CUISINE_UPSELLS,
  variants: [
    ...site(156, { manche: 'chene' }),
    ...site(154, { manche: 'platane' }),
    ...site(158, { manche: 'olivier' }),
    ...site(178, { manche: 'prunier' }),
    ...site(155, { manche: 'buis' }),
  ],
  description: [
    'Pour trancher et piquer. Un acier de qualité, qui permet aussi d’autres découpes.',
    'La capuche en bas de manche rappelle le moine capucin et les racines pyrénéennes du couteau. Sa fourche en pointe pique les morceaux découpés ; posé, il tient seul droit sur le plateau.',
  ],
  specs: [{ label: 'Dessin', value: 'Fourche en pointe, capuche en bas de manche' }, CARE],
  seo: {
    title: 'Couteau à fromage fabriqué à Foix',
    description: 'Couteau à fromage de la Coutellerie Savignac : fourche en pointe, manche en bois d’Ariège. 129 €.',
  },
});

export const coffretChefOffice = define({
  handle: 'coffret-chef-office-grat',
  name: 'Coffret Chef + Office',
  template: 'produit',
  category: 'cuisine',
  subcategory: 'coffret',
  mechanisms: ['fixe'],
  kicker: 'Cuisine · coffret',
  eyebrow: 'Couteaux de cuisine · fabriqués à Foix',
  shortLine: 'Le chef et l’office du Grat, réunis dans un coffret.',
  legacyCategoryId: '68',
  upsells: CUISINE_UPSELLS,
  variants: site(153, { mancheGroup: true, lame: false }),
  description: [
    'Les deux couteaux de cuisine du Grat dans un même coffret : le chef pour émincer et découper, l’office pour la précision.',
    'Lame en feuille de sauge, extrémité du manche en moine capucin. Manches en bois d’Ariège ou en Corian.',
  ],
  specs: [CARE],
  seo: {
    title: 'Coffret Chef + Office Grat, couteaux de cuisine fabriqués à Foix',
    description: 'Le couteau de chef et le couteau d’office du Grat réunis en coffret. Manches en bois d’Ariège ou en Corian, dès 192 €.',
  },
});
