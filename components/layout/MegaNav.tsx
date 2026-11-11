'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { NavItem } from '@/lib/nav';

/** Navigation desktop et son méga-menu : ouverture au survol (120 ms), fermeture (250 ms), clavier complet. */
export function MegaNav({ nav, compact = false }: { nav: NavItem[]; compact?: boolean }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const [shownId, setShownId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const root = useRef<HTMLDivElement>(null);

  const schedule = useCallback((id: string | null, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpenId(id);
      if (id) setShownId(id);
    }, delay);
  }, []);
  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpenId(null);
  }, []);

  useEffect(() => close(), [pathname, close]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shown = nav.find((n) => n.id === shownId && n.columns);
  const isOpen = openId !== null && !!shown && shown.id === openId;

  return (
    <div
      ref={root}
      className="static"
      onMouseLeave={() => schedule(null, 250)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && openId) {
          e.stopPropagation();
          const trigger = root.current?.querySelector<HTMLElement>(`[data-nav="${openId}"]`);
          close();
          trigger?.focus();
        }
      }}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) close();
      }}
    >
      <nav aria-label={t('main')}>
        <ul className={`flex items-stretch ${compact ? 'gap-x-[clamp(8px,1vw,20px)]' : 'justify-between gap-x-3'}`}>
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            const hasMega = !!item.columns;
            return (
              <li key={item.id} className="flex" onMouseEnter={() => schedule(hasMega ? item.id : null, hasMega ? 120 : 250)}>
                <Link
                  href={item.href}
                  data-nav={item.id}
                  aria-current={active ? 'page' : undefined}
                  aria-haspopup={hasMega ? 'true' : undefined}
                  aria-expanded={hasMega ? openId === item.id : undefined}
                  onKeyDown={(e) => {
                    if (!hasMega) return;
                    if (e.key === ' ' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      window.clearTimeout(timer.current);
                      setOpenId(item.id);
                      setShownId(item.id);
                      window.setTimeout(() => root.current?.querySelector<HTMLElement>('[data-mega] a')?.focus(), 40);
                    }
                  }}
                  className={`nav-link flex items-center whitespace-nowrap font-sans font-medium uppercase ${compact ? 'h-16' : 'h-[52px]'}`}
                >
                  <span className={`lu ${active || openId === item.id ? 'is-on' : ''}`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        data-mega
        className={`absolute inset-x-0 top-full z-40 border-b border-rule-strong bg-bg transition-[opacity,visibility] duration-200 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } ${compact ? 'border-t border-t-rule' : ''}`}
        onMouseEnter={() => window.clearTimeout(timer.current)}
      >
        {shown ? (
          <div className="wrap grid grid-cols-12 gap-x-8 pb-12 pt-10" key={shown.id}>
            <div className={`${shown.feature ? 'col-span-7' : 'col-span-9'} grid gap-x-8`} style={{ gridTemplateColumns: `repeat(${shown.columns!.length}, minmax(0, 1fr))` }}>
              {shown.columns!.map((col, i) => (
                <div key={i}>
                  {col.title ? <p className="label mb-5 text-mute">{col.title}</p> : null}
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} className="group flex min-h-11 items-baseline gap-3 py-2 text-[18px] leading-tight">
                          <span className="lu lu-group">{l.label}</span>
                          {l.price ? <span className="price text-[14px] text-mute">{l.price}</span> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {shown.feature ? (
              <Link href={shown.feature.href} className="group col-span-5 block" data-cursor="voir">
                <span className="block overflow-hidden">
                  <Image src={shown.feature.image} alt={shown.feature.alt} width={800} height={235} sizes="480px" className="card-photo h-auto w-full" />
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="caption">{shown.feature.caption}</span>
                  <span className="label lu lu-group">{shown.feature.label}</span>
                </span>
              </Link>
            ) : (
              <div className="col-span-3 flex items-start justify-end">
                <Link href={shown.href} className="label flex min-h-11 items-center">
                  <span className="lu">{t('seeAll')}</span>
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
