import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Commitments } from '@/components/layout/Commitments';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { giftRows } from '@/content/gifts';
import { Link } from '@/i18n/navigation';
import { commerce, matches, productHref } from '@/lib/commerce';
import { finishLabel } from '@/lib/configurator';

export const metadata: Metadata = { title: 'Idées cadeaux', description: 'Offrir un couteau de Foix : nos sélections par budget, de 46 € aux pièces en damas. Gravure sur la lame, livraison offerte dès 100 € en France.' };

export default async function GiftsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await commerce.getAllProducts(locale);
  const listings = await commerce.getListings(locale);

  return (
    <>
      <Breadcrumb items={[{ label: 'Idées cadeaux' }]} />
      <PageIntro title="Offrir un couteau de Foix." text="Un objet qui dure, qui se transmet, qui garde la trace des mains." />
      {giftRows.map((row) => (
        <section key={row.title} className="wrap section-bottom">
          <h2 className="h3 border-b border-rule-strong pb-5">{row.title}</h2>
          <ProductGrid className="pt-10">
            {row.picks.map((pick, i) => {
              const product = products.find((p) => p.handle === pick.product);
              if (!product) return null;
              const candidates = listings.filter((l) => l.productHandle === product.handle);
              const listing = candidates.find((l) => !l.preset?.mecanisme || l.preset.mecanisme === pick.options?.mecanisme) ?? candidates[0];
              if (pick.whole || !pick.options) return <ProductCard key={i} listing={listing} index={i} />;
              const variant = product.variants.filter((v) => matches(v, pick.options)).sort((a, b) => a.price - b.price)[0];
              if (!variant) return null;
              return (
                <ProductCard
                  key={i}
                  listing={listing}
                  index={i}
                  override={{
                    href: productHref(product, variant.options),
                    image: variant.images.troisQuarts,
                    imageAlt: `${listing.name}, ${finishLabel(product, variant).toLowerCase()}`,
                    price: variant.price,
                    label: finishLabel(product, variant),
                  }}
                />
              );
            })}
          </ProductGrid>
        </section>
      ))}
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-rule-strong pt-12 md:grid-cols-2">
          <div data-reveal>
            <p className="label text-mute">Gravure sur la lame</p>
            <p className="lyric mt-4 max-w-[22ch]">Faites graver un prénom, une date : + 12 €</p>
            <p className="text mt-4">La gravure se choisit sur la fiche de chaque couteau pliant, avec un aperçu sur la lame. Elle est réalisée à l’atelier de Foix.</p>
            <Link href="/modele/le-roques" className="label mt-6 inline-flex min-h-11 items-center">
              <span className="lu is-on">Composer un Roques</span>
            </Link>
          </div>
          <div data-reveal style={{ ['--d' as string]: '80ms' }}>
            <p className="label text-mute">Livraison</p>
            <p className="lyric mt-4 max-w-[22ch]">Offerte dès 100 € en France.</p>
            <p className="text mt-4">Colissimo suivi, remis contre signature. En France, le colis arrive généralement en 48 h environ.</p>
            <Link href="/livraison-retours" className="label mt-6 inline-flex min-h-11 items-center">
              <span className="lu is-on">Livraison et retours</span>
            </Link>
          </div>
        </div>
      </section>
      <Commitments className="section-bottom" />
    </>
  );
}
