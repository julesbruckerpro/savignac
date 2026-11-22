'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { CONSENT_KEY, GA_ID, readConsent } from '@/lib/analytics';

/**
 * Bandeau de consentement + chargement de GA4 après accord seulement.
 * Sans NEXT_PUBLIC_GA_ID : ne rend rien (aucun bandeau, aucun script).
 */
export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<'oui' | 'non' | null | 'inconnu'>('inconnu');

  useEffect(() => {
    if (!GA_ID) return;
    setConsent(readConsent());
    const reopen = () => setConsent(null);
    window.addEventListener('savignac:cookies', reopen);
    return () => window.removeEventListener('savignac:cookies', reopen);
  }, []);

  useEffect(() => {
    if (consent !== 'oui') return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    gtag?.('event', 'page_view', { page_path: pathname, page_location: window.location.href });
  }, [pathname, consent]);

  if (!GA_ID) return null;

  const choose = (v: 'oui' | 'non') => {
    try {
      window.localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* navigation privée : le choix vaut pour la visite */
    }
    setConsent(v);
  };

  return (
    <>
      {consent === 'oui' ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false,anonymize_ip:true});gtag('event','page_view');`}
          </Script>
        </>
      ) : null}
      {consent === null ? (
        <div role="region" aria-label="Mesure d’audience" className="theme-light fixed inset-x-0 bottom-0 z-[90] border-t border-ink">
          <div className="wrap flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <p className="text-[15px] leading-snug text-ink-70">
              Nous mesurons la fréquentation du site pour l’améliorer (Google Analytics). Rien n’est déposé sans votre accord.{' '}
              <Link href="/confidentialite" className="link">
                En savoir plus
              </Link>
            </p>
            <div className="flex flex-none gap-3">
              <button type="button" onClick={() => choose('non')} className="btn btn-outline !min-h-12 !px-6 !py-3">
                <span>Refuser</span>
              </button>
              <button type="button" onClick={() => choose('oui')} className="btn !min-h-12 !px-6 !py-3">
                <span>Accepter</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Lien de pied de page pour revenir sur son choix (affiché seulement si la mesure est active). */
export function CookieSettingsLink() {
  if (!GA_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event('savignac:cookies'))} className="inline-flex min-h-9 items-center">
      <span className="lu">Gérer les cookies</span>
    </button>
  );
}
