/* eslint-disable @next/next/no-img-element */
/**
 * Logo complet : uniquement les fichiers fournis, sans effet.
 * Les deux versions sont rendues ; le thème (clair / noir) choisit laquelle s'affiche.
 * Remplacement du fichier vectoriel d'origine : substituer les deux SVG dans public/images/logo.
 */
export function Logo({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`logo block ${className}`}>
      <img
        src="/images/logo/savignac-logo-noir.svg"
        alt="Savignac"
        width={1633}
        height={154}
        className="logo-noir h-auto w-full"
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
      <img
        src="/images/logo/savignac-logo-blanc.svg"
        alt="Savignac"
        width={1633}
        height={154}
        className="logo-blanc h-auto w-full"
        decoding="async"
      />
    </span>
  );
}
