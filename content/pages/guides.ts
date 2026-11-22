import { typoDeep } from '@/lib/typo';

export const steels = typoDeep({
  title: 'Guide des aciers.',
  intro: 'Le choix d’un acier, c’est le choix d’une relation : l’inox se laisse oublier, le carbone demande un geste, le damas se regarde.',
  text: 'Les aciers sont choisis pour leur qualité et leur accessibilité. Nous réalisons la mise en forme et le traitement thermique de nos lames, pour une géométrie et une tenue de coupe optimales.',
  rows: [
    { steel: 'XC75 ou DHN7', origin: 'Aciérie de Bonpertuis', family: 'Carbone (oxydable)', hrc: '59 ± 1', who: 'Pour qui accepte un geste d’entretien : l’essuyer, l’huiler. Il s’affûte volontiers sur pierre naturelle.' },
    { steel: 'D2', origin: 'Allemagne', family: 'Semi-inoxydable', hrc: '61 ± 1', who: 'Entre le carbone et l’inox.' },
    { steel: '14C28', origin: 'Sandvik', family: 'Inoxydable', hrc: '59 ± 1', who: 'L’acier de nos pliants et de nos couteaux de table : il ne craint pas l’humidité et se laisse oublier.' },
    { steel: 'N690', origin: 'Böhler', family: 'Inoxydable', hrc: '61 ± 1', who: 'Un inoxydable plus dur.' },
    { steel: 'RWL34', origin: 'Damasteel', family: 'Inoxydable fritté', hrc: '60 ± 1', who: 'Un acier issu de la métallurgie des poudres, pour les pièces d’exception.' },
    { steel: 'Damasteel RWL34 + PMC27', origin: 'Damasteel', family: 'Damas inoxydable', hrc: '60 ± 1', who: 'Le damas de nos pièces de prestige : il se regarde autant qu’il coupe.' },
    { steel: 'Suminagashi SGPS / SG2', origin: 'Takefu', family: 'Feuilleté', hrc: '61 ± 1', who: 'Un acier feuilleté japonais.' },
  ],
});

export const care = typoDeep({
  title: 'Conseils et entretien.',
  intro: 'Un couteau ne se lave pas, il s’essuie. Quelques gestes simples, de temps à autre, et il vous suivra longtemps.',
  items: [
    { title: 'La lame', text: ['Nettoyez-la avec un chiffon humide plutôt que sous l’eau courante. Jamais de lave-vaisselle. Séchez-la bien.', 'Les lames en acier carbone s’oxydent si elles ne sont pas essuyées : huilez-les régulièrement.'] },
    { title: 'Les manches en corne', text: ['La corne sèche avec le temps et ses fibres peuvent apparaître. Nourrissez-la d’huile, comme le bois.', 'Pour la raviver : un ponçage léger et régulier au papier très fin (P400), puis un polissage à l’huile de lin. Ne la laissez pas tremper, ne l’exposez pas à plus de 50 °C, jamais de lave-vaisselle.'] },
    { title: 'Les manches en bois', text: ['Même principe : huilez-les de temps en temps. Pour les raviver, un ponçage fin puis de l’huile de lin. Ne les laissez pas tremper.'] },
    { title: 'Resserrer un couteau à friction', text: ['La friction se relâche quand la matière sèche : d’où l’intérêt de nourrir le manche.', 'Couteau fermé, posez l’axe sur une surface métallique plate et dure (un étau fermé, une enclume) et frappez l’axe au marteau, des deux côtés. Testez la tension ; recommencez si besoin.'] },
    { title: 'Affûter sur pierre naturelle', text: ['Idéale pour le carbone. Faites-la tremper au moins 15 minutes, gardez-la humide, tenez un angle d’environ 15°.'] },
    { title: 'Affûter sur pierre synthétique', text: ['Idéale pour l’inox. Faites-la tremper au moins 2 heures et gardez-la humide. Tenez un angle de 15 à 20°, constant sur toute la longueur, avec autant de passages de chaque côté.', 'Commencez par la face grossière (foncée) si le fil est abîmé, finissez par la face fine (claire). Retouchez régulièrement sur la face fine.'] },
    { title: 'Ranger son couteau', text: ['Un pliant au fond d’un sac ou d’une poche s’abîme vite : utilisez un fourreau ou un étui en cuir. Gardez la lame sèche et huilée.'] },
  ],
  service: 'Nous affûtons et réparons vos couteaux. Les couteaux fabriqués dans notre atelier sont entretenus gratuitement.',
});

export const shipping = typoDeep({
  title: 'Livraison et retours.',
  intro: 'Livraison offerte dès 100 € d’achat en France métropolitaine. Colis suivis de bout en bout.',
  items: [
    { title: 'Transporteur', text: ['France métropolitaine : Colissimo suivi expert, remis contre signature.', 'Étranger : Colissimo Suivi International, en mode prioritaire. Les colis sont suivis de bout en bout.'] },
    { title: 'Frais de port', text: ['France métropolitaine : 9 €, offerts dès 100 € d’achat.', 'Hors France métropolitaine : forfait selon le poids et la destination (barème de La Poste), affiché à la commande.'] },
    { title: 'Délais', text: ['Délais indicatifs, après validation du paiement. France : de 6 à 10 jours ouvrés, généralement environ 48 h. Étranger : de 4 à 20 jours ouvrés.', 'Au-delà de deux semaines, nous vous prévenons. Les livraisons ont lieu du lundi au vendredi, de 8 h à 18 h 30.'] },
    { title: 'À la réception', text: ['Contrôlez le colis et signalez tout dommage sur le bon de livraison, sous deux jours ouvrés.'] },
    { title: 'Retours', text: ['Nos produits bénéficient des garanties habituelles des fabricants et sont contrôlés avant expédition. En cas de défaut, vous disposez de sept jours pour renvoyer l’article en vue d’un échange.', 'Sont exclus les articles démontés et les dommages dus à l’oxydation.', 'Adresse de retour : Coutellerie Savignac, 15 rue des Marchands, 09000 Foix.'] },
  ],
});

export const press = typoDeep({
  title: 'La presse en parle.',
  articles: [
    { date: '2015-06-02', media: 'La Dépêche du Midi', title: 'Savignac : il va réaliser des couteaux sur mesure', summary: 'L’atelier s’équipe et recrute un coutelier pour proposer des couteaux sur mesure.', quote: '', url: 'https://www.ladepeche.fr/article/2015/06/02/2115967-savignac-il-va-realiser-des-couteaux-sur-mesure.html' },
    { date: '2013-10-25', media: 'Ariège News', author: 'Laurence Cabrol', title: 'Foix : Olivier Montariol, la fine lame de la maison Savignac', summary: 'Portrait d’Olivier Montariol, à la tête de la coutellerie depuis 2007.', quote: '« C’est devenu une passion que je veux désormais faire partager. »', url: '' },
    { date: '2013-07-06', media: 'La Dépêche du Midi', title: 'Après l’ariégeois et le cathare voici le roques', summary: 'La naissance du Roques, lancé en série en 2013.', quote: '« Le roques est né du ratage d’un ariégeois. »', url: 'https://www.ladepeche.fr/article/2013/07/06/1666330-foix-apres-l-ariegeois-et-le-cathare-voici-le-roques.html' },
    { date: '2012-07-22', media: 'La Dépêche du Midi', title: 'Foix. La boutique Savignac s’agrandit… de l’autre côté de la rue', summary: 'L’ouverture de Savignac Maison, et la découverte d’une crypte en pierre dans la cave.', quote: '« Nous ne savions pas qu’il y avait ce trésor. »', url: 'https://www.ladepeche.fr/article/2012/07/22/1405014-foix-la-boutique-savignac-s-agrandit-de-l-autre-cote-de-la-rue.html' },
    { date: '2010-08-10', media: 'La Dépêche du Midi', author: 'Sabrina Rezki', title: 'L’Ariégeois, un couteau, une histoire, une famille', summary: 'L’histoire de L’Ariégeois et de la famille qui le fabrique.', quote: '« Mon père a apporté une originalité aux couteaux Grat de nos aïeux. »', url: 'https://www.ladepeche.fr/article/2010/08/10/886599-l-ariegeois-un-couteau-une-histoire-une-famille.html' },
  ],
  comic: { title: 'Fabrication du couteau de chasse', url: 'https://www.calameo.com/read/0047694087a9a7a053a57', cover: '/images/presse/bd-fabrication.jpg' },
});
