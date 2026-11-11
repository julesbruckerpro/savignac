import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { HistoryBlack } from '@/components/editorial/HistoryBlack';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Photo } from '@/components/editorial/Photo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Heart } from '@/components/ui/Heart';
import { history } from '@/content/pages/history';
import { Link } from '@/i18n/navigation';
import { rich } from '@/lib/typo';

export const metadata: Metadata = { title: 'Histoire de la Maison', description: 'Des Roques, maîtres couteliers fuxéens au XVIIIᵉ siècle, aux Montariol : l’histoire de la Coutellerie Savignac, reconstituée grâce aux archives de Foix.' };

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Histoire' }]} />
      <PageIntro label="Histoire" title={history.intro.title} text={history.intro.text} wide />

      <HistoryBlack
        entryImage={{
          src: '/images/archives/archive-facade-1920.jpg',
          alt: 'La façade de la coutellerie vers 1920',
          caption: 'La façade vers 1920. Auguste et Éléonore Savignac posent devant la vitrine ; sur les boiseries, le nom de Ferdinand Grat.',
        }}
      >
        <div className="wrap">
          <h2 className="sr-only">Chronologie</h2>
          <ol>
            {history.steps.map((s, i) => (
              <li key={s.date} className="grid min-h-[min(640px,80vh)] grid-cols-1 items-center gap-x-8 gap-y-8 border-t border-rule py-14 lg:grid-cols-12 lg:py-20">
                <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-2 lg:col-start-7' : ''}`} data-reveal>
                  <p className="name-xl !text-[40px] lg:!text-[64px]">{rich(s.date)}</p>
                  <h3 className="lyric mt-6 max-w-[22ch]">{rich(s.title)}</h3>
                  <p className="text mt-5">{rich(s.text)}</p>
                </div>
                <figure className={`lg:col-span-5 ${i % 2 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`} data-reveal style={{ ['--d' as string]: '80ms' }}>
                  <span className={`relative block w-full overflow-hidden ${'portrait' in s && s.portrait ? 'mx-auto aspect-[4/5] max-w-[360px]' : 'aspect-[3/2]'}`}>
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 520px, 100vw" className={`bw ${'contain' in s && s.contain ? 'bg-white object-contain' : 'object-cover'}`} />
                  </span>
                  <figcaption className="caption mt-3">{rich(s.caption)}</figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </HistoryBlack>

      <section className="wrap section">
        <div className="mx-auto max-w-[720px] text-center" data-reveal>
          <Heart size={48} />
          <h2 className="label mt-8 text-mute">Le cœur</h2>
          <p className="lyric mt-5">{history.heart}</p>
        </div>
      </section>

      <section className="wrap" aria-labelledby="familles">
        <h2 id="familles" className="label border-b border-rule-strong pb-5">
          Les quatre familles
        </h2>
        <ol className="grid grid-cols-2 gap-x-8 lg:grid-cols-4">
          {history.families.map((f, i) => (
            <li key={f.name} className="border-b border-rule py-8" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <p className="label text-mute">{rich(f.era)}</p>
              <p className="name-family mt-3 !text-[20px] md:!text-[24px]">{f.name}</p>
            </li>
          ))}
        </ol>
        <p className="text mt-10">{history.craft}</p>
      </section>

      <section className="wrap section" aria-labelledby="archives">
        <h2 id="archives" className="label border-b border-rule-strong pb-5">
          Archives
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {history.gallery.map((g, i) => (
            <Photo key={g.src + i} src={g.src} alt={g.alt} caption={g.caption} ratio="4/5" sizes="(min-width: 1024px) 300px, (min-width: 640px) 46vw, 92vw" />
          ))}
        </div>
      </section>

      <section className="wrap section-bottom text-center">
        <div className="border-t border-rule-strong pt-16">
          <h2 className="title is-46 mx-auto max-w-[18ch]">Le savoir-faire continue à l’établi.</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link href="/la-maison/les-ateliers" className="btn">
              <span>Voir les ateliers</span>
            </Link>
            <Link href="/couteaux" className="btn btn-outline">
              <span>Choisir son couteau</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
