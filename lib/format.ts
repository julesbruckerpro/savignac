const NNBSP = ' '; // espace fine insécable

/** Prix de fiche et de panier : « 73,00 € ». */
export function formatPrice(cents: number, locale = 'fr'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
    .format(cents / 100)
    .replace(/ /g, NNBSP);
}

/** Prix de carte : « 73 € » (décimales seulement si nécessaires). */
export function formatPriceShort(cents: number, locale = 'fr'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(cents / 100)
    .replace(/ /g, NNBSP);
}

/** Prix indicatif en francs suisses (option désactivée par défaut). */
export function formatChf(cents: number, rate: number, locale = 'fr'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-CH' : locale, { style: 'currency', currency: 'CHF' }).format(
    (cents / 100) * rate,
  );
}

export function formatDateLong(iso: string, locale = 'fr'): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso + 'T00:00:00Z'));
}

/** Espaces fines insécables avant ; ? ! et insécable avant : » et après «. */
export function typo(s: string): string {
  return s
    .replace(/ ([;?!])/g, `${NNBSP}$1`)
    .replace(/ :/g, ' :')
    .replace(/« /g, '« ')
    .replace(/ »/g, ' »')
    .replace(/(\d) (€|%|h\b|g\b|cm\b|mm\b)/g, `$1${NNBSP}$2`);
}
