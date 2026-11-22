/**
 * Mesure d'audience (Google Analytics 4), désactivée tant que NEXT_PUBLIC_GA_ID est vide.
 * Rien n'est chargé ni déposé avant l'accord du visiteur (bandeau de consentement).
 * Événements recommandés GA4 : view_item, add_to_cart, view_cart, begin_checkout ; plus select_finish (choix de finition).
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const CONSENT_KEY = 'savignac-mesure';

type Gtag = (...args: unknown[]) => void;

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price: number; // en euros
  quantity?: number;
}

export function readConsent(): 'oui' | 'non' | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'oui' || v === 'non' ? v : null;
  } catch {
    return null;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (!GA_ID || typeof window === 'undefined' || readConsent() !== 'oui') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', event, params);
}

export function trackItem(event: 'view_item' | 'add_to_cart' | 'select_finish', item: AnalyticsItem, extra: Record<string, unknown> = {}) {
  track(event, { currency: 'EUR', value: item.price * (item.quantity ?? 1), items: [item], ...extra });
}
