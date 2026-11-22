import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { press } from '@/content/pages/guides';
import { formatDateLong } from '@/lib/format';
import { PressNav } from '@/lib/press-nav';

export const metadata: Metadata = { title: 'La presse en parle', description: 'La Coutellerie Savignac dans la presse : La Dépêche du Midi, Ariège News.' };

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Presse' }]} />
      <PageIntro title={press.title} />
      <PressNav current="/presse" />
      <section className="wrap section-bottom pt-4">
        <ol>
          {press.articles.map((a) => (
            <li key={a.date} className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-rule py-10 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-3">
                <p className="label">{a.media}</p>
                <p className="caption mt-2">
                  <time dateTime={a.date}>{formatDateLong(a.date)}</time>
                  {'author' in a && a.author ? ` · ${a.author}` : ''}
                </p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="h3">{a.title}</h2>
                <p className="text mt-3">{a.summary}</p>
                {a.quote ? <p className="mt-4 text-[19px] italic leading-snug">{a.quote}</p> : null}
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="label mt-5 inline-flex min-h-11 items-center">
                    <span className="lu is-on">Lire l’article</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
