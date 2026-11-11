import legacyProducts from './data/legacy-redirects.json';

export interface Redirect {
  source: string;
  destination: string;
}

/** Correspondance des pages du site actuel (PrestaShop) → nouvelles routes. Redirections 301. */
const pages: [string, string][] = [
  // catégories
  ['12-couteau-pliants-poches', '/couteaux/poche'],
  ['37-tables', '/couteaux/table'],
  ['38-couteaux-de-cuisine', '/couteaux/cuisine'],
  ['66-:slug', '/produit/grat-office'],
  ['68-:slug', '/produit/grat-cuisine'],
  ['69-:slug', '/produit/couteau-a-fromage'],
  ['40-prestiges', '/couteaux/prestige'],
  ['44-fixes', '/couteaux/fixes'],
  ['15-accessoires-pour-couteaux', '/couteaux/accessoires'],
  ['33-:slug', '/couteaux/accessoires#fourreaux-etuis'],
  ['35-:slug', '/couteaux/accessoires#pierres'],
  ['36-:slug', '/produit/gravure-personnalisee-sur-lame'],
  ['45-:slug', '/produit/ciselage'],
  ['56-:slug', '/produit/coupe-choux'],
  // modèles
  ['16-couteau-ariegeois', '/modele/l-ariegeois'],
  ['49-l-ariegeois-cran-plat', '/modele/l-ariegeois?mecanisme=cran-plat'],
  ['19-le-cathare', '/modele/le-cathare'],
  ['17-le-roques', '/modele/le-roques'],
  ['59-le-roques-cran-plat', '/modele/le-roques?mecanisme=cran-plat'],
  ['65-le-montagnol', '/modele/le-montagnol'],
  ['18-le-grat', '/modele/le-grat'],
  ['50-le-phasme', '/modele/le-phasme'],
  ['72-le-capi', '/modele/le-capi'],
  ['55-l-ariegeois-de-table', '/modele/l-ariegeois-de-table'],
  ['42-le-grat-de-table', '/modele/le-grat-de-table'],
  ['71-le-roques-de-table', '/modele/le-roques-de-table'],
  ['54-le-calla', '/produit/le-calla'],
  // listes
  ['nouveaux-produits-couteaux', '/nouveautes'],
  ['meilleures-ventes', '/meilleures-ventes'],
  ['contactez-nous', '/contact'],
  ['mon-compte', '/compte'],
  ['commande', '/panier'],
  // contenus
  ['content/category/2-atelier-couteau', '/la-maison'],
  ['content/4-historique-couteau-savignac', '/la-maison/histoire'],
  ['content/8-Etablissements_historiques', '/la-maison/les-ateliers'],
  ['content/21-atelier-production-peysales', '/la-maison/les-ateliers#peysales'],
  ['content/10-une-production-locale', '/la-maison/une-production-locale'],
  ['content/11-notre-gamme-de-couteaux', '/la-maison/notre-gamme'],
  ['content/12-les-brevets-couteaux', '/la-maison/brevets'],
  ['content/19-visitez-notre-boutique', '/la-maison/visite-virtuelle'],
  ['content/13-la-presse-en-parle', '/presse'],
  ['content/14-Fabrication-illustree', '/presse/fabrication-illustree'],
  ['content/15-communication-de-presse', '/presse/communication'],
  ['content/16-catalogue', '/presse/catalogue'],
  ['content/17-video', '/presse/video'],
  ['content/9-conseils-et-entretien-des-couteaux', '/conseils-entretien'],
  ['content/18-nos-revendeurs', '/revendeurs'],
  ['content/1-livraison-couteau', '/livraison-retours'],
  ['content/3-conditions-generales-de-vente', '/cgv'],
  ['content/2-mentions-legales', '/mentions-legales'],
  ['content/20-politique-de-protection-de-la-vie-privee', '/confidentialite'],
];

export const redirects: Redirect[] = [
  // fusion des doublons : les fiches « cran plat » vivent sur la fiche du modèle
  { source: '/:locale(fr|en|de|it)?/modele/l-ariegeois-cran-plat', destination: '/modele/l-ariegeois?mecanisme=cran-plat' },
  { source: '/:locale(fr|en|de|it)?/modele/le-roques-cran-plat', destination: '/modele/le-roques?mecanisme=cran-plat' },
  // anciennes pages, avec ou sans préfixe de langue
  ...pages.flatMap(([from, to]) => [
    { source: `/fr/${from}`, destination: to },
    ...(from.startsWith('content/') ? [{ source: `/${from}`, destination: to }] : []),
  ]),
  // anciennes fiches produits → nouvelle fiche, variante pré-sélectionnée
  ...(legacyProducts as Redirect[]),
];
