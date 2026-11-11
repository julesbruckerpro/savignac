'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/lib/cart-store';
import type { NavItem, SearchEntry } from '@/lib/nav';
import { CartDrawer } from './CartDrawer';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MegaNav } from './MegaNav';
import { MobileMenu } from './MobileMenu';
import { SearchPanel } from './SearchPanel';

function Loupe() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M11.2 11.2 16 16" />
    </svg>
  );
}

export function Header({ nav, search }: { nav: NavItem[]; search: SearchEntry[] }) {
  const t = useTranslations();
  const sentinel = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart((s) => (s.hydrated ? s.cart.totalQuantity : 0));
  const openCart = useCart((s) => s.openDrawer);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setCompact(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const actions = (withAccount: boolean) => (
    <div className="flex items-center">
      <button type="button" onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center" aria-label={t('nav.search')}>
        <Loupe />
      </button>
      {withAccount ? (
        <Link href="/compte" className="nav-link hidden min-h-11 items-center px-3 font-sans font-medium uppercase nav:flex">
          <span className="lu">{t('nav.account')}</span>
        </Link>
      ) : null}
      <button type="button" onClick={openCart} className="nav-link -mr-1 flex min-h-11 items-center whitespace-nowrap pl-3 pr-1 font-sans font-medium uppercase" aria-label={`${t('nav.cart')} : ${t('cart.count', { count })}`}>
        <span className="lu">
          {t('nav.cart')} ({count})
        </span>
      </button>
    </div>
  );
  const menuButton = (
    <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="menu-mobile" className="label -ml-2 flex min-h-11 items-center px-2 nav:hidden">
      {t('nav.menu')}
    </button>
  );

  return (
    <>
      <a href="#contenu" className="sr-only-focusable btn fixed left-4 top-4 z-[300]">
        <span>{t('nav.skip')}</span>
      </a>

      <header className="relative z-40 bg-bg text-fg">
        <div className="border-b border-rule">
          <div className="wrap flex h-9 items-center justify-between gap-4">
            <p className="label-sm truncate text-soft">
              {t('topbar.shipping')}
              <span className="hidden sm:inline"> · {t('topbar.secure')}</span>
            </p>
            <LocaleSwitcher className="flex-none" />
          </div>
        </div>

        <div className="wrap">
          <div className="label-sm flex items-center justify-between gap-4 pb-3 pt-4 text-soft md:grid md:grid-cols-3">
            <span>{t('masthead.place')}</span>
            <span className="hidden text-center md:block">{t('masthead.since')}</span>
            <span className="text-right">{t('masthead.address')}</span>
          </div>
          <span className="filet filet-masthead" />
          <Link href="/" aria-label={t('masthead.home')} className="mx-auto block w-[84vw] max-w-[500px] py-6 md:py-8">
            <Logo priority />
          </Link>
        </div>

        <div className="relative">
          <div className="wrap">
            <div className="flex items-center justify-between gap-6 border-y border-rule-strong">
              {menuButton}
              <div className="hidden min-w-0 flex-1 nav:block">
                <MegaNav nav={nav} />
              </div>
              {actions(true)}
            </div>
          </div>
        </div>
        <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      </header>

      {/* en-tête compact, au défilement */}
      <div
        inert={!compact}
        className={`nav-compact fixed inset-x-0 top-0 z-50 border-b border-rule-strong bg-bg text-fg transition-transform duration-300 ease-house ${compact ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="wrap flex h-14 items-center justify-between gap-5 nav:h-16">
          {menuButton}
          <Link href="/" aria-label={t('masthead.home')} className="block w-[150px] flex-none nav:w-[180px]">
            <Logo />
          </Link>
          <div className="hidden nav:block">
            <MegaNav nav={nav} compact />
          </div>
          {actions(false)}
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={nav} cartCount={count} onCart={openCart} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} entries={search} />
      <CartDrawer />
    </>
  );
}
