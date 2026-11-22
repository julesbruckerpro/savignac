import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CollectionPage } from '@/lib/collection-page';

export const metadata: Metadata = { title: 'Toute la collection', description: 'Toute la collection de la Coutellerie Savignac : pliants, couteaux de table et de cuisine, lames fixes, fabriqués à Foix.' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CollectionPage handle="tous" locale={locale} crumbs={[{ label: 'Toute la collection' }]} />;
}
