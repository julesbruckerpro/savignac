import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { shipping } from '@/content/pages/guides';
import { Link } from '@/i18n/navigation';
import { AccordionPage } from '@/lib/simple-pages';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Livraison et retours', description: 'Livraison en Colissimo suivi, offerte dès 100 € en France métropolitaine. Délais, frais de port et retours.' };

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AccordionPage crumbs={[{ label: 'Livraison et retours' }]} title={shipping.title} intro={shipping.intro} items={shipping.items}>
      <aside className="border-y border-rule-strong py-8">
        <p className="label text-mute">Une question</p>
        <p className="lyric mt-4 !text-[22px] md:!text-[24px]">{site.phone}</p>
        <p className="text-s mt-2">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
        </p>
        <Link href="/contact" className="btn btn-outline mt-7">
          <span>Nous écrire</span>
        </Link>
      </aside>
      <p className="caption mt-6">
        Le détail figure dans nos{' '}
        <Link href="/cgv" className="link">
          conditions générales de vente
        </Link>
        .
      </p>
    </AccordionPage>
  );
}
