import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Photo } from '@/components/editorial/Photo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { workshops } from '@/content/pages/house';
import { Link } from '@/i18n/navigation';
import { rich } from '@/lib/typo';

export const metadata: Metadata = { title: 'L’atelier & la fabrication', description: 'La boutique du 15 rue des Marchands, l’atelier historique du 17, l’atelier de Peysales et Savignac Maison : les quatre adresses de la Coutellerie Savignac à Foix.' };

export default async function WorkshopsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'L’atelier & la fabrication' }]} />
      <PageIntro label="La Maison" title={workshops.intro.title} text={workshops.intro.text} />
      {workshops.chapters.map((c) => (
        <section key={c.id} id={c.id} className="wrap section-bottom scroll-mt-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 border-t border-rule-strong pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <p className="name-family">{c.label}</p>
              <h2 className="title is-46 mt-5">{c.title}</h2>
              <p className="text mt-6">{rich(c.text)}</p>
            </div>
            <div className={`grid gap-x-8 gap-y-10 lg:col-span-7 lg:col-start-6 ${c.photos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {c.photos.map((p) => (
                <Photo key={p.src} src={p.src} alt={p.alt} caption={p.caption} ratio={'wide' in p && p.wide ? '16/9' : '3/2'} sizes="(min-width: 1024px) 360px, 100vw" />
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="wrap section-bottom" aria-labelledby="etapes">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 border-t border-rule-strong pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-mute">Fabrication</p>
            <h2 id="etapes" className="title is-46 mt-5">
              {workshops.fabrication.title}
            </h2>
            <p className="text mt-6">{workshops.fabrication.text}</p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {workshops.fabrication.phases.map((ph, i) => (
              <li key={ph.title} className="grid grid-cols-[56px_1fr] gap-x-6 border-b border-rule py-6 first:border-t first:border-t-rule-strong" data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                <span className="price text-[28px] leading-none text-mute">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="name-card !text-[17px]">{ph.title}</h3>
                  <ul className="mt-3 space-y-1">
                    {ph.steps.map((st) => (
                      <li key={st} className="text-s">
                        {st}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          {workshops.fabrication.materials.map((m) => (
            <div key={m.title} className="border-t border-rule-strong pt-6" data-reveal>
              <h3 className="label">{m.title}</h3>
              <p className="text-s mt-4">{m.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap section-bottom" aria-labelledby="gestes">
        <h2 id="gestes" className="label border-b border-rule-strong pb-5">
          Les gestes
        </h2>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 lg:grid-cols-5">
          {workshops.gestures.map((g, i) => (
            <li key={g.src} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <Photo src={g.src} alt={g.alt} ratio="4/5" sizes="(min-width: 1024px) 240px, 46vw" reveal={false} />
              <p className="label-sm mt-4 text-mute">{String(i + 1).padStart(2, '0')}</p>
              <p className="mt-1 text-[16px] italic leading-snug">{g.caption}</p>
            </li>
          ))}
        </ol>
        <p className="mt-14 text-center">
          <Link href="/la-maison/visite-virtuelle" className="label inline-flex min-h-11 items-center">
            <span className="lu is-on">Visite virtuelle</span>
          </Link>
        </p>
      </section>
    </>
  );
}
