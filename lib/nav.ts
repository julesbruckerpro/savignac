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
    { id: 'roques', label: t('roques'), href: '/modele/le-roques' },
    {
      id: 'poche',
      label: t('poche'),
      href: '/couteaux/poche',
      columns: [
        { title: t('friction'), links: ['l-ariegeois', 'le-cathare', 'le-roques', 'le-grat', 'le-montagnol', 'le-phasme'].map(model) },
        { title: t('systeme'), links: ['l-ariegeois-cran-plat', 'le-roques-cran-plat', 'le-capi'].map(model) },
      ],
      feature: {
        image: '/images/produits/roques-facettes.jpg',
        alt: 'Le Roques, manche en corne noire à facettes, lame inox, vue de trois-quarts',
        label: t('compose'),
        href: '/modele/le-roques',
        caption: 'Le Roques, corne noire à facettes',
      },
    },
    {
      id: 'table',
      label: t('table'),
      href: '/couteaux/table',
      columns: [
        {
          links: [
            model('l-ariegeois-de-table'),
            model('le-grat-de-table'),
            model('le-roques-de-table'),
            prod('le-calla'),
            { label: 'Les coffrets', href: '/couteaux/table#coffrets' },
          ],
        },
      ],
    },
    {
      id: 'cuisine',
      label: t('cuisine'),
      href: '/couteaux/cuisine',
      columns: [
        {
          links: [
            prod('grat-office', 'Office'),
            prod('grat-cuisine', 'Chef'),
            prod('couteau-a-fromage', 'Fromage'),
            prod('coffret-chef-office-grat', 'Coffret Chef + Office'),
          ],
        },
      ],
    },
    { id: 'fixes', label: t('fixes'), href: '/couteaux/fixes' },
    { id: 'prestige', label: t('prestige'), href: '/couteaux/prestige' },
    {
      id: 'accessoires',
      label: t('accessoires'),
      href: '/couteaux/accessoires',
      columns: [
        {
          links: [
            { label: 'Fourreaux & étuis', href: '/couteaux/accessoires#fourreaux-etuis', price: from(1200) },
            { label: 'Pierres à aiguiser', href: '/couteaux/accessoires#pierres', price: from(900) },
            prod('gravure-personnalisee-sur-lame', 'Gravure'),
          ],
        },
        {
          links: [
            prod('ciselage', 'Ciselage (guillochage)'),
            prod('prestation-atelier', 'Prestation atelier'),
            prod('coupe-choux', 'Rasage'),
          ],
        },
      ],
    },
    { id: 'cadeaux', label: t('cadeaux'), href: '/idees-cadeaux' },
    {
      id: 'maison',
      label: t('maison'),
      href: '/la-maison',
      columns: [
        {
          links: [
            { label: 'Histoire', href: '/la-maison/histoire' },
            { label: 'Les ateliers', href: '/la-maison/les-ateliers' },
            { label: 'Une production locale', href: '/la-maison/une-production-locale' },
          ],
        },
        {
          links: [
            { label: 'Notre gamme', href: '/la-maison/notre-gamme' },
            { label: 'Les brevets', href: '/la-maison/brevets' },
            { label: 'Visite virtuelle', href: '/la-maison/visite-virtuelle' },
          ],
        },
        {
          links: [
            { label: 'Le film', href: '/la-maison#film' },
            { label: 'Presse', href: '/presse' },
            { label: 'Revendeurs', href: '/revendeurs' },
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
