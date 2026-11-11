import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Photo } from '@/components/editorial/Photo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { localProduction as c } from '@/content/pages/house';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = { title: 'Une production locale', description: 'Bois d’Ariège, cuirs d’Aveyron, aciers de Thiers : les partenaires de la Coutellerie Savignac, matière par matière.' };

export default async function LocalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Une production locale' }]} />
      <PageIntro label="La Maison" title={c.title} text={c.text} wide />
      <section className="wrap section-bottom">
        <div className="border-t border-rule-strong" role="table" aria-label="Matières et partenaires">
          <div role="row" className="label hidden grid-cols-12 gap-x-8 border-b border-rule py-4 text-mute md:grid">
            <span role="columnheader" className="col-span-4">Matière</span>
            <span role="columnheader" className="col-span-5">Partenaire</span>
            <span role="columnheader" className="col-span-3">Lieu</span>
          </div>
          {c.partners.map((p) => (
            <div role="row" key={p.matter + p.partner} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-5 md:grid-cols-12" data-reveal>
              <span role="cell" className="text-[18px] leading-snug md:col-span-4">{p.matter}</span>
              <span role="cell" className="text-[16px] leading-snug text-soft md:col-span-5">{p.partner}</span>
              <span role="cell" className="text-[16px] italic leading-snug text-mute md:col-span-3">{p.place}</span>
            </div>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
          {c.notes.map((n) => (
            <div key={n.label} className="border-t border-rule-strong pt-6" data-reveal>
              <p className="label text-mute">{n.label}</p>
              <p className="lyric mt-4 !text-[22px] md:!text-[26px]">{n.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap section-bottom">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {c.photos.map((p) => (
            <Photo key={p.src} src={p.src} alt={p.alt} caption={p.caption} ratio="3/2" sizes="(min-width: 1024px) 400px, 46vw" />
          ))}
        </div>
        <div className="label mt-14 flex flex-wrap justify-center gap-x-10 gap-y-2">
          <Link href="/guide-des-aciers" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Guide des aciers</span>
          </Link>
          <Link href="/la-maison/les-ateliers" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Les ateliers</span>
          </Link>
        </div>
      </section>
    </>
  );
}
