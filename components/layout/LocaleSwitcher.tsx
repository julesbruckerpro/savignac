'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

export function LocaleSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('topbar');
  const current = useLocale();
  const pathname = usePathname();
  return (
    <nav aria-label={t('language')} className={className}>
      <ul className="label-sm flex items-center">
        {locales.map((l, i) => (
          <li key={l} className="flex items-center">
            {i > 0 ? (
              <span aria-hidden="true" className="px-1 text-mute">
                ·
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={l}
              hrefLang={l}
              aria-current={l === current ? 'true' : undefined}
              className={`inline-flex min-h-9 min-w-7 items-center justify-center ${l === current ? 'text-fg' : 'text-mute hover:text-fg'}`}
            >
              <span className={`lu ${l === current ? 'is-on' : ''}`} style={{ paddingBottom: 3 }}>
                {l.toUpperCase()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
