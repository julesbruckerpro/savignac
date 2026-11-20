import { Great_Vibes, Marcellus, Raleway, Roboto_Condensed } from 'next/font/google';

/**
 * Polices de l'aperçu de gravure uniquement (jamais dans l'interface).
 * Équivalents libres des 4 styles proposés sur le site actuel, chargés à la demande.
 */
const baton = Roboto_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap', preload: false });
const moderne = Raleway({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap', preload: false });
const manuscrit = Great_Vibes({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap', preload: false });
const batonModerne = Marcellus({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap', preload: false });

export interface EngraveStyle {
  id: string;
  label: string;
  className: string;
  /** Largeur moyenne d'un caractère, en em : sert à ajuster la taille au texte. */
  advance: number;
  upper?: boolean;
}

export const ENGRAVE_STYLES: EngraveStyle[] = [
  { id: 'baton', label: 'Bâton', className: baton.className, advance: 0.5, upper: true },
  { id: 'moderne', label: 'Moderne', className: moderne.className, advance: 0.56 },
  { id: 'manuscrit', label: 'Manuscrit', className: manuscrit.className, advance: 0.46 },
  { id: 'baton-moderne', label: 'Bâton moderne', className: batonModerne.className, advance: 0.6, upper: true },
];
