import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Commitments } from '@/components/layout/Commitments';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { curated } from '@/content/collections';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';

export const metadata: Metadata = { title: 'Nouveautés' };

/**
 * Liste fixée dans content/collections.ts faute d'information du back-office :
 * elle viendra d'une collection Shopify à la migration.
 */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listings = await commerce.getListingsById(curated.nouveautes, locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Nouveautés' }]} />
      <PageIntro title="Nouveautés." text="Le Capi, Le Roques à cran plat en Fat Carbon rouge, Le Phasme." h1Class="title is-46" />
      <section className="wrap section-bottom">
        <ProductGrid className="border-t border-rule-strong pt-12">
          {listings.map((l, i) => (
            <ProductCard key={l.id} listing={l} index={i} swatches priority headingLevel="h2" />
          ))}
        </ProductGrid>
        <p className="mt-12 text-center">
          <Link href="/couteaux" className="label inline-flex min-h-11 items-center">
            <span className="lu is-on">Toute la collection</span>
          </Link>
        </p>
      </section>
      <Commitments className="section-bottom" />
    </>
  );
}
