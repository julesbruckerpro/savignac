import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { care } from '@/content/pages/guides';
import { Link } from '@/i18n/navigation';
import { AccordionPage } from '@/lib/simple-pages';

export const metadata: Metadata = { title: 'Conseils et entretien', description: 'Entretenir la lame, nourrir un manche en corne ou en bois, resserrer un couteau à friction, affûter sur pierre : les conseils de la Coutellerie Savignac.' };

export default async function CarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AccordionPage crumbs={[{ label: 'Conseils et entretien' }]} title={care.title} intro={care.intro} items={care.items}>
      <aside className="border-y border-rule-strong py-8">
        <p className="label text-mute">À l’atelier</p>
        <p className="lyric mt-4 !text-[22px] md:!text-[24px]">{care.service}</p>
        <Link href="/produit/prestation-atelier" className="btn mt-7">
          <span>Prestation atelier</span>
        </Link>
      </aside>
      <ul className="label mt-8 space-y-1">
        <li>
          <Link href="/couteaux/accessoires#pierres" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Pierres à aiguiser</span>
          </Link>
        </li>
        <li>
          <Link href="/couteaux/accessoires#fourreaux-etuis" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Fourreaux et étuis</span>
          </Link>
        </li>
      </ul>
    </AccordionPage>
  );
}
