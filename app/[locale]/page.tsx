import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FamilyCard, HistoryBlack } from '@/components/editorial/HistoryBlack';
import { Photo } from '@/components/editorial/Photo';
import { Commitments } from '@/components/layout/Commitments';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { Heart } from '@/components/ui/Heart';
import { Price } from '@/components/ui/Price';
import { curated } from '@/content/collections';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';
import { formatPriceShort } from '@/lib/format';
import { rich } from '@/lib/typo';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');
  const all = await commerce.getListings(locale);
  const by = (id: string) => all.find((l) => l.id === id)!;
  const cards = await commerce.getListingsById(curated.home, locale);
  const roques = by('le-roques');
  const friction = (await commerce.getCollection('friction', locale))!.listings;
  const systeme = (await commerce.getCollection('systeme', locale))!.listings;
  const table = (await commerce.getCollection('table', locale))!.listings;
  const min = (ls: { fromPrice: number }[]) => Math.min(...ls.map((l) => l.fromPrice));
  const dès = (cents: number) => tc('from', { price: formatPriceShort(cents) });

  return (
    <>
      {/* ③ Ouverture : la pièce signature */}
      <section className="wrap pb-[var(--section)] pt-8 md:pt-14">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="label rise text-mute">{t('hero.kicker')}</p>
            <h1 className="name-xl rise mt-5" style={{ ['--d' as string]: '0.15s' }}>
              {t('hero.name')}
            </h1>
            <p className="lyric rise mt-6 max-w-[20ch]" style={{ ['--d' as string]: '0.35s' }}>
              {t('hero.lead')}
            </p>
            <p className="text rise mt-6 max-w-[46ch]" style={{ ['--d' as string]: '0.5s' }}>
              {rich(t('hero.text'))}
            </p>
            <div className="rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-5" style={{ ['--d' as string]: '0.65s' }}>
              <Link href={roques.href} className="btn">
                <span>{t('hero.cta')}</span>
              </Link>
              <Price cents={roques.fromPrice} to={roques.toPrice} className="text-[20px]" />
            </div>
          </div>
          <Link href={roques.href} data-cursor="voir" aria-label={t('hero.cta')} className="order-1 block overflow-hidden lg:order-2 lg:col-span-7">
            <span className="relative block aspect-[3.4/1] w-full lg:aspect-auto lg:h-[440px]">
              <Image src="/images/produits/roques-facettes.jpg" alt={t('hero.alt')} fill priority sizes="(min-width: 1024px) 740px, 100vw" className="knife slow-zoom" />
            </span>
          </Link>
        </div>
      </section>

      {/* ④ Choisir son couteau */}
      <section className="wrap">
        <div className="flex items-end justify-between gap-6 border-b border-rule-strong pb-6">
          <h2 className="title">{t('choose.title')}</h2>
          <Link href="/couteaux" className="label mb-2 hidden min-h-11 items-center sm:flex">
            <span className="lu is-on">{t('choose.all')}</span>
          </Link>
        </div>
        <ProductGrid className="pt-12">
          {cards.map((l, i) => (
            <ProductCard key={l.id} listing={l} index={i} />
          ))}
        </ProductGrid>
        <ul className="label mt-10 flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-4">
          {[
            { label: by('l-ariegeois-cran-plat').name, href: by('l-ariegeois-cran-plat').href, price: by('l-ariegeois-cran-plat').fromPrice },
            { label: by('le-capi').name, href: by('le-capi').href, price: by('le-capi').fromPrice },
            { label: t('choose.table'), href: '/couteaux/table', price: min(table) },
          ].map((l, i) => (
            <li key={l.href} className="flex items-center gap-x-4">
              {i > 0 ? (
                <span aria-hidden="true" className="hidden text-mute sm:inline">
                  ·
                </span>
              ) : null}
              <Link href={l.href} className="inline-flex min-h-11 items-center">
                <span className="lu">
                  {l.label} · {dès(l.price)}
                </span>
              </Link>
            </li>
          ))}
          <li className="sm:hidden">
            <Link href="/couteaux" className="inline-flex min-h-11 items-center">
              <span className="lu is-on">{t('choose.all')}</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ⑤ Friction ou système */}
      <section className="wrap section-top" aria-labelledby="mecanismes">
        <h2 id="mecanismes" className="sr-only">
          {t('mechanisms.title')}
        </h2>
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 border-t border-rule pt-[calc(var(--section)*0.6)] md:grid-cols-2">
          {[
            { k: 'friction', img: '/images/produits/ariegeois-corne-noire.jpg', href: '/couteaux/friction', price: min(friction) },
            { k: 'system', img: '/images/produits/couteau-systeme.jpg', href: '/couteaux/systeme', price: min(systeme) },
          ].map((c, i) => (
            <article key={c.k} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <Link href={c.href} data-cursor="voir" className="card block" tabIndex={-1} aria-hidden="true">
                <span className="relative block aspect-[3.4/1] w-full max-w-[408px] overflow-hidden">
                  <Image src={c.img} alt="" fill sizes="408px" className="knife card-photo" />
                </span>
              </Link>
              <p className="label mt-8 text-mute">{t(`mechanisms.${c.k}Label`)}</p>
              <h3 className="lyric mt-4">{t(`mechanisms.${c.k}Title`)}</h3>
              <p className="text mt-5 max-w-[52ch]">{t(`mechanisms.${c.k}Text`)}</p>
              <Link href={c.href} className="label mt-7 inline-flex min-h-11 items-center">
                <span className="lu is-on">
                  {t(`mechanisms.${c.k}Cta`)} · {dès(c.price)}
                </span>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/friction-ou-systeme" className="label inline-flex min-h-11 items-center text-mute">
            <span className="lu">{t('mechanisms.understand')}</span>
          </Link>
        </p>
      </section>

      {/* ⑥ Histoire : section noire */}
      <HistoryBlack
        entryImage={{ src: '/images/archives/archive-facade-1920.jpg', alt: t('history.alt'), caption: t('history.caption') }}
        exitImages={[
          { src: '/images/archives/archive-auguste-meule.jpg', alt: t('history.exitAlt1') },
          { src: '/images/atelier/atelier-1.jpg', alt: t('history.exitAlt2') },
        ]}
      >
        <div className="wrap">
          <div className="mx-auto max-w-[720px] text-center" data-reveal>
            <Heart size={28} />
            <h2 className="title mt-8">{t('history.title')}</h2>
            <p className="text mx-auto mt-6">{t('history.text')}</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            <FamilyCard name="Roques" era={t('history.roquesEra')} text={t('history.roquesText')} image="/images/archives/archive-acte.jpg" alt={t('history.roquesAlt')} index={0} />
            <FamilyCard name="Grat" era={t('history.gratEra')} text={t('history.gratText')} image="/images/archives/archive-ferdinand-grat.jpg" alt={t('history.gratAlt')} index={1} />
            <FamilyCard name="Savignac" era={t('history.savignacEra')} text={t('history.savignacText')} image="/images/archives/archive-vitrine-1920.jpg" alt={t('history.savignacAlt')} index={2} />
            <FamilyCard name="Montariol" era={t('history.montariolEra')} text={t('history.montariolText')} image="/images/atelier/atelier-1.jpg" alt={t('history.montariolAlt')} index={3} />
          </div>
          <p className="mt-14 text-center">
            <Link href="/la-maison/histoire" className="label inline-flex min-h-11 items-center">
              <span className="lu is-on">{t('history.cta')}</span>
            </Link>
          </p>
        </div>
      </HistoryBlack>

      {/* ⑦ Venir à Foix */}
      <section className="wrap section">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="label text-mute">{t('visit.label')}</p>
            <h2 className="title mt-5">{t('visit.title')}</h2>
            <p className="text mt-6">{t('visit.text')}</p>
            <div className="label mt-8 flex flex-wrap gap-x-8 gap-y-2">
              <Link href="/la-maison/visite-virtuelle" className="inline-flex min-h-11 items-center">
                <span className="lu is-on">{t('visit.tour')}</span>
              </Link>
              <Link href="/revendeurs" className="inline-flex min-h-11 items-center">
                <span className="lu is-on">{t('visit.dealers')}</span>
              </Link>
            </div>
          </div>
          <Photo src="/images/boutique/boutique-15-angle.jpg" alt={t('visit.alt')} ratio="3/2" className="lg:col-span-6 lg:col-start-7" sizes="(min-width: 1024px) 620px, 100vw" />
        </div>
      </section>

      {/* ⑧ Engagements */}
      <Commitments className="section-bottom" />
    </>
  );
}
