import type { Collection } from '@/lib/commerce/types';

/** Textes d'introduction réécrits à partir des descriptions actuelles (cahier 7.2). */
export const collections: Collection[] = [
  {
    handle: 'tous',
    title: 'Toute la collection',
    intro:
      'Couteaux de poche, de table et de cuisine, lames fixes et pièces de prestige : tout ce que la Maison fabrique à Foix, réuni sur une seule page.',
    seo: { title: 'Tous les couteaux', description: 'Toute la collection de la Coutellerie Savignac : pliants, couteaux de table et de cuisine, lames fixes, fabriqués à Foix.' },
  },
  {
    handle: 'poche',
    title: 'Couteaux de poche',
    intro:
      'Depuis près de trois siècles, la Maison façonne à Foix des couteaux pliants nés du capucin pyrénéen. Lames en inox 14C28, en RWL34 ou en damas ; manches taillés dans les bois d’Ariège, les bois précieux ou la corne. Légers en poche, ils accompagnent la marche, la cueillette, la table.',
    seo: { title: 'Couteaux de poche pliants', description: 'Couteaux pliants fabriqués à Foix : L’Ariégeois, Le Roques, Le Cathare, Le Grat, Le Montagnol, Le Phasme, Le Capi. Dès 46 €.' },
    editorial: {
      title: 'Du capucin au cran plat.',
      columns: [
        'Nos pliants à friction descendent du capucin, le couteau des bergers pyrénéens : une lame, un manche, deux clous. Ferdinand Grat le fabriquait à Foix au XIXᵉ siècle ; la Maison en a tiré L’Ariégeois, Le Cathare, Le Grat, Le Roques et Le Montagnol. Le Phasme, lui, s’inspire du coupe-chou.',
        'Les couteaux à système ajoutent un ressort : le cran plat maintient la lame ouverte et l’arrête à 90° avant de la refermer. C’est le mécanisme de L’Ariégeois cran plat, du Roques cran plat et du Capi.',
      ],
    },
  },
  {
    handle: 'friction',
    title: 'Couteaux à friction',
    intro:
      'Une lame, un manche, deux clous. Le couteau du berger pyrénéen, héritier du capucin : la lame tourne sur un clou, s’arrête sur l’autre ; rien d’autre. Léger, franc, fidèle.',
    seo: { title: 'Couteaux pliants à friction', description: 'Couteaux à friction, dits « deux clous », fabriqués à Foix : L’Ariégeois, Le Cathare, Le Roques, Le Grat, Le Montagnol, Le Phasme.' },
  },
  {
    handle: 'systeme',
    title: 'Couteaux à système',
    intro:
      'Un ressort qui retient la lame. Il la maintient ouverte, l’arrête à 90°, puis la ramène sous une pression volontaire. Difficile de le refermer par mégarde.',
    seo: { title: 'Couteaux pliants à système cran plat', description: 'Couteaux à cran plat fabriqués à Foix : L’Ariégeois cran plat, Le Roques cran plat, Le Capi. Dès 100 €.' },
  },
  {
    handle: 'table',
    title: 'Art de la table',
    intro:
      'Le couteau qui reste sur la nappe. Lames inox 14C28 qui ne craignent pas l’humidité, manches de bois, de corne ou de Corian, formes tirées de nos modèles historiques ou de la nature. À l’unité, en duo ou en coffret.',
    seo: { title: 'Couteaux de table', description: 'Couteaux de table fabriqués à Foix : L’Ariégeois de table, Le Grat de table, Le Roques de table, Le Calla. À l’unité, en duo ou en coffret.' },
    editorial: {
      title: 'À l’unité, en duo, en coffret.',
      columns: [
        'L’Ariégeois de table reprend la courbe du pliant ; Le Grat de table garde la petite capuche du capucin ; Le Roques de table tend ses lignes ; Le Calla suit la forme du lys. Tous sont des créations de la Maison.',
        'Un couteau de table ne se lave pas, il s’essuie : un chiffon humide suffit. Jamais de lave-vaisselle, et un peu d’huile de temps à autre sur les manches de bois et de corne.',
      ],
    },
  },
  {
    handle: 'cuisine',
    title: 'Cuisine',
    intro:
      'Le Grat passe en cuisine. Lame en feuille de sauge et petite capuche au bout du manche : l’office pour la précision, le chef pour tout le reste, le couteau à fromage pour finir. Aciers carbone XC75, inox 14C28 ou RWL34.',
    seo: { title: 'Couteaux de cuisine', description: 'Couteaux de cuisine fabriqués à Foix : office, chef, fromage et coffret Chef + Office. Dès 68 €.' },
  },
  {
    handle: 'fixes',
    title: 'Lames fixes',
    intro: 'Pour la chasse, le bivouac, le travail du bois. Une lame fixe, plus large et plus sûre en main, fabriquée dans notre atelier du sud de Foix.',
    seo: { title: 'Couteaux à lame fixe', description: 'Couteaux à lame fixe fabriqués à Foix : Le Charognard et Le Bosc.' },
  },
  {
    handle: 'accessoires',
    title: 'Accessoires',
    intro:
      'Pour porter et entretenir son couteau : fourreaux et étuis de cuir, pierre à aiguiser des Pyrénées. Pour le rendre unique : gravure sur la lame, ciselage du dos. Et l’atelier, pour l’affûtage ou la réparation.',
    seo: { title: 'Accessoires pour couteaux', description: 'Fourreaux et étuis en cuir, pierres à aiguiser, gravure, ciselage et prestations d’atelier.' },
  },
  {
    handle: 'prestige',
    title: 'Prestige',
    intro: 'Lames damas, bois de fer d’Arizona, loupes, ébène royal, corne. Ces couteaux sont façonnés à l’atelier, souvent sur mesure. Chacun est unique par sa matière.',
    seo: { title: 'Couteaux de prestige', description: 'Pièces de prestige de la Coutellerie Savignac : lames damas, bois de fer d’Arizona, loupes, ébène royal, corne. Façonnées une à une à Foix.' },
    dark: true,
  },
];

/** Rubriques d'accessoires, dans l'ordre du menu. */
export const accessoryGroups: { id: string; title: string }[] = [
  { id: 'fourreaux-etuis', title: 'Fourreaux & étuis' },
  { id: 'pierres', title: 'Pierres à aiguiser' },
  { id: 'gravure', title: 'Gravure' },
  { id: 'ciselage', title: 'Ciselage' },
  { id: 'atelier', title: 'Prestation atelier' },
  { id: 'rasage', title: 'Rasage' },
];

/**
 * Listes éditoriales. À défaut d'information du back-office, ces sélections sont fixées ici ;
 * elles viendront de Shopify (collections « Nouveautés » et « Meilleures ventes ») à la migration.
 */
export const curated = {
  nouveautes: ['le-capi', 'le-roques-cran-plat', 'le-phasme'],
  meilleuresVentes: ['l-ariegeois', 'le-roques', 'le-montagnol', 'le-grat'],
  home: ['le-roques', 'l-ariegeois', 'le-cathare', 'le-grat', 'le-montagnol', 'le-phasme'],
  gamme: ['le-grat', 'l-ariegeois', 'le-cathare', 'le-roques', 'le-montagnol', 'le-phasme', 'le-capi'],
};
