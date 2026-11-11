import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import doc from '@/content/legal/confidentialite.json';
import { LegalPage } from '@/lib/simple-pages';

export const metadata: Metadata = { title: 'Politique de protection de la vie privée' };

/** Texte intégral repris du site actuel (scripts/parse-content.ts) : le fond juridique n'est pas réécrit. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={doc} crumb="Confidentialité" />;
}
