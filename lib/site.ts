export const site = {
  name: 'Coutellerie Savignac',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  address: { street: '15 rue des Marchands', postalCode: '09000', city: 'Foix', region: 'Ariège', country: 'FR' },
  phone: '05 61 02 90 70',
  phoneIntl: '+33561029070',
  email: 'coutellerie@savignac.boutique',
  social: {
    instagram: 'https://www.instagram.com/coutellerie_savignac/',
    facebook: 'https://www.facebook.com/savignaccoutellerie',
    pinterest: 'https://fr.pinterest.com/Savignac09/',
  },
  sisterSite: 'https://www.peigne-savignac.com',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Coutellerie+Savignac+15+rue+des+Marchands+09000+Foix',
  freeShippingFromCents: 10000,
  shippingCents: 900,
  engravingCents: 1200,
  chiselCents: 400,
} as const;

export const flags = {
  showPlaceholders: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === 'true',
  historyEntry: (['A', 'B', 'C', 'D', 'E'].includes(process.env.NEXT_PUBLIC_HISTORY_ENTRY ?? '')
    ? process.env.NEXT_PUBLIC_HISTORY_ENTRY
    : 'A') as 'A' | 'B' | 'C' | 'D' | 'E',
  currencySwitch: process.env.NEXT_PUBLIC_CURRENCY_SWITCH === 'true',
  chfRate: Number(process.env.NEXT_PUBLIC_CHF_RATE ?? '0.95'),
  showLeadTimes: process.env.NEXT_PUBLIC_SHOW_LEAD_TIMES === 'true',
} as const;
