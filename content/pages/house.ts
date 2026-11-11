import { typoDeep } from '@/lib/typo';

const AT = '/images/atelier';

export const workshops = typoDeep({
  intro: { title: 'Les ateliers.', text: 'Une boutique, deux ateliers, et une seconde boutique en face : quatre adresses, toutes à Foix.' },
  chapters: [
    {
      id: 'le-15',
      label: 'Le 15',
      title: 'La boutique.',
      text: 'Au 15 rue des Marchands, une vieille échoppe qui a traversé les siècles. On y trouve nos couteaux, des couteaux français et internationaux, des objets régionaux : pierres à aiguiser ariégeoises, peignes en corne de façon locale.',
      photos: [
        { src: '/images/boutique/boutique-15-angle.jpg', alt: 'La boutique à l’angle de la rue des Marchands', caption: 'La boutique, 15 rue des Marchands.' },
        { src: '/images/boutique/boutique-15-interieur.jpg', alt: 'L’intérieur de la boutique', caption: 'Les vitrines de la boutique.' },
      ],
    },
    {
      id: 'le-17',
      label: 'Le 17',
      title: 'L’atelier historique.',
      text: 'À l’arrière de la boutique, sur la place au Beurre, derrière une façade bleue : l’atelier où ont travaillé les générations Grat et Savignac. Perceuses, backstands, meule, four de trempe, scie à ruban. La Maison a choisi de garder ici une production, au cœur de la ville.',
      photos: [
        { src: `${AT}/atelier-17-etabli.jpg`, alt: 'L’établi de l’atelier historique', caption: 'L’établi de l’atelier du 17.' },
        { src: `${AT}/atelier-17-panorama.jpg`, alt: 'Vue d’ensemble de l’atelier historique', caption: 'L’atelier historique, place au Beurre.' },
      ],
    },
    {
      id: 'peysales',
      label: 'Peysales',
      title: 'Savignac 2.0.',
      text: 'Au sud de Foix, le nouvel atelier. On y monte, on y débite, on y façonne les manches et l’acier : combiné à bois, calibreuse, CNC, scies à ruban bois et acier, défonceuses, lapidaire, backstands modulables, tourets de polissage. C’est ici que naissent les prototypes, les pièces personnalisées et les couteaux de prestige.',
      photos: [
        { src: `${AT}/peysales-atelier.jpg`, alt: 'L’espace de montage de l’atelier de Peysales', caption: 'L’espace de montage.' },
        { src: `${AT}/peysales-acier.jpg`, alt: 'La pièce d’acier de l’atelier de Peysales', caption: 'La pièce d’acier : backstands et touret de polissage.' },
        { src: `${AT}/peysales-bois.jpg`, alt: 'La pièce des manches de l’atelier de Peysales', caption: 'La pièce des manches.' },
        { src: `${AT}/peysales-showroom.jpg`, alt: 'La salle d’exposition de Peysales', caption: 'La salle d’exposition.' },
      ],
    },
    {
      id: 'savignac-maison',
      label: 'Savignac Maison',
      title: 'En face, au 14.',
      text: 'Depuis 2012, de l’autre côté de la rue : arts de la table, ustensiles de cuisine ménagers et professionnels, décoration.',
      photos: [{ src: '/images/boutique/savignac-maison-14.jpg', alt: 'La façade de Savignac Maison', caption: 'Savignac Maison, 14 rue des Marchands.', wide: true }],
    },
  ],
  gestures: [
    { src: `${AT}/atelier-3.jpg`, alt: 'Une coutelière monte un couteau à l’établi', caption: 'Le montage à l’établi.' },
    { src: `${AT}/atelier-2.jpg`, alt: 'Des mains façonnent un manche au backstand', caption: 'Le façonnage d’un manche au backstand.' },
    { src: `${AT}/atelier-1.jpg`, alt: 'Un coutelier ajuste une pièce', caption: 'L’ajustage.' },
    { src: `${AT}/atelier-4.jpg`, alt: 'Une lame polie sur la meule', caption: 'Le polissage sur la meule.' },
    { src: `${AT}/atelier-5.jpg`, alt: 'Lames et manches posés avant montage', caption: 'Lames et manches avant montage.' },
  ],
});

export const localProduction = typoDeep({
  title: 'Ce que nous ne faisons pas nous-mêmes, nous le faisons près d’ici.',
  text: [
    'Les bois sont ariégeois, séchés sur place, imprégnés d’huile de lin. Les modèles prestige et custom sont entièrement façonnés à l’atelier ; les couteaux de série y sont montés, et la Maison veut y ramener toujours plus d’étapes.',
    'Les anciennes machines de l’atelier sont exposées au Musée des Forges de Pyrène, à Montgailhard.',
  ],
  partners: [
    { matter: 'Étuis et fourreaux en cuir', partner: 'ESAT les Dolmens, centre d’aide par le travail', place: 'Martiel, Aveyron' },
    { matter: 'Manches en corne des modèles de série', partner: 'Famille Bost', place: 'Saint-Rémy-sur-Durolle' },
    { matter: 'Lames en aciers standards', partner: 'Verdier Manufacture', place: 'Celles-sur-Durolle' },
    { matter: 'Aciers XC75 et Z40', partner: 'Aciéries de Bonpertuis', place: 'Thiers' },
    { matter: 'Acier 14C28', partner: 'Sandvik', place: 'Suède' },
    { matter: 'RWL34 et lames damas', partner: 'Damasteel', place: '' },
    { matter: 'Lames damas', partner: 'Takefu', place: '' },
    { matter: 'Bois', partner: 'Bois d’origine ariégeoise, séchés sur place, imprégnés d’huile de lin ; bois précieux pour les séries spéciales', place: 'Ariège' },
    { matter: 'Corne', partner: 'Cornes bovines importées ; cornes de bélier mises en forme à chaud ; bois de cerf locaux issus de la mue, travaillés à l’atelier', place: '' },
  ],
  notes: [
    { label: 'Entretien', text: 'Les couteaux fabriqués à l’atelier y sont entretenus gratuitement.' },
    { label: 'Fourreau', text: 'La plupart de nos couteaux sont livrés avec un fourreau en feutrine ou en cuir.' },
  ],
  photos: [
    { src: '/images/atelier/production-debit-bois.jpg', alt: 'Le débit des bois à l’atelier', caption: 'Le débit des bois.' },
    { src: '/images/atelier/production-debit-cerf.jpg', alt: 'Des bois de cerf débités pour les manches', caption: 'Bois de cerf issus de la mue.' },
    { src: '/images/atelier/production-plaquettes-roques.jpg', alt: 'Des plaquettes de manche de Roques', caption: 'Plaquettes de Roques.' },
    { src: '/images/atelier/production-damas-en-cours.jpg', alt: 'Une lame damas en cours de fabrication', caption: 'Une lame damas en cours.' },
    { src: '/images/atelier/production-systeme-en-cours.jpg', alt: 'Des couteaux à système en cours de montage', caption: 'Couteaux à système, avant finition.' },
    { src: '/images/atelier/production-manche-table.jpg', alt: 'Des couteaux de table en cours de fabrication', caption: 'Couteaux de table en cours.' },
  ],
});

export const patents = typoDeep({
  title: 'Protéger un couteau local.',
  text: 'Depuis nos débuts, nous avons croisé des copies destinées à tromper ceux qui cherchent un couteau d’ici. Nos dessins et nos marques sont donc déposés. Nous ne refusons pas les collaborations, à condition qu’elles respectent nos critères de qualité et de déontologie, du fabricant au client.',
  marks: [
    { name: 'L’Ariégeois', number: '3888775' },
    { name: 'Le Cathare', number: '3104175' },
    { name: 'Le Grat', number: '3888778' },
    { name: 'Le Roques', number: '3888801' },
  ],
  designs: [
    { name: 'L’Ariégeois pliant', number: '006404', image: '/images/brevets/dessin-ariegeois.jpg' },
    { name: 'L’Ariégeois de table', number: '20102186', image: '' },
    { name: 'Le Cathare', number: '20120767', image: '/images/brevets/dessin-cathare.jpg' },
    { name: 'Le Grat', number: '20120766', image: '/images/brevets/dessin-grat.jpg' },
    { name: 'Le Montagnol', number: '20161504', image: '' },
    { name: 'Le Roques', number: '', image: '/images/brevets/dessin-roques.jpg', missing: 'numéro complet du dépôt du dessin du Roques, illisible sur le catalogue (« 2012076… »)' },
  ],
});

/** URL d'intégration reprises de la page actuelle « Visitez notre boutique ». */
export const virtualTours = [
  {
    id: 'boutique',
    title: 'La boutique',
    cta: 'Entrer dans la boutique',
    poster: '/images/boutique/boutique-15-interieur.jpg',
    alt: 'L’intérieur de la boutique du 15 rue des Marchands',
    embed:
      'https://www.google.com/maps/embed?pb=!4v1607518524923!6m8!1m7!1sCAoSLEFGMVFpcE5mMTBseHJHMDdMa3dUSlZRSDNqdG44LXBEdnI4ckpyQVpSTUNw!2m2!1d42.966119943048!2d1.6066908026343!3f230.4780832612753!4f0.07262388455254154!5f0.7820865974627469',
  },
  {
    id: 'atelier',
    title: 'L’atelier',
    cta: 'Entrer dans l’atelier',
    poster: '/images/atelier/atelier-17-etabli.jpg',
    alt: 'L’établi de l’atelier historique',
    embed:
      'https://www.google.com/maps/embed?pb=!4v1607816431757!6m8!1m7!1sCAoSLEFGMVFpcE1OQ2J3RnBuU2ZFR1dZTnNodXNIYXE1aHdQYkNVdXp4Y2phYy1y!2m2!1d42.966112093145!2d1.6065625951003!3f232.60350894414393!4f-11.932270929552459!5f0.4000000000000002',
  },
];
