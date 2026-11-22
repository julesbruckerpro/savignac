import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { TourEmbed } from '@/components/editorial/TourEmbed';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { virtualTours } from '@/content/pages/house';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Visite virtuelle', description: 'Poussez la porte de la boutique du 15 rue des Marchands et de l’atelier historique, à Foix.' };

export default async function TourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Visite virtuelle' }]} />
      <PageIntro label="La Maison" title="Poussez la porte." text="La boutique du 15 rue des Marchands et l’atelier historique, comme si vous y étiez." />
      {virtualTours.map((t) => (
        <section key={t.id} className="wrap section-bottom" aria-labelledby={`visite-${t.id}`}>
          <h2 id={`visite-${t.id}`} className="label border-b border-rule-strong pb-5">
            {t.title}
          </h2>
          <div className="pt-8">
            <TourEmbed title={t.title} cta={t.cta} poster={t.poster} alt={t.alt} embed={t.embed} />
          </div>
        </section>
      ))}
      <section className="wrap section-bottom text-center">
        <p className="lyric mx-auto max-w-[24ch]">
          {site.address.street}, {site.address.postalCode} {site.address.city}
        </p>
        <div className="label mt-8 flex flex-wrap justify-center gap-x-10 gap-y-2">
          <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Itinéraire</span>
          </a>
          <Link href="/contact" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Nous écrire</span>
          </Link>
        </div>
      </section>
    </>
  );
}
