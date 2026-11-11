import { getTranslations } from 'next-intl/server';

/** Les engagements du site actuel, et seulement eux (règle absolue n° 6). */
export async function Commitments({ className = '' }: { className?: string }) {
  const t = await getTranslations('commitments');
  const items = [t('local'), t('french'), t('delivery'), t('payment'), t('secure')];
  return (
    <section aria-label={t('title')} className={`wrap ${className}`}>
      <ul className="label grid grid-cols-1 gap-y-3 border-y border-rule-strong py-6 text-center sm:grid-cols-2 lg:grid-cols-5 lg:py-7">
        {items.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  );
}
