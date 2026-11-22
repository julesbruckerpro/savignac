import type { MetadataRoute } from 'next';
import { commerce } from '@/lib/commerce';
import { site } from '@/lib/site';

const STATIC = [
  '', '/couteaux', '/couteaux/poche', '/couteaux/friction', '/couteaux/systeme', '/couteaux/table', '/couteaux/cuisine', '/couteaux/prestige',
  '/couteaux/fixes', '/couteaux/accessoires', '/idees-cadeaux', '/nouveautes', '/meilleures-ventes', '/la-maison', '/la-maison/histoire',
  '/la-maison/les-ateliers', '/la-maison/une-production-locale', '/la-maison/notre-gamme', '/la-maison/brevets', '/la-maison/visite-virtuelle',
  '/presse', '/presse/fabrication-illustree', '/presse/communication', '/presse/catalogue', '/presse/video', '/conseils-entretien',
  '/guide-des-aciers', '/friction-ou-systeme', '/revendeurs', '/contact', '/livraison-retours', '/cgv', '/mentions-legales', '/confidentialite',
];

/** Prêt pour le lancement ; pendant la démonstration, robots.txt interdit toute indexation. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.getAllProducts('fr');
  return [
    ...STATIC.map((p) => ({ url: site.url + p, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${site.url}${p.template === 'modele' ? '/modele' : '/produit'}/${p.handle}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
