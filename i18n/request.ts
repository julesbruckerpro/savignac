import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import fr from '../messages/fr.json';

type Tree = { [key: string]: string | Tree };

/** Les valeurs « TODO » (non traduites, non relues) se replient sur le français. */
function withFallback(base: Tree, over: Tree | undefined): Tree {
  const out: Tree = {};
  for (const [k, v] of Object.entries(base)) {
    const o = over?.[k];
    if (typeof v === 'string') out[k] = typeof o === 'string' && o !== 'TODO' && o !== '' ? o : v;
    else out[k] = withFallback(v, typeof o === 'object' ? o : undefined);
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages =
    locale === 'fr' ? (fr as Tree) : withFallback(fr as Tree, (await import(`../messages/${locale}.json`)).default as Tree);
  return { locale, messages, timeZone: 'Europe/Paris' };
});
