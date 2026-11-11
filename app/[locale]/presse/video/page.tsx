import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { VideoFilm } from '@/components/editorial/VideoFilm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PressNav } from '@/lib/press-nav';

export const metadata: Metadata = { title: 'Vidéo' };

export default async function VideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Presse', href: '/presse' }, { label: 'Vidéo' }]} />
      <PageIntro title="Vidéo." text="La vidéo de présentation de notre coutellerie." />
      <PressNav current="/presse/video" />
      <section className="wrap section-bottom pt-12">
        <VideoFilm src="/video/savignac-film.mp4" poster="/video/savignac-film-poster.jpg" />
      </section>
    </>
  );
}
