import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AccountDemo } from '@/components/layout/AccountDemo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = { title: 'Mon compte' };

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Mon compte' }]} />
      <AccountDemo />
    </>
  );
}
