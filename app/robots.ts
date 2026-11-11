import type { MetadataRoute } from 'next';

/** Démonstration : rien n'est indexé (section 14). Au lancement : autoriser et référencer le sitemap. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
