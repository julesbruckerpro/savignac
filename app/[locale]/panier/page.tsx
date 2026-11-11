import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CartView } from '@/components/product/CartView';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = { title: 'Panier' };

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Panier' }]} />
      <CartView />
    </>
  );
}
