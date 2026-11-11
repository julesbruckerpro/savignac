import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { VideoFilm } from '@/components/editorial/VideoFilm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { rich, typo } from '@/lib/typo';

export const metadata: Metadata = { title: 'La Maison', description: 'Une échoppe du vieux Foix, quatre familles, deux ateliers et le même métier depuis le XVIIIᵉ siècle.' };

const ENTRIES = [
  { title: 'Histoire', text: 'Quatre familles alliées, des Roques aux Montariol.', href: '/la-maison/histoire', image: '/images/archives/archive-facade-1920.jpg' },
  { title: 'Les ateliers', text: 'Le 15, le 17, Peysales et Savignac Maison.', href: '/la-maison/les-ateliers', image: '/images/atelier/atelier-17-etabli.jpg' },
  { title: 'Une production locale', text: 'Ce que nous ne faisons pas nous-mêmes, nous le faisons près d’ici.', href: '/la-maison/une-production-locale', image: '/images/atelier/production-debit-bois.jpg' },
  { title: 'Notre gamme', text: 'Chaque modèle, son mécanisme, son histoire.', href: '/la-maison/notre-gamme', image: '/images/atelier/atelier-5.jpg' },
  { title: 'Les brevets', text: 'Marques et dessins déposés.', href: '/la-maison/brevets', image: '/images/archives/archive-acte.jpg' },
  { title: 'Visite virtuelle', text: 'Entrez dans la boutique et dans l’atelier.', href: '/la-maison/visite-virtuelle', image: '/images/boutique/boutique-15-interieur.jpg' },
];

export default async function HousePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison' }]} />
      <PageIntro title="La Maison." text="Une échoppe du vieux Foix, quatre familles, deux ateliers et le même métier depuis le XVIIIᵉ siècle." />
      <section id="film" className="wrap scroll-mt-24" aria-label="Le film">
        <VideoFilm src="/video/savignac-film.mp4" poster="/video/savignac-film-poster.jpg" />
        <p className="caption mt-3">Le film de présentation de la coutellerie.</p>
      </section>
      <section className="wrap section">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 border-t border-rule-strong pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.map((e, i) => (
            <Link key={e.href} href={e.href} className="group block" data-reveal style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
              <span className="relative block aspect-[3/2] w-full overflow-hidden">
                <Image src={e.image} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw" className="bw object-cover" />
              </span>
              <span className="h3 mt-6 block">
                <span className="lu lu-group">{e.title}</span>
              </span>
              <span className="text-s mt-2 block">{rich(typo(e.text))}</span>
            </Link>
          ))}
        </div>
        <div className="label mt-16 flex flex-wrap justify-center gap-x-10 gap-y-2">
          <Link href="/presse" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">La presse en parle</span>
          </Link>
          <Link href="/revendeurs" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Nos revendeurs</span>
          </Link>
        </div>
      </section>
    </>
  );
}
