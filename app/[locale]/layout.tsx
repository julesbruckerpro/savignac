import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { routing } from '@/i18n/routing';
import { commerce } from '@/lib/commerce';
import { caslon, jost } from '@/lib/fonts';
import { formatPriceShort } from '@/lib/format';
import { buildNav, type SearchEntry } from '@/lib/nav';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#fafaf8', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    title: { default: t('defaultTitle'), template: `%s · ${t('siteName')}` },
    description: t('defaultDescription'),
    // Démonstration board : non indexé (section 14). À retirer au lancement.
    robots: { index: false, follow: false },
    icons: { icon: '/images/logo/savignac-coeur-noir.svg' },
    openGraph: { siteName: t('siteName'), locale: locale === 'fr' ? 'fr_FR' : locale, type: 'website' },
  };
}

const PAGES: [string, string, string][] = [
  ['Histoire de la Maison', '/la-maison/histoire', 'histoire familles roques grat savignac montariol archives'],
  ['Les ateliers', '/la-maison/les-ateliers', 'atelier boutique peysales le 15 le 17'],
  ['Une production locale', '/la-maison/une-production-locale', 'partenaires bois corne aciers fabrication'],
  ['Notre gamme', '/la-maison/notre-gamme', 'modeles gamme'],
  ['Les brevets', '/la-maison/brevets', 'marques dessins deposes'],
  ['Visite virtuelle', '/la-maison/visite-virtuelle', 'visite boutique atelier'],
  ['Nos revendeurs', '/revendeurs', 'revendeurs carte magasins toulouse paris bordeaux points de vente'],
  ['Conseils et entretien', '/conseils-entretien', 'entretien affuter affutage pierre huile resserrer'],
  ['Guide des aciers', '/guide-des-aciers', 'acier inox carbone damas 14c28 xc75 rwl34'],
  ['Friction ou système', '/friction-ou-systeme', 'friction systeme cran plat deux clous mecanisme'],
  ['Idées cadeaux', '/idees-cadeaux', 'cadeau offrir budget'],
  ['Livraison et retours', '/livraison-retours', 'livraison retours colissimo frais de port delais'],
  ['Presse', '/presse', 'presse articles depeche'],
  ['Contact', '/contact', 'contact telephone adresse courriel sur mesure'],
];

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('nav');
  const [listings, products] = await Promise.all([commerce.getListings(locale), commerce.getAllProducts(locale)]);
  const nav = buildNav(listings, products, (k, v) => t(k, v));
  const search: SearchEntry[] = [
    ...listings.map((l) => ({
      label: l.name,
      sub: l.fromPrice === l.toPrice ? formatPriceShort(l.fromPrice) : `dès ${formatPriceShort(l.fromPrice)}`,
      href: l.href,
      kind: 'models' as const,
      keywords: `${l.kicker} ${l.shortLine} ${l.swatches.map((s) => s.label).join(' ')} ${l.facets.acier.join(' ')} ${l.category}`,
    })),
    ...PAGES.map(([label, href, keywords]) => ({ label, href, kind: 'pages' as const, keywords })),
  ];

  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'Store'],
    name: site.name,
    url: site.url,
    telephone: site.phoneIntl,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.social),
  };

  return (
    <html lang={locale} className={`${caslon.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Header nav={nav} search={search} />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <SmoothScroll />
          <RevealObserver />
          <CustomCursor />
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
