import { formatPriceShort } from './format';
import type { Listing, Product } from './commerce/types';

export interface NavLink {
  label: string;
  href: string;
  price?: string;
}
export interface NavColumn {
  title?: string;
  links: NavLink[];
}
export interface NavItem {
  id: string;
  label: string;
  href: string;
  columns?: NavColumn[];
  feature?: { image: string; alt: string; label: string; href: string; caption: string };
  /** 'house' : rubriques éditoriales, séparées des familles de produits. */
  side?: 'shop' | 'house';
}

type T = (key: string, values?: Record<string, string>) => string;

/** Navigation principale, dans l'ordre exact du cahier (3.1). Les prix d'appel viennent des données. */
export function buildNav(listings: Listing[], products: Product[], t: T): NavItem[] {
  const byId = new Map(listings.map((l) => [l.id, l]));
  const from = (cents: number) => t('from', { price: formatPriceShort(cents) });
  const model = (id: string): NavLink => {
    const l = byId.get(id);
    return l ? { label: l.name, href: l.href, price: l.fromPrice === l.toPrice ? formatPriceShort(l.fromPrice) : from(l.fromPrice) } : { label: id, href: '/couteaux' };
  };
  const prod = (handle: string, label?: string): NavLink => {
    const p = products.find((x) => x.handle === handle);
    if (!p) return { label: label ?? handle, href: '/couteaux' };
    const min = Math.min(...p.variants.map((v) => v.price));
    const max = Math.max(...p.variants.map((v) => v.price));
    return { label: label ?? p.name, href: `/produit/${p.handle}`, price: min === max ? formatPriceShort(min) : from(min) };
  };

  return [
    {
      id: 'poche',
      label: t('pliants'),
      href: '/couteaux/poche',
      columns: [
        { title: t('friction'), links: ['le-montagnol', 'l-ariegeois', 'le-grat', 'le-cathare', 'le-roques', 'le-phasme'].map(model) },
        { title: t('systeme'), links: ['l-ariegeois-cran-plat', 'le-roques-cran-plat', 'le-capi'].map(model) },
        {
          title: 'Aussi',
          links: [
            { label: 'Lames fixes', href: '/couteaux/fixes', price: from(19900) },
            { label: 'Accessoires', href: '/couteaux/accessoires', price: from(400) },
            { label: 'Gravure sur lame', href: '/produit/gravure-personnalisee-sur-lame', price: formatPriceShort(1200) },
            { label: 'Idées cadeaux', href: '/idees-cadeaux' },
          ],
        },
      ],
      feature: {
        image: '/images/produits/site/87.jpg',
        alt: 'L’Ariégeois cran plat, manche en ébène royal, lame inox, vue de trois-quarts',
        label: t('compose'),
        href: '/modele/l-ariegeois?mecanisme=cran-plat',
        caption: 'L’Ariégeois cran plat, ébène royal',
      },
    },
    {
      id: 'table',
      label: t('tableShort'),
      href: '/couteaux/table',
      columns: [
        { title: 'Les modèles', links: [model('l-ariegeois-de-table'), model('le-grat-de-table'), model('le-roques-de-table'), prod('le-calla')] },
        { title: 'Offrir', links: [{ label: 'Duos et coffrets', href: '/couteaux/table#coffrets' }, { label: 'Idées cadeaux', href: '/idees-cadeaux' }] },
      ],
    },
    {
      id: 'cuisine',
      label: t('cuisine'),
      href: '/couteaux/cuisine',
      columns: [
        { links: [prod('grat-office', 'Office'), prod('grat-cuisine', 'Chef'), prod('couteau-a-fromage', 'Fromage'), prod('coffret-chef-office-grat', 'Coffret Chef + Office')] },
        { title: 'Entretenir', links: [{ label: 'Pierres à aiguiser', href: '/couteaux/accessoires#pierres', price: from(600) }, { label: 'Conseils et entretien', href: '/conseils-entretien' }] },
      ],
    },
    { id: 'prestige', label: t('prestiges'), href: '/couteaux/prestige' },
    {
      id: 'maison',
      label: t('about'),
      href: '/la-maison',
      side: 'house',
      columns: [
        {
          title: 'Notre histoire',
          links: [
            { label: 'Histoire & archives', href: '/la-maison/histoire' },
            { label: 'L’atelier & la fabrication', href: '/la-maison/les-ateliers' },
            { label: 'Une production locale', href: '/la-maison/une-production-locale' },
            { label: 'Le film', href: '/la-maison#film' },
          ],
        },
        {
          title: 'Nos couteaux',
          links: [
            { label: 'Notre gamme', href: '/la-maison/notre-gamme' },
            { label: 'Friction ou système', href: '/friction-ou-systeme' },
            { label: 'Guide des aciers', href: '/guide-des-aciers' },
            { label: 'Les brevets', href: '/la-maison/brevets' },
          ],
        },
        {
          title: 'Nous trouver',
          links: [
            { label: 'Nos revendeurs', href: '/revendeurs' },
            { label: 'Ils nous font confiance', href: '/la-maison/ils-nous-font-confiance' },
            { label: 'Presse', href: '/presse' },
            { label: 'Visite virtuelle', href: '/la-maison/visite-virtuelle' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      ],
    },
  ];
}

export interface SearchEntry {
  label: string;
  sub?: string;
  href: string;
  kind: 'models' | 'pages';
  keywords: string;
}
