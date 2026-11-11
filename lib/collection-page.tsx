import { getTranslations } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Commitments } from '@/components/layout/Commitments';
import { FilteredGrid } from '@/components/product/FilteredGrid';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb';
import { accessoryGroups } from '@/content/collections';
import { commerce } from '@/lib/commerce';
import { rich } from '@/lib/typo';

/** Gabarit des pages catégories (cahier 7.2) : fil d'Ariane, en-tête, filtres, grille, bloc éditorial. */
export async function CollectionPage({ handle, locale, crumbs }: { handle: string; locale: string; crumbs: Crumb[] }) {
  const t = await getTranslations('common');
  const data = await commerce.getCollection(handle, locale);
  if (!data) return null;
  const { collection, listings, products } = data;
  const isKnives = !['accessoires'].includes(handle);
  const finishes = listings.reduce((n, l) => n + l.variantCount, 0);
  const aside = isKnives ? `${t('models', { count: listings.length })} · ${t('finishes', { count: finishes })}` : t('products', { count: listings.length });

  return (
    <>
      <Breadcrumb items={crumbs} />
      <PageIntro title={`${collection.title}.`} text={collection.intro} aside={aside} h1Class="title is-46" />
      <section className="wrap section-bottom" id={handle === 'table' ? 'coffrets' : undefined}>
        {handle === 'accessoires' ? (
          accessoryGroups.map((g) => {
            const items = listings.filter((l) => products.find((p) => p.handle === l.productHandle)?.subcategory === g.id);
            if (!items.length) return null;
            return (
              <div key={g.id} id={g.id} className="scroll-mt-28 border-t border-rule-strong pb-16 pt-6">
                <h2 className="label">{g.title}</h2>
                <ProductGrid className="pt-10">
                  {items.map((l, i) => (
                    <ProductCard key={l.id} listing={l} index={i} headingLevel="h3" />
                  ))}
                </ProductGrid>
              </div>
            );
          })
        ) : (
          <FilteredGrid
            facets={handle === 'poche' || handle === 'tous' ? ['mecanisme', 'manche', 'acier', 'prix'] : handle === 'friction' || handle === 'systeme' ? ['manche', 'acier', 'prix'] : ['manche', 'prix']}
            items={listings.map((l, i) => ({
              id: l.id,
              price: l.fromPrice,
              isNew: !!l.isNew,
              facets: l.facets,
              node: <ProductCard listing={l} index={i} swatches priority={i < 3} headingLevel="h2" />,
            }))}
          />
        )}
      </section>
      {collection.editorial ? (
        <section className="wrap section-bottom">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 border-t border-rule-strong pt-12 lg:grid-cols-12">
            <h2 className="lyric lg:col-span-4">{rich(collection.editorial.title)}</h2>
            {collection.editorial.columns.map((c, i) => (
              <p key={i} className="text lg:col-span-4">
                {rich(c)}
              </p>
            ))}
          </div>
        </section>
      ) : null}
      <Commitments className="section-bottom" />
    </>
  );
}
