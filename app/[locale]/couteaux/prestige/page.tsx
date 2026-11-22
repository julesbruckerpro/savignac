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
      <header className="wrap pb-12 pt-12 md:pb-16 md:pt-20">
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
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-10 border-t border-rule py-16 lg:grid-cols-12 lg:py-24">
              <Link href={piece.href} className="block border border-paper bg-white lg:col-span-8" data-reveal aria-label={`${piece.product.name} : voir la fiche`}>
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
      <section className="wrap section" aria-labelledby="sur-mesure">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-10 border-t border-rule pt-16 lg:grid-cols-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-5">
            <Image src="/images/atelier/production-damas-en-cours.jpg" alt="Une lame damas en cours de fabrication à l’atelier" fill sizes="(min-width: 1024px) 520px, 100vw" className="bw object-cover" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="label text-mute">Sur mesure</p>
            <h2 id="sur-mesure" className="title mt-5 max-w-[16ch]">
              Une pièce unique, dessinée avec vous.
            </h2>
            <p className="text mt-6">
              Depuis 2015, l’atelier fabrique des couteaux sur mesure, à partir des dessins de ses clients. Les pièces sur mesure, comme les pièces de prestige, sont entièrement façonnées à l’atelier de Foix.
            </p>
            <p className="text mt-4">Décrivez-nous votre projet : le mécanisme, la lame, la matière du manche. L’atelier vous répond.</p>
            <Link href="/contact?objet=sur-mesure" className="btn mt-9">
              <span>Parler de votre projet</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
