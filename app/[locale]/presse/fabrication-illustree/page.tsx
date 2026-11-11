import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { press } from '@/content/pages/guides';
import { PressNav } from '@/lib/press-nav';

export const metadata: Metadata = { title: 'Fabrication illustrée', description: 'La bande dessinée « Fabrication du couteau de chasse », par la Coutellerie Savignac.' };

export default async function ComicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Presse', href: '/presse' }, { label: 'Fabrication illustrée' }]} />
      <PageIntro title="Fabrication illustrée." text="La fabrication d’un couteau de chasse, racontée en bande dessinée." />
      <PressNav current="/presse/fabrication-illustree" />
      <section className="wrap section-bottom pt-12">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 md:grid-cols-12">
          <a href={press.comic.url} target="_blank" rel="noopener noreferrer" data-cursor="voir" className="block border border-rule md:col-span-4" aria-label="Lire la bande dessinée">
            <span className="relative block aspect-[3/4] w-full bg-white">
              <Image src={press.comic.cover} alt="Couverture de la bande dessinée « Fabrication du couteau de chasse »" fill sizes="(min-width: 768px) 400px, 100vw" className="bw object-contain" />
            </span>
          </a>
          <div className="md:col-span-6 md:col-start-6">
            <p className="label text-mute">Bande dessinée</p>
            <h2 className="title is-46 mt-4">« {press.comic.title} »</h2>
            <a href={press.comic.url} target="_blank" rel="noopener noreferrer" className="btn mt-8">
              <span>Lire la bande dessinée</span>
            </a>
            <p className="caption mt-4">La lecture s’ouvre sur Calaméo.</p>
          </div>
        </div>
      </section>
    </>
  );
}
