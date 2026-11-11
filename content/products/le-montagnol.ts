import { KNIFE_UPSELLS, define, site } from './_site';

/**
 * LE MONTAGNOL. Le catalogue 2024 et les déclinaisons du site citent aussi une lame carbone XC75 ;
 * consigne du cahier (9.6) : ne pas la proposer.
 */
export const leMontagnol = define({
  handle: 'le-montagnol',
  name: 'Le Montagnol',
  template: 'modele',
  category: 'poche',
  mechanisms: ['friction'],
  kicker: 'Friction',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'Le pliant des paysans et bergers ariégeois, en bois local.',
  legacyCategoryId: '65',
  engraving: true,
  upsells: KNIFE_UPSELLS.filter((u) => u !== 'ciselage'),
  variants: [
    ...site(136, { manche: 'chene', lames: ['14C28'] }),
    ...site(213, { manche: 'noyer', lames: ['14C28'], images: { troisQuarts: '/images/produits/montagnol-noyer.jpg' } }),
    ...site(197, { manche: 'olivier', lames: ['14C28'] }),
  ],
  stories: [
    {
      label: 'Vallées d’Ariège',
      title: 'Le compagnon des granges.',
      paragraphs: [
        'Il s’inspire du pliant qu’utilisaient les paysans et les bergers de l’Ariège. Jadis présents dans toutes les vallées, ces outils se retrouvent encore dans les planchers des vieilles granges. Les premiers étaient produits au XIXᵉ siècle par le maître coutelier fuxéen Grat, ancêtre de la famille Savignac.',
        'La corne étant devenue rare, le bois ariégeois s’est imposé. Les lames, en acier laminé de Thiers, sont affûtées et ajustées à Foix avant montage. Lame fine et étroite pour la découpe de précision, manche droit et anguleux. Avec le temps, le bois prend une patine : la trace des bons moments.',
      ],
      image: '/images/paysage/montagne-nb.jpg',
      imageAlt: 'Les montagnes ariégeoises',
    },
  ],
  specs: [
    { label: 'Poids', value: '30 g' },
    { label: 'Longueurs', value: 'Ouvert 187 mm, tranchant 75 mm, manche 104 mm, fermé 110 mm' },
    { label: 'Épaisseurs', value: 'Lame 2 mm, manche 12 mm' },
    { label: 'Montage', value: 'Axe vis 2,5 Allen, passe-lacet' },
  ],
  listings: [
    {
      id: 'le-montagnol',
      name: 'Le Montagnol',
      kicker: 'Friction',
      shortLine: 'Le pliant des paysans et bergers ariégeois, en bois local.',
      image: '/images/produits/montagnol-noyer.jpg',
      imageAlt: 'Le Montagnol, manche en noyer, lame inox, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Montagnol, couteau pliant des bergers ariégeois',
    description: 'Le Montagnol : le pliant des paysans et bergers de l’Ariège, lame fine et manche droit en bois local. 46 €.',
  },
});
