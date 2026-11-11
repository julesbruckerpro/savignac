import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { commerce } from '@/lib/commerce';
import { ProductPage, productMetadata } from '@/lib/product-page';

type Params = Promise<{ locale: string; modele: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await commerce.getAllProducts('fr');
  return products.filter((p) => p.template === 'modele').map((p) => ({ modele: p.handle }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, modele } = await params;
  const product = await commerce.getProduct(modele, locale);
  return product ? productMetadata(product) : {};
}

export default async function ModelePage({ params }: { params: Params }) {
  const { locale, modele } = await params;
  setRequestLocale(locale);
  const product = await commerce.getProduct(modele, locale);
  if (!product || product.template !== 'modele') notFound();
  return <ProductPage product={product} locale={locale} />;
}
