import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Configurator, type UpsellLine } from '@/components/product/Configurator';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { commerce, type Product } from '@/lib/commerce';
import { formatPriceShort } from '@/lib/format';
import { site } from '@/lib/site';

const CATEGORY: Record<string, { label: string; href: string }> = {
  poche: { label: 'Couteaux de poche', href: '/couteaux/poche' },
  table: { label: 'Art de la table', href: '/couteaux/table' },
  cuisine: { label: 'Cuisine', href: '/couteaux/cuisine' },
  fixes: { label: 'Lames fixes', href: '/couteaux/fixes' },
  accessoires: { label: 'Accessoires', href: '/couteaux/accessoires' },
};

export function productMetadata(product: Product): Metadata {
  const path = `${product.template === 'modele' ? '/modele' : '/produit'}/${product.handle}`;
  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: path },
    openGraph: { title: product.seo.title, description: product.seo.description, images: product.listings[0]?.image ? [product.listings[0].image] : undefined },
  };
}

/** Gabarit commun aux fiches modèle (configurateur complet) et aux fiches simples. */
export async function ProductPage({ product, locale }: { product: Product; locale: string }) {
  const t = await getTranslations('config');
  const all = await commerce.getAllProducts(locale);
  const listings = await commerce.getListings(locale);

  const upsells: UpsellLine[] = (product.upsells ?? [])
    .map((h) => all.find((p) => p.handle === h))
    .filter((p): p is Product => !!p)
    .map((p) => {
      const min = Math.min(...p.variants.map((v) => v.price));
      const max = Math.max(...p.variants.map((v) => v.price));
      return { name: p.name, href: `/produit/${p.handle}`, price: min === max ? formatPriceShort(min) : `dès ${formatPriceShort(min)}` };
    });
  if (product.category !== 'accessoires') upsells.push({ name: 'Conseils et entretien', href: '/conseils-entretien', price: 'Lire' });

  const related = listings.filter((l) => l.productHandle !== product.handle && l.category === product.category && !l.id.endsWith('cran-plat')).slice(0, 3);
  const fallback = related.length < 3 ? listings.filter((l) => l.category === 'poche' && l.productHandle !== product.handle && !related.includes(l)).slice(0, 3 - related.length) : [];
  const cat = CATEGORY[product.category];
  const prices = product.variants.map((v) => v.price);
  const path = `${product.template === 'modele' ? '/modele' : '/produit'}/${product.handle}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo.description,
    brand: { '@type': 'Brand', name: 'Savignac' },
    image: product.listings[0]?.image ? site.url + product.listings[0].image : undefined,
    url: site.url + path,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: (Math.min(...prices) / 100).toFixed(2),
      highPrice: (Math.max(...prices) / 100).toFixed(2),
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <Breadcrumb items={[{ label: cat.label, href: cat.href }, { label: product.name }]} />
      <Configurator
        product={product}
        upsells={upsells}
        atelier={{
          src: '/images/atelier/atelier-2.jpg',
          alt: 'Les mains d’un coutelier au travail dans l’atelier de Foix',
          caption: 'À l’atelier : le façonnage d’un manche au backstand.',
        }}
      />
      <section className="wrap section">
        <h2 className="label border-b border-rule-strong pb-5">{product.category === 'accessoires' ? 'À voir aussi' : t('sameWorkshop')}</h2>
        <ProductGrid className="pt-10">
          {[...related, ...fallback].map((l, i) => (
            <ProductCard key={l.id} listing={l} index={i} />
          ))}
        </ProductGrid>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
