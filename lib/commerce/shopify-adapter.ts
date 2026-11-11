/**
 * À écrire lors de la migration (cahier, section 15).
 *
 * Implémentera CommerceAdapter au-dessus de l'API Storefront de Shopify :
 *   - un modèle = un produit Shopify ; chaque variante de /content = une variante
 *     avec les options « Mécanisme », « Manche », « Lame » (ou « Format » pour la table) ;
 *   - Prestige = collection filtrée par l'étiquette « prestige » ;
 *   - gravure et ciselage = attributs de ligne (propriétés de ligne), prix portés par les
 *     produits « Gravure personnalisée sur lame » (12 €) et « Ciselage » (4 €) ;
 *   - pastilles = métachamp de valeur d'option ; récit et caractéristiques = métachamps produit.
 *
 * Les composants n'importent que `@/lib/commerce` : rien d'autre ne change.
 */
import type { CommerceAdapter } from './adapter';

export function createShopifyAdapter(): CommerceAdapter {
  throw new Error('shopify-adapter : à implémenter lors de la migration (section 15 du cahier).');
}
