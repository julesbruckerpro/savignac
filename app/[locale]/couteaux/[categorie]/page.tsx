import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { commerce } from '@/lib/commerce';
import { CollectionPage } from '@/lib/collection-page';

type Params = Promise<{ locale: string; categorie: string }>;
const HANDLES = ['poche', 'friction', 'systeme', 'table', 'cuisine', 'fixes', 'accessoires'];

export const dynamicParams = false;
export function generateStaticParams() {
  return HANDLES.map((categorie) => ({ categorie }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, categorie } = await params;
  const data = await commerce.getCollection(categorie, locale);
  return data ? { title: data.collection.seo.title, description: data.collection.seo.description, alternates: { canonical: `/couteaux/${categorie}` } } : {};
}

export default async function Page({ params }: { params: Params }) {
  const { locale, categorie } = await params;
  setRequestLocale(locale);
  if (!HANDLES.includes(categorie)) notFound();
  const data = await commerce.getCollection(categorie, locale);
  if (!data) notFound();
  const parent = categorie === 'friction' || categorie === 'systeme' ? [{ label: 'Couteaux de poche', href: '/couteaux/poche' }] : [];
  return <CollectionPage handle={categorie} locale={locale} crumbs={[...parent, { label: data.collection.title }]} />;
}
