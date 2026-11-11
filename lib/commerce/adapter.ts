import type { Cart, CartLine, Collection, Listing, Product } from './types';

export type CartLineInput = Omit<CartLine, 'id' | 'quantity'>;

/**
 * Couche d'accès unique aux données de commerce.
 * Le prototype utilise local-adapter.ts (lecture de /content) ;
 * la migration branchera shopify-adapter.ts (API Storefront) sans toucher aux composants.
 */
export interface CommerceAdapter {
  getProduct(handle: string, locale: string): Promise<Product | null>;
  getAllProducts(locale: string): Promise<Product[]>;
  getCollection(
    handle: string,
    locale: string,
  ): Promise<{ collection: Collection; title: string; products: Product[]; listings: Listing[] } | null>;
  getListings(locale: string): Promise<Listing[]>;
}

/**
 * Panier. Côté prototype, il vit dans le navigateur (lib/cart-store.ts) ;
 * côté Shopify, ces opérations deviendront les mutations cartCreate / cartLinesAdd…
 * La gravure et le ciselage voyagent en attributs de ligne.
 */
export interface CartAdapter {
  createCart(): Cart;
  addLine(cart: Cart, line: CartLineInput, qty: number): Cart;
  updateLine(cart: Cart, lineId: string, qty: number): Cart;
  removeLine(cart: Cart, lineId: string): Cart;
}
