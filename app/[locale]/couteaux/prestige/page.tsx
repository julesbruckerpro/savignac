import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { PrestigeBuy } from '@/components/product/PrestigeBuy';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MECHANISM_LABELS } from '@/content/materials';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';
import { finishLabel } from '@/lib/configurator';

export const metadata: Metadata = {
  title: 'Couteaux de prestige',
  description: 'Pièces de prestige de la Coutellerie Savignac : lames damas, bois de fer d’Arizona, loupes, ébène royal, corne. Façonnées une à une à Foix.',
  alternates: { canonical: '/couteaux/prestige' },
};

/** Seule page entièrement noire du site : noire dès le haut, sans dégradé. */
export default async function PrestigePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = (await commerce.getCollection('prestige', locale))!;
  const pieces = await commerce.getPrestigePieces(locale);
  const products = await commerce.getAllProducts(locale);

  return (
    <div data-page-theme="dark" className="bg-bg text-fg">
      <Breadcrumb items={[{ label: 'Prestige' }]} />
      <header className="wrap pb-16 pt-12 md:pb-24 md:pt-20">
        <p className="label text-mute">Prestige</p>
        <h1 className="title rise mt-5 max-w-[16ch]">Des pièces montées une à une.</h1>
        <p className="text rise mt-6" style={{ ['--d' as string]: '0.15s' }}>
          {data.collection.intro}
        </p>
        <p className="label mt-8 text-mute">{pieces.length} pièces</p>
      </header>

      {pieces.map((piece, i) => {
        const product = products.find((p) => p.handle === piece.product.handle)!;
        const finishes = Object.fromEntries(piece.variants.map((v) => [v.sku, finishLabel(product, v)]));
        const image = piece.variants[0].images.troisQuarts;
        return (
          <section key={piece.id} className="wrap" aria-labelledby={`piece-${piece.id}`}>
            <div className="grid min-h-[min(820px,92vh)] grid-cols-1 content-center items-center gap-x-8 gap-y-10 border-t border-rule py-16 lg:grid-cols-12">
              <Link href={piece.href} data-cursor="voir" className="block border border-paper bg-white lg:col-span-8" data-reveal aria-label={`${piece.product.name} : voir la fiche`}>
                <span className="relative block aspect-[3.4/1] w-full">{image ? <Image src={image} alt={`${piece.product.name}, ${Object.values(finishes)[0].toLowerCase()}`} fill sizes="(min-width: 1024px) 840px, 100vw" priority={i === 0} /> : null}</span>
              </Link>
              <div className="lg:col-span-4" data-reveal style={{ ['--d' as string]: '80ms' }}>
                <p className="label text-mute">
                  {String(i + 1).padStart(2, '0')} · {piece.mechanism ? MECHANISM_LABELS[piece.mechanism] : MECHANISM_LABELS[product.mechanisms[0]]}
                </p>
                <h2 id={`piece-${piece.id}`} className="name-card mt-4 !text-[28px] md:!text-[34px]">
                  {piece.product.name}
                </h2>
                <div className="mt-4">
                  <PrestigeBuy name={piece.product.name} productHandle={piece.product.handle} href={piece.href} variants={piece.variants} finishes={finishes} mancheLabels={piece.mancheLabels} />
                </div>
                <Link href="/contact?objet=sur-mesure" className="label mt-6 inline-flex min-h-11 items-center text-soft">
                  <span className="lu is-on">Une pièce sur mesure ? Nous écrire</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })}
      <div className="h-[var(--section)]" />
    </div>
  );
}
