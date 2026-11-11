import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { commerce } from '@/lib/commerce';
import { ProductPage, productMetadata } from '@/lib/product-page';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await commerce.getAllProducts('fr');
  return products.filter((p) => p.template === 'produit').map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await commerce.getProduct(slug, locale);
  return product ? productMetadata(product) : {};
}

export default async function ProduitPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await commerce.getProduct(slug, locale);
  if (!product || product.template !== 'produit') notFound();
  return <ProductPage product={product} locale={locale} />;
}
