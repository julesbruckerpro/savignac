import { define, site } from './_site';

const base = { template: 'produit' as const, category: 'accessoires' as const, mechanisms: [], legacyCategoryId: '15' };

export const fourreauxEnCuir = define({
  ...base,
  handle: 'fourreaux-en-cuir',
  name: 'Fourreaux en cuir',
  subcategory: 'fourreaux-etuis',
  kicker: 'Fourreaux & étuis',
  eyebrow: 'Accessoire · cuir de vache',
  shortLine: 'Pour glisser son pliant dans une poche ou un sac sans l’abîmer.',
  optionLabels: { manche: 'Couleur', format: 'Taille' },
  variants: site(11, { mancheGroup: true, formatGroup: 'Taille', lame: false }),
  description: ['Un fourreau en cuir de vache, noir ou marron, pour porter son couteau de poche à l’abri. Il est fabriqué par l’ESAT les Dolmens, à Martiel, en Aveyron.'],
  seo: { title: 'Fourreaux en cuir pour couteaux pliants', description: 'Fourreaux en cuir de vache pour couteaux de poche, fabriqués en Aveyron par l’ESAT les Dolmens. 12 €.' },
});

export const etuiHorizontal = define({
  ...base,
  handle: 'etui-en-cuir-port-horizontal',
  name: 'Étui en cuir port horizontal',
  subcategory: 'fourreaux-etuis',
  kicker: 'Fourreaux & étuis',
  eyebrow: 'Accessoire · cuir de vache',
  shortLine: 'À la ceinture, pour Le Phasme et Le Cathare.',
  variants: site(129, { lame: false }),
  description: ['Un étui en cuir de vache à porter à la ceinture, à l’horizontale. Il convient tout particulièrement au Phasme et au Cathare. Fabriqué par l’ESAT les Dolmens, en Aveyron.'],
  seo: { title: 'Étui en cuir port horizontal pour couteau pliant', description: 'Étui en cuir de vache pour port horizontal à la ceinture, fabriqué en Aveyron. 25 €.' },
});

export const etuisCuir = define({
  ...base,
  handle: 'etuis-en-cuir-port-horizontal-ou-vertical',
  name: 'Étuis en cuir port horizontal ou vertical',
  subcategory: 'fourreaux-etuis',
  kicker: 'Fourreaux & étuis',
  eyebrow: 'Accessoire · cuir de vache',
  shortLine: 'À la ceinture, à l’horizontale ou à la verticale.',
  optionLabels: { manche: 'Couleur' },
  variants: site(12, { mancheGroup: true, lame: false }),
  description: ['Un étui en cuir de vache qui se porte à la ceinture, à l’horizontale ou à la verticale. Sa taille convient à L’Ariégeois, au Cathare et à L’Ariégeois cran plat. Réalisé par l’ESAT les Dolmens, en Aveyron.'],
  seo: { title: 'Étuis en cuir pour couteaux pliants', description: 'Étuis en cuir de vache, port horizontal ou vertical, pour L’Ariégeois et Le Cathare. 27 €.' },
});

export const pierrePyrenees = define({
  ...base,
  handle: 'pierre-a-aiguiser-des-pyrenees',
  name: 'Pierre à aiguiser des Pyrénées',
  subcategory: 'pierres',
  kicker: 'Pierres à aiguiser',
  eyebrow: 'Accessoire · pierre naturelle d’Ariège',
  shortLine: 'Pierre naturelle de la vallée de Saurat, idéale pour le carbone.',
  optionLabels: { format: 'Taille' },
  defaultVariantSku: 'SAV-13-MM',
  variants: site(13, { formatGroup: 'Pierre à aiguiser', lame: false }),
  description: [
    'Cette pierre naturelle vient de la vallée de Saurat, en Ariège, à une vingtaine de kilomètres de la coutellerie : la dernière fabrique de pierres à aiguiser naturelles de France.',
    'Son grain médium convient très bien aux lames en acier carbone. La faire tremper au moins quinze minutes avant usage et la garder humide.',
  ],
  seo: { title: 'Pierre à aiguiser naturelle des Pyrénées', description: 'Pierre à aiguiser naturelle de la vallée de Saurat, en Ariège, idéale pour l’acier carbone. Dès 6 €.' },
});

export const pierreSynthetique = define({
  ...base,
  handle: 'pierre-a-aiguiser-synthetique',
  name: 'Pierre à aiguiser synthétique',
  subcategory: 'pierres',
  kicker: 'Pierres à aiguiser',
  eyebrow: 'Accessoire · pierre Tyrolit',
  shortLine: 'Plus abrasive, idéale pour l’inox.',
  optionLabels: { format: 'Taille' },
  variants: site(14, { formatGroup: 'Pierre à aiguiser', lame: false }),
  description: [
    'Les pierres synthétiques de la marque autrichienne Tyrolit sont plus abrasives : nous les recommandons pour les aciers inoxydables, le 14C28 notamment.',
    'La faire tremper au moins deux heures avant usage, la garder humide, tenir un angle de 15 à 20° sur toute la longueur de la lame.',
  ],
  seo: { title: 'Pierre à aiguiser synthétique', description: 'Pierre à aiguiser synthétique Tyrolit, idéale pour les lames en acier inoxydable. Dès 18 €.' },
});

export const gravure = define({
  ...base,
  handle: 'gravure-personnalisee-sur-lame',
  name: 'Gravure personnalisée sur lame',
  subcategory: 'gravure',
  kicker: 'Gravure',
  eyebrow: 'Service · atelier de Foix',
  shortLine: 'Un prénom, une date, quelques mots sur la lame.',
  variants: site(10, { lame: false }).slice(0, 1),
  description: [
    'Faites graver la lame de votre couteau : un prénom, une date, quelques mots. La gravure est réalisée à l’atelier de Foix.',
    'Sur chaque fiche de couteau pliant, la gravure se choisit directement dans le configurateur, avec un aperçu sur la lame.',
  ],
  seo: { title: 'Gravure personnalisée sur lame', description: 'Faites graver la lame de votre couteau Savignac à l’atelier de Foix. 12 €.' },
});

export const ciselage = define({
  ...base,
  handle: 'ciselage',
  name: 'Ciselage',
  subcategory: 'ciselage',
  kicker: 'Ciselage · guillochage',
  eyebrow: 'Service · atelier de Foix',
  shortLine: 'Le dos de la lame, sculpté à la main par le coutelier.',
  optionLabels: { format: 'Ciselage' },
  variants: site(23, { formatGroup: 'Ciselage', lame: false }),
  description: [
    'Le ciselage est l’opération par laquelle le coutelier sculpte les parties métalliques du couteau. Il est réalisé sur le dos de la lame.',
    'Le motif est laissé à la main du coutelier : il ne sera pas identique à celui de la photo.',
  ],
  seo: { title: 'Ciselage du dos de lame', description: 'Ciselage (guillochage) du dos de lame, réalisé à la main à l’atelier de Foix. Dès 4 €.' },
});

export const prestationAtelier = define({
  ...base,
  handle: 'prestation-atelier',
  name: 'Prestation atelier',
  subcategory: 'atelier',
  kicker: 'Atelier · affûtage et réparation',
  eyebrow: 'Service · atelier de Foix',
  shortLine: 'Affûtage, restauration, réparation : réglez votre prestation à distance.',
  variants: site(99, { lame: false }),
  description: [
    'Une unité de prestation atelier vaut 5 €. Pour une réparation chiffrée à 25 €, ajoutez cinq unités au panier.',
    'Envoyez-nous une photo de votre couteau : l’atelier évalue le temps et les matériaux nécessaires, puis vous indique le nombre d’unités. Les frais d’acheminement du couteau sont à la charge du client.',
  ],
  seo: { title: 'Prestation atelier : affûtage et réparation', description: 'Affûtage, restauration et réparation de couteaux à l’atelier de Foix. Unité de prestation : 5 €.' },
});

export const coupeChoux = define({
  ...base,
  handle: 'coupe-choux',
  name: 'Coupe-chou',
  subcategory: 'rasage',
  kicker: 'Rasage',
  eyebrow: 'Rasoir · lame Fontenille',
  shortLine: 'Lames Fontenille en acier carbone forgé, remontées à l’atelier.',
  variants: site(116, { mancheGroup: true, lame: false }),
  description: [
    'Des coupe-choux de la maison Fontenille, maison thiernoise qui a produit des lames en acier carbone forgé entre 1880 et 1959. Ce sont des 5/8, le format du rasage quotidien, de la collection Fontenille médaille d’or.',
    'Les manches d’origine ont été remplacés par des chasses en bouleau ou en ronce de noyer. Les lames peuvent garder de légères traces d’oxydation de surface, jamais sur le tranchant.',
  ],
  seo: { title: 'Coupe-chou, rasoir à lame Fontenille', description: 'Coupe-choux à lame Fontenille en acier carbone forgé, chasses en bouleau ou en noyer. 180 €.' },
});
