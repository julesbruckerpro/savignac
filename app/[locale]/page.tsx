import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FamilyCard, HistoryBlack } from '@/components/editorial/HistoryBlack';
import { Photo } from '@/components/editorial/Photo';
import { Commitments } from '@/components/layout/Commitments';
import { ProductCard, ProductGrid } from '@/components/product/ProductCard';
import { Heart } from '@/components/ui/Heart';
import { Price } from '@/components/ui/Price';
import { curated } from '@/content/collections';
import dealersData from '@/content/dealers.json';
import { press } from '@/content/pages/guides';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';
import { formatPriceShort } from '@/lib/format';
import { rich } from '@/lib/typo';

/**
 * Accueil. Image d'ouverture : public/images/accueil/ouverture.jpg (provisoire, à remplacer par le visuel fourni).
 * Puis les quatre familles (appel, référence, système, prestige), la sélection, l'histoire, l'atelier,
 * la confiance et les points de vente.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');
  const all = await commerce.getListings(locale);
  const by = (id: string) => all.find((l) => l.id === id)!;
  const cards = await commerce.getListingsById(curated.home, locale);
  const friction = (await commerce.getCollection('friction', locale))!.listings;
  const systeme = (await commerce.getCollection('systeme', locale))!.listings;
  const pieces = await commerce.getPrestigePieces(locale);
  const prestigePrices = pieces.flatMap((p) => p.variants.map((v) => v.price));
  const min = (ls: { fromPrice: number }[]) => Math.min(...ls.map((l) => l.fromPrice));
  const dès = (cents: number) => tc('from', { price: formatPriceShort(cents) });
  const dealers = (dealersData as { kind: string }[]).filter((d) => d.kind === 'revendeur').length;
  const restaurants = (dealersData as { kind: string }[]).filter((d) => d.kind === 'partenaire').length;
  const quotes = press.articles.filter((a) => a.quote).slice(0, 3);

  const families = [
    { key: 'montagnol', title: by('le-montagnol').name, href: by('le-montagnol').href, image: by('le-montagnol').image, price: <Price cents={by('le-montagnol').fromPrice} />, alt: by('le-montagnol').imageAlt },
    { key: 'ariegeois', title: by('l-ariegeois').name, href: by('l-ariegeois').href, image: by('l-ariegeois').image, price: <Price cents={by('l-ariegeois').fromPrice} from />, alt: by('l-ariegeois').imageAlt },
    { key: 'systeme', title: t('families.systemeTitle'), href: '/couteaux/systeme', image: '/images/produits/site/87.jpg', price: <Price cents={min(systeme)} from />, alt: 'L’Ariégeois cran plat, manche en ébène royal' },
    {
      key: 'prestige',
      title: t('families.prestigeTitle'),
      href: '/couteaux/prestige',
      image: '/images/produits/site/110.jpg',
      price: <Price cents={Math.min(...prestigePrices)} to={Math.max(...prestigePrices)} />,
      alt: 'L’Ariégeois cran plat en bois de fer d’Arizona, lame damas',
    },
  ];

  return (
    <>
      {/* ① Ouverture : image pleine largeur, puis la promesse de la Maison */}
      <section aria-labelledby="ouverture">
        <div className="relative h-[62vh] min-h-[360px] w-full overflow-hidden md:h-[min(82vh,820px)]">
          <Image src="/images/accueil/ouverture.jpg" alt={t('opening.alt')} fill priority sizes="100vw" className="bw slow-zoom object-cover" />
        </div>
        <div className="wrap pb-[var(--section)] pt-14 text-center md:pt-20">
          <p className="label rise text-mute">{rich(t('opening.kicker'))}</p>
          <h1 id="ouverture" className="title rise mx-auto mt-6 max-w-[20ch]" style={{ ['--d' as string]: '0.15s' }}>
            {t('opening.title')}
          </h1>
          <p className="text rise mx-auto mt-6 max-w-[56ch]" style={{ ['--d' as string]: '0.3s' }}>
            {t('opening.text')}
          </p>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8" style={{ ['--d' as string]: '0.45s' }}>
            <Link href="/couteaux/poche" className="btn">
              <span>{t('opening.cta')}</span>
            </Link>
            <Link href="/la-maison/les-ateliers" className="label inline-flex min-h-11 items-center">
              <span className="lu is-on">{t('opening.cta2')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ② Les quatre familles : de 46 € aux pièces de prestige */}
      <section className="wrap" aria-labelledby="familles">
        <h2 id="familles" className="title is-46 border-b border-rule-strong pb-6">
          {t('families.title')}
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {families.map((f, i) => (
            <Link key={f.key} href={f.href} className="card group flex flex-col border-b border-rule pb-6" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <span className="relative block aspect-[3.4/1] w-full overflow-hidden">
                <span className="floor" aria-hidden="true" />
                <Image src={f.image} alt={f.alt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 46vw, 92vw" className="knife card-photo" />
              </span>
              <span className="label-sm mt-6 block text-mute">{t(`families.${f.key}Label`)}</span>
              <span className="name-card mt-2 block">{f.title}</span>
              <span className="mt-2 block text-[15px] leading-snug text-soft">{t(`families.${f.key}Text`)}</span>
              <span className="mt-auto flex items-baseline justify-between gap-4 pt-5">
                <span className="text-[17px]">{f.price}</span>
                <span className="label">
                  <span className="lu lu-group">{tc('discover')}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ③ Choisir son couteau */}
      <section className="wrap section-top">
        <div className="flex items-end justify-between gap-6 border-b border-rule-strong pb-6">
          <h2 className="title is-46">{t('choose.title')}</h2>
          <Link href="/couteaux" className="label mb-2 hidden min-h-11 items-center sm:flex">
            <span className="lu is-on">{t('choose.all')}</span>
          </Link>
        </div>
        <ProductGrid className="pt-12">
          {cards.map((l, i) => (
            <ProductCard key={l.id} listing={l} index={i} swatches />
          ))}
        </ProductGrid>
        <p className="mt-10 text-center sm:hidden">
          <Link href="/couteaux" className="label inline-flex min-h-11 items-center">
            <span className="lu is-on">{t('choose.all')}</span>
          </Link>
        </p>
      </section>

      {/* ④ Friction ou système */}
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
              <Link href={c.href} className="card block" tabIndex={-1} aria-hidden="true">
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

      {/* ⑤ Histoire : section noire */}
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

      {/* ⑥ L'atelier et la fabrication */}
      <section className="wrap section" aria-labelledby="atelier">
        <div className="grid grid-cols-1 items-end gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="label text-mute">{t('craft.label')}</p>
            <h2 id="atelier" className="title is-46 mt-5">
              {t('craft.title')}
            </h2>
            <p className="text mt-6">{t('craft.text')}</p>
            <Link href="/la-maison/les-ateliers" className="label mt-8 inline-flex min-h-11 items-center">
              <span className="lu is-on">{t('craft.cta')}</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-6 lg:col-span-7">
            {[
              ['/images/atelier/production-debit-bois.jpg', 'Le débit des bois', 'Le débit.'],
              ['/images/atelier/atelier-2.jpg', 'Le façonnage d’un manche au backstand', 'Le façonnage.'],
              ['/images/atelier/atelier-3.jpg', 'Le montage à l’établi', 'Le montage.'],
            ].map(([src, alt, cap]) => (
              <Photo key={src} src={src} alt={alt} caption={cap} ratio="4/5" sizes="(min-width: 1024px) 260px, 31vw" />
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ Ils nous font confiance */}
      <section className="wrap section-bottom" aria-labelledby="confiance">
        <div className="border-t border-rule-strong pt-12">
          <p className="label text-mute">{t('trust.label')}</p>
          <h2 id="confiance" className="title is-46 mt-5 max-w-[22ch]">
            {t('trust.title')}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {quotes.map((q) => (
              <figure key={q.date} className="border-t border-rule pt-6" data-reveal>
                <blockquote className="text-[20px] italic leading-snug">{q.quote}</blockquote>
                <figcaption className="label-sm mt-4 text-mute">
                  {q.media} · {q.date.slice(0, 4)}
                </figcaption>
              </figure>
            ))}
          </div>
          <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 border-y border-rule py-8 sm:grid-cols-2">
            <div className="flex items-baseline gap-4">
              <dt className="price text-[40px] leading-none">{dealers}</dt>
              <dd className="text-s">{t('trust.dealers')}</dd>
            </div>
            <div className="flex items-baseline gap-4">
              <dt className="price text-[40px] leading-none">{restaurants}</dt>
              <dd className="text-s">{t('trust.restaurants')}</dd>
            </div>
          </dl>
          <p className="mt-8">
            <Link href="/la-maison/ils-nous-font-confiance" className="label inline-flex min-h-11 items-center">
              <span className="lu is-on">{t('trust.cta')}</span>
            </Link>
          </p>
        </div>
      </section>

      {/* ⑧ Près de chez vous : revendeurs et boutique de Foix */}
      <section className="wrap section-bottom" aria-labelledby="pres-de-chez-vous">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="label text-mute">{t('find.label')}</p>
            <h2 id="pres-de-chez-vous" className="title is-46 mt-5">
              {t('find.title')}
            </h2>
            <p className="text mt-6">{t('find.text')}</p>
            <form action="/revendeurs" method="get" role="search" className="mt-8 flex items-end gap-4">
              <div className="min-w-0 flex-1">
                <label htmlFor="q-revendeur" className="label">
                  {t('find.placeholder')}
                </label>
                <input id="q-revendeur" name="q" type="search" autoComplete="off" className="field" placeholder="Toulouse, 75, Bruxelles…" />
              </div>
              <button type="submit" className="btn !px-6">
                <span>{t('find.submit')}</span>
              </button>
            </form>
            <div className="label mt-6 flex flex-wrap gap-x-8 gap-y-2">
              <Link href="/la-maison/visite-virtuelle" className="inline-flex min-h-11 items-center">
                <span className="lu is-on">{t('visit.tour')}</span>
              </Link>
            </div>
          </div>
          <Photo src="/images/boutique/boutique-15-angle.jpg" alt={t('visit.alt')} ratio="3/2" className="lg:col-span-6 lg:col-start-7" sizes="(min-width: 1024px) 620px, 100vw" />
        </div>
      </section>

      {/* ⑨ Engagements */}
      <Commitments className="section-bottom" />
    </>
  );
}
