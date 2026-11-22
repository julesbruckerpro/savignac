'use client';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Drawer } from '@/components/ui/Drawer';

export interface GridItem {
  id: string;
  node: ReactNode;
  price: number;
  isNew: boolean;
  facets: { mecanisme: string[]; manche: string[]; acier: string[] };
}

type FacetKey = 'mecanisme' | 'manche' | 'acier' | 'prix';
type Sort = 'default' | 'priceAsc' | 'priceDesc' | 'newest';

const LABELS: Record<string, string> = {
  friction: 'Friction',
  'cran-plat': 'Cran plat',
  piemontais: 'Piémontais',
  'bois-locaux': 'Bois locaux',
  'bois-precieux': 'Bois précieux',
  corne: 'Corne',
  synthetique: 'Synthétique',
  'inox-14c28': 'Inox 14C28',
  'carbone-xc75': 'Carbone XC75',
  rwl34: 'RWL34',
  damas: 'Damas',
};
const ORDER: Record<Exclude<FacetKey, 'prix'>, string[]> = {
  mecanisme: ['friction', 'cran-plat', 'piemontais'],
  manche: ['bois-locaux', 'bois-precieux', 'corne', 'synthetique'],
  acier: ['inox-14c28', 'carbone-xc75', 'rwl34', 'damas'],
};
const PRICE = [
  { id: 'under80', test: (c: number) => c < 8000 },
  { id: 'mid', test: (c: number) => c >= 8000 && c <= 15000 },
  { id: 'over150', test: (c: number) => c > 15000 },
] as const;

/** Filtres en pills (en ligne sur desktop, dans un tiroir sur mobile) et tri de la grille. */
export function FilteredGrid({ items, facets: enabled = ['mecanisme', 'manche', 'acier', 'prix'] }: { items: GridItem[]; facets?: FacetKey[] }) {
  const t = useTranslations('filters');
  const tc = useTranslations('common');
  const [active, setActive] = useState<Record<FacetKey, string[]>>({ mecanisme: [], manche: [], acier: [], prix: [] });
  const [sort, setSort] = useState<Sort>('default');
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const out: { key: FacetKey; values: string[] }[] = [];
    for (const key of enabled) {
      const values = key === 'prix' ? PRICE.filter((p) => items.some((i) => p.test(i.price))).map((p) => p.id as string) : ORDER[key].filter((v) => items.some((i) => i.facets[key].includes(v)));
      if (values.length > 1) out.push({ key, values });
    }
    return out;
  }, [items, enabled]);

  const visible = useMemo(() => {
    const list = items.filter((i) =>
      (Object.keys(active) as FacetKey[]).every((key) => {
        const wanted = active[key];
        if (wanted.length === 0) return true;
        if (key === 'prix') return wanted.some((w) => PRICE.find((p) => p.id === w)!.test(i.price));
        return wanted.some((w) => i.facets[key].includes(w));
      }),
    );
    if (sort === 'priceAsc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  }, [items, active, sort]);

  const count = Object.values(active).reduce((n, v) => n + v.length, 0);
  const toggle = (key: FacetKey, value: string) => setActive((a) => ({ ...a, [key]: a[key].includes(value) ? a[key].filter((v) => v !== value) : [...a[key], value] }));
  const reset = () => setActive({ mecanisme: [], manche: [], acier: [], prix: [] });
  const text = (key: FacetKey, v: string) => (key === 'prix' ? t(v as 'under80') : LABELS[v] ?? v);

  const controls = (stacked: boolean) => (
    <div className={stacked ? 'space-y-7 py-6' : 'flex flex-wrap items-start gap-x-10 gap-y-5'}>
      {groups.map(({ key, values }) => (
        <fieldset key={key} className="min-w-0">
          <legend className="label mb-3 text-mute">{t(key)}</legend>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <button key={v} type="button" className="pill" aria-pressed={active[key].includes(v)} onClick={() => toggle(key, v)}>
                {text(key, v)}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
  const sortSelect = (
    <label className="label flex items-center gap-3 text-mute">
      <span>{t('sort')}</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="label min-h-11 cursor-pointer border-0 border-b border-rule-strong bg-bg py-2 pr-6 text-fg">
        <option value="default">—</option>
        <option value="priceAsc">{t('priceAsc')}</option>
        <option value="priceDesc">{t('priceDesc')}</option>
        <option value="newest">{t('newest')}</option>
      </select>
    </label>
  );

  return (
    <div>
      {groups.length > 0 || items.length > 3 ? (
        <div className="border-y border-rule-strong">
          <div className="hidden items-start justify-between gap-8 py-6 lg:flex">
            {controls(false)}
            <div className="flex flex-none items-center gap-6 pt-6">
              {count > 0 ? (
                <button type="button" onClick={reset} className="label min-h-11 text-mute">
                  <span className="lu is-on">{t('reset')}</span>
                </button>
              ) : null}
              {sortSelect}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 py-2 lg:hidden">
            {groups.length > 0 ? (
              <button type="button" onClick={() => setOpen(true)} className="label flex min-h-11 items-center">
                {t('title')}
                {count > 0 ? ` (${count})` : ''}
              </button>
            ) : (
              <span />
            )}
            {sortSelect}
          </div>
        </div>
      ) : null}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={t('title')}
        closeLabel={tc('close')}
        footer={
          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={reset} className="label min-h-11 text-ink-55">
              <span className="lu is-on">{t('reset')}</span>
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn">
              <span>
                {t('apply')} ({visible.length})
              </span>
            </button>
          </div>
        }
      >
        {controls(true)}
      </Drawer>

      <p className="sr-only" aria-live="polite">
        {tc('models', { count: visible.length })}
      </p>
      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="lyric">{t('none')}</p>
          <button type="button" onClick={reset} className="label mt-6 min-h-11">
            <span className="lu is-on">{t('reset')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <div key={i.id}>{i.node}</div>
          ))}
        </div>
      )}
    </div>
  );
}
