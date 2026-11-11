import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Price } from '@/components/ui/Price';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { curated } from '@/content/collections';
import { MECHANISM_LABELS } from '@/content/materials';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';
import { rich } from '@/lib/typo';

export const metadata: Metadata = { title: 'Notre gamme', description: 'Le Grat, L’Ariégeois, Le Cathare, Le Roques, Le Montagnol, Le Phasme, Le Capi : chaque modèle de la Coutellerie Savignac, son mécanisme et son histoire.' };

export default async function RangePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listings = await commerce.getListings(locale);
  const products = await commerce.getAllProducts(locale);
  const models = curated.gamme.map((id) => listings.find((l) => l.id === id)!).filter(Boolean);
  const families = [
    { title: 'Art de la table', text: 'Inspirés de nos modèles historiques ou des formes de la nature. Lame inox 14C28 qui résiste à l’humidité ; manche de bois, de corne ou de Corian.', href: '/couteaux/table', image: listings.find((l) => l.id === 'l-ariegeois-de-table')?.image },
    { title: 'Cuisine', text: 'Le Grat passe en cuisine : l’office pour la précision, le chef pour tout le reste, le couteau à fromage pour finir.', href: '/couteaux/cuisine', image: listings.find((l) => l.id === 'grat-cuisine')?.image },
    { title: 'Lames fixes', text: 'Pour la chasse, le bushcraft, la randonnée : une lame fixe plus large, plus sûre en main.', href: '/couteaux/fixes', image: listings.find((l) => l.id === 'le-bosc')?.image },
  ];
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Notre gamme' }]} />
      <PageIntro label="La Maison" title="Notre gamme." text="Voici chaque modèle, son mécanisme et ce qui le distingue." />
      <section className="wrap section-bottom">
        {models.map((l) => {
          const product = products.find((p) => p.handle === l.productHandle)!;
          const story = product.stories[0];
          return (
            <article key={l.id} className="grid grid-cols-1 items-center gap-x-8 gap-y-6 border-t border-rule-strong py-12 lg:grid-cols-12" data-reveal>
              <Link href={l.href} data-cursor="voir" className="card block lg:col-span-5" tabIndex={-1} aria-hidden="true">
                <span className="relative block aspect-[3.4/1] w-full overflow-hidden">
                  <Image src={l.image} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="knife card-photo" />
                </span>
              </Link>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="label text-mute">{l.facets.mecanisme.map((m) => MECHANISM_LABELS[m]).join(' · ')}</p>
                <h2 className="name-card mt-3 !text-[26px]">{l.name}</h2>
                {story ? <p className="lyric mt-4 !text-[22px] md:!text-[26px]">{rich(story.title)}</p> : null}
                <p className="text mt-4">{rich(story?.paragraphs[0] ?? l.shortLine)}</p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2">
                  <Link href={l.href} className="label inline-flex min-h-11 items-center">
                    <span className="lu is-on">Voir {l.name}</span>
                  </Link>
                  <Price cents={l.fromPrice} from={l.fromPrice !== l.toPrice} className="text-soft" />
                </div>
              </div>
            </article>
          );
        })}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-rule-strong pt-12 md:grid-cols-3">
          {families.map((f) => (
            <Link key={f.href} href={f.href} className="card group block" data-reveal>
              <span className="relative block aspect-[3.4/1] w-full overflow-hidden">{f.image ? <Image src={f.image} alt="" fill sizes="400px" className="knife card-photo" /> : null}</span>
              <span className="h3 mt-6 block">
                <span className="lu lu-group">{f.title}</span>
              </span>
              <span className="text-s mt-2 block">{f.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
