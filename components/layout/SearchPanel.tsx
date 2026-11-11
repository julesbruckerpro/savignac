'use client';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Drawer } from '@/components/ui/Drawer';
import type { SearchEntry } from '@/lib/nav';

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function SearchPanel({ open, onClose, entries }: { open: boolean; onClose: () => void; entries: SearchEntry[] }) {
  const t = useTranslations('search');
  const tc = useTranslations('common');
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = fold(query.trim());
    if (q.length < 2) return [];
    const words = q.split(/\s+/);
    return entries.filter((e) => words.every((w) => fold(`${e.label} ${e.sub ?? ''} ${e.keywords}`).includes(w))).slice(0, 14);
  }, [query, entries]);
  const groups = (['models', 'pages'] as const).map((k) => ({ k, items: results.filter((r) => r.kind === k) })).filter((g) => g.items.length);

  return (
    <Drawer open={open} onClose={onClose} title={t('title')} closeLabel={tc('close')} wide>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="pt-8">
        <label htmlFor="recherche" className="sr-only">
          {t('title')}
        </label>
        <input
          id="recherche"
          data-autofocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          autoComplete="off"
          className="field text-[20px]"
        />
      </form>
      <div aria-live="polite" className="pb-10 pt-6">
        {query.trim().length < 2 ? (
          <p className="caption">{t('hint')}</p>
        ) : results.length === 0 ? (
          <p className="caption">{t('empty', { query: query.trim() })}</p>
        ) : (
          groups.map((g) => (
            <div key={g.k} className="mb-8">
              <p className="label mb-2 text-mute">{t(g.k)}</p>
              <ul className="border-t border-rule-strong">
                {g.items.map((r) => (
                  <li key={r.href + r.label} className="border-b border-rule">
                    <Link href={r.href} onClick={onClose} className="group flex min-h-14 items-baseline justify-between gap-4 py-3">
                      <span className="text-[18px] leading-tight">
                        <span className="lu lu-group">{r.label}</span>
                      </span>
                      {r.sub ? <span className="price text-[14px] text-mute">{r.sub}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}
