import { site } from '@/lib/site';
import type { CartAdapter, CartLineInput } from './adapter';
import type { Cart, CartLine } from './types';

function totals(lines: CartLine[], id: string): Cart {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const totalQuantity = lines.reduce((s, l) => s + l.quantity, 0);
  const shipping = lines.length === 0 || subtotal >= site.freeShippingFromCents ? 0 : site.shippingCents;
  return { id, lines, subtotal, shipping, total: subtotal + shipping, totalQuantity };
}

/** Deux lignes sont identiques si la variante et tous les attributs (gravure…) le sont. */
function lineKey(l: CartLineInput): string {
  return `${l.sku}|${Object.entries(l.attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('|')}`;
}

export const localCart: CartAdapter = {
  createCart: () => totals([], 'demo'),
  addLine(cart, line, qty) {
    const key = lineKey(line);
    const existing = cart.lines.find((l) => l.id === key);
    const lines = existing
      ? cart.lines.map((l) => (l.id === key ? { ...l, quantity: l.quantity + qty } : l))
      : [...cart.lines, { ...line, id: key, quantity: qty }];
    return totals(lines, cart.id);
  },
  updateLine(cart, lineId, qty) {
    const lines = cart.lines.map((l) => (l.id === lineId ? { ...l, quantity: qty } : l)).filter((l) => l.quantity > 0);
    return totals(lines, cart.id);
  },
  removeLine(cart, lineId) {
    return totals(cart.lines.filter((l) => l.id !== lineId), cart.id);
  },
};
