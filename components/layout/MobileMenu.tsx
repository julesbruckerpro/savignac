'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useDialog } from '@/lib/use-dialog';
import type { NavItem } from '@/lib/nav';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from '@/components/ui/Logo';

/** Menu mobile : panneau plein écran blanc, rubriques en accordéon, liens 18 px Caslon. */
export function MobileMenu({ open, onClose, nav, cartCount, onCart }: { open: boolean; onClose: () => void; nav: NavItem[]; cartCount: number; onCart: () => void }) {
  const t = useTranslations('nav');
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);
  useDialog(open, onClose, ref);
  useEffect(() => {
    onClose();
    // fermeture à chaque changement de page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={ref}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label={t('menu')}
      inert={!open}
      data-lenis-prevent
      className={`theme-light fixed inset-0 z-[110] flex flex-col transition-[opacity,visibility] duration-300 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div className="flex h-14 flex-none items-center justify-between border-b border-ink px-4">
        <Link href="/" onClick={onClose} className="block w-[150px]" aria-label="Savignac">
          <Logo />
        </Link>
        <button type="button" onClick={onClose} className="label -mr-2 flex min-h-11 items-center px-2">
          <span className="lu is-on">{t('close')}</span>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
        <ul>
          {nav.map((item) => {
            const expanded = section === item.id;
            return (
              <li key={item.id} className="border-b border-line">
                {item.columns ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mm-${item.id}`}
                      onClick={() => setSection(expanded ? null : item.id)}
                      className="flex min-h-[58px] w-full items-center justify-between text-left"
                    >
                      <span className="label">{item.label}</span>
                      <span className="plus" aria-hidden="true" />
                    </button>
                    <div id={`mm-${item.id}`} className="acc-panel" data-open={expanded} inert={!expanded}>
                      <div>
                        <ul className="pb-5">
                          {item.columns.map((col, i) => (
                            <li key={i}>
                              {col.title ? <p className="label-sm pb-1 pt-3 text-ink-55">{col.title}</p> : null}
                              <ul>
                                {col.links.map((l) => (
                                  <li key={l.href + l.label}>
                                    <Link href={l.href} onClick={onClose} className="flex min-h-11 items-baseline justify-between gap-4 py-2 text-[18px] leading-tight">
                                      <span>{l.label}</span>
                                      {l.price ? <span className="price text-[14px] text-ink-55">{l.price}</span> : null}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                          <li>
                            <Link href={item.href} onClick={onClose} className="label flex min-h-11 items-center pt-2">
                              <span className="lu is-on">{t('seeAll')}</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={item.href} onClick={onClose} className="label flex min-h-[58px] items-center">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex h-14 flex-none items-center justify-between border-t border-ink px-4">
        <div className="flex items-center gap-6">
          <button type="button" className="label flex min-h-11 items-center" onClick={() => { onClose(); onCart(); }}>
            {t('cart')} ({cartCount})
          </button>
          <Link href="/compte" onClick={onClose} className="label flex min-h-11 items-center">
            {t('account')}
          </Link>
        </div>
        <LocaleSwitcher />
      </div>
    </div>
  );
}
