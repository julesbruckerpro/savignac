import type { ReactNode } from 'react';
import { flags } from '@/lib/site';

/**
 * Emplacement « À FOURNIR ». En production il ne rend que le repli prévu par la page,
 * jamais de texte entre crochets.
 */
export function Placeholder({ label, fallback = null }: { label: string; fallback?: ReactNode }) {
  if (!flags.showPlaceholders) return <>{fallback}</>;
  return (
    <span data-placeholder className="label-sm inline-block border border-dashed border-mute px-2 py-1 text-mute">
      {`[À FOURNIR : ${label}]`}
    </span>
  );
}
