/** Le cœur du logo, seul (séparateur, puce de section). Tracé du fichier fourni, jamais modifié. */
export function Heart({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        width: size,
        height: Math.round((size * 122) / 133.2),
        maskImage: 'url(/images/logo/savignac-coeur-noir.svg)',
        WebkitMaskImage: 'url(/images/logo/savignac-coeur-noir.svg)',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
