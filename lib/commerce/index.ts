/**
 * Point d'entrée unique de la couche commerce.
 * Migration Shopify : remplacer cet export par l'adaptateur de shopify-adapter.ts.
 */
export { commerce, productHref, matches } from './local-adapter';
export type { PrestigePiece } from './local-adapter';
export * from './types';
