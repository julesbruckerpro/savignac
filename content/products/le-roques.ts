import { KNIFE_UPSELLS, define, site } from './_site';

const P = '/images/produits';

/** LE ROQUES — pièce signature. Friction (fiches 17) et cran plat (fiche 59) réunis sur une seule fiche. */
export const leRoques = define({
  handle: 'le-roques',
  name: 'Le Roques',
  template: 'modele',
  category: 'poche',
  mechanisms: ['friction', 'cran-plat'],
  kicker: 'Friction · signature',
  eyebrow: 'Pliant · fabriqué à Foix',
  shortLine: 'Facettes et pointe écourtée, dessiné à l’atelier en 2011.',
  isSignature: true,
  legacyCategoryId: '17',
  engraving: true,
  chiseling: true,
  upsells: KNIFE_UPSELLS,
  defaultVariantSku: 'SAV-189-CORNE-NOIRE-FACETTES-14C28',
  variants: [
    ...site(26, { mecanisme: 'friction', manche: 'chene', images: { troisQuarts: `${P}/roques-chene.jpg` } }),
    ...site(27, { mecanisme: 'friction', manche: 'noyer', images: { troisQuarts: `${P}/roques-noyer.jpg` } }),
    ...site(28, { mecanisme: 'friction', manche: 'platane', images: { troisQuarts: `${P}/roques-platane.jpg` } }),
    ...site(29, { mecanisme: 'friction', manche: 'olivier' }),
    ...site(30, { mecanisme: 'friction', manche: 'prunier', images: { troisQuarts: `${P}/roques-prunier.jpg` } }),
    ...site(31, { mecanisme: 'friction', manche: 'buis', images: { troisQuarts: `${P}/roques-buis.jpg` } }),
    ...site(24, { mecanisme: 'friction', manche: 'corne-noire', images: { troisQuarts: `${P}/roques-corne-noire.jpg` } }),
    ...site(25, { mecanisme: 'friction', manche: 'corne-blonde', images: { troisQuarts: `${P}/roques-corne-blonde.jpg` } }),
    ...site(189, { mecanisme: 'friction', manche: 'corne-noire-facettes', images: { troisQuarts: `${P}/roques-facettes.jpg` } }),
    ...site(214, { mecanisme: 'friction', manche: 'corne-noire-facettes', lame: 'damas' }),
    ...site(51, { mecanisme: 'friction', mancheGroup: true, lame: 'damas', photoManche: 'corne-noire', tags: ['prestige'] }),
    ...site(220, { mecanisme: 'cran-plat', manche: 'fat-carbon-rouge' }),
  ],
  optionNotes: [
    { when: { mecanisme: 'cran-plat' }, note: 'Le Roques à cran plat se monte sur Fat Carbon rouge.' },
    { when: { lame: 'damas' }, prefer: { manche: 'corne-noire-facettes' }, note: 'Le damas se monte sur corne : nous avons choisi la corne noire à facettes.' },
  ],
  stories: [
    {
      label: 'Foix, 2011',
      title: 'Né d’un geste manqué.',
      paragraphs: [
        'Olivier Montariol voulait reprendre le manche d’un Ariégeois taillé dans une superbe corne. Un geste un peu trop appuyé le gâcha. Pour sauver la corne, il fallut raccourcir le manche, puis la lame : les rondeurs de L’Ariégeois laissèrent place aux angles du Roques. Ses formes doivent aussi au higonokami, le couteau de poche traditionnel japonais.',
        'Dérivé moderne du capucin, premier couteau de la série monté à vis, il porte le nom du maître coutelier François Roques, qui transmit son savoir et l’entreprise aux Grat au XVIIIᵉ siècle.',
      ],
      quote: '« Notre tarte Tatin », dit la Maison.',
      image: '/images/atelier/atelier-artisan-nb.jpg',
      imageAlt: 'Un coutelier au travail dans l’atelier de Foix',
    },
  ],
  specs: [
    { label: 'Poids', value: '45 g' },
    { label: 'Tranchant', value: '6,5 cm' },
    { label: 'Longueur du manche', value: '10 cm' },
    { label: 'Montage', value: 'Axe vis et écrou, serrage de lame réglable' },
    { label: 'Dessin', value: 'Pointe écourtée, manche graphique à facettes' },
  ],
  listings: [
    {
      id: 'le-roques',
      name: 'Le Roques',
      kicker: 'Friction · signature',
      shortLine: 'Facettes et pointe écourtée, dessiné à l’atelier en 2011.',
      preset: { mecanisme: 'friction' },
      image: `${P}/roques-corne-blonde.jpg`,
      imageClosed: '/images/produits/site/25-ferme.jpg',
      imageAlt: 'Le Roques, manche en corne blonde, lame inox, vue de trois-quarts',
    },
    {
      id: 'le-roques-cran-plat',
      name: 'Le Roques cran plat',
      kicker: 'Système · cran plat',
      shortLine: 'Les angles du Roques, la lame retenue par un ressort.',
      preset: { mecanisme: 'cran-plat' },
      image: '/images/produits/site/220.jpg',
      imageAlt: 'Le Roques cran plat, manche en Fat Carbon rouge, lame inox, vue de trois-quarts',
    },
  ],
  seo: {
    title: 'Le Roques, couteau pliant fabriqué à Foix',
    description: 'Le Roques : manche à facettes, pointe écourtée, premier couteau de la Maison monté à vis. Bois d’Ariège, corne ou damas, de 73 € à 480 €.',
  },
});
