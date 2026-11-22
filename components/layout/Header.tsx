'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/lib/cart-store';
import type { NavItem, SearchEntry } from '@/lib/nav';
import { CartDrawer } from './CartDrawer';
import { MegaNav } from './MegaNav';
import { MobileMenu } from './MobileMenu';
import { SearchPanel } from './SearchPanel';

function Loupe({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6.2" />
      <path d="M13.2 13.2 18.5 18.5" strokeLinecap="round" />
    </svg>
  );
}
function Person() {
  return (
    <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="11" cy="7" r="4.2" />
      <path d="M3 20.5c.8-4.3 4.1-6.7 8-6.7s7.2 2.4 8 6.7" strokeLinecap="round" />
    </svg>
  );
}
function Bag() {
  return (
    <svg width="20" height="21" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2.5 6.5h15l-1 14h-13z" strokeLinejoin="round" />
      <path d="M6.5 8.5V5a3.5 3.5 0 0 1 7 0v3.5" strokeLinecap="round" />
    </svg>
  );
}

/** Marque : le logo inchangé, et « COUTELLERIE » composé en Jost dessous (maquette d'accueil). */
function Brand({ size = 'lg', priority = false }: { size?: 'lg' | 'sm'; priority?: boolean }) {
  return (
    <span className="block text-center">
      <Logo priority={priority} className={size === 'lg' ? 'mx-auto w-[min(44vw,330px)]' : 'mx-auto w-[150px] nav:w-[170px]'} />
      <span className={`brand-sub block ${size === 'lg' ? 'mt-[0.55em] text-[clamp(13px,1.45vw,23px)]' : 'mt-[5px] text-[9px]'}`}>Coutellerie</span>
    </span>
  );
}

export function Header({ nav, search }: { nav: NavItem[]; search: SearchEntry[] }) {
  const t = useTranslations();
  const pathname = usePathname();
  const overlay = pathname === '/';
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
  }, [overlay]);

  const icons = (
    <div className="flex items-center gap-1 md:gap-3">
      <button type="button" onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center md:hidden" aria-label={t('nav.search')}>
        <Loupe />
      </button>
      <Link href="/compte" className="hidden h-11 w-11 place-items-center md:grid" aria-label={t('nav.account')}>
        <Person />
      </Link>
      <button type="button" onClick={openCart} className="relative grid h-11 w-11 place-items-center" aria-label={`${t('nav.cart')} : ${t('cart.count', { count })}`}>
        <Bag />
        {count > 0 ? (
          <span className="absolute right-[3px] top-[5px] grid h-[17px] min-w-[17px] place-items-center !rounded-full bg-fg px-[4px] font-sans text-[10px] font-medium leading-none text-bg" aria-hidden="true">
            {count}
          </span>
        ) : null}
      </button>
    </div>
  );
  const menuButton = (
    <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="menu-mobile" className="label -ml-2 flex min-h-11 items-center px-2 nav:hidden">
      {t('nav.menu')}
    </button>
  );
  const searchField = (
    <button type="button" onClick={() => setSearchOpen(true)} className="group hidden min-h-11 w-[min(100%,270px)] items-end gap-3 md:flex" aria-label={t('nav.search')}>
      <span className="pb-[7px]">
        <Loupe />
      </span>
      <span className="flex-1 border-b border-current pb-[6px] text-left font-sans text-[15px] font-normal tracking-[0.02em] opacity-60 transition-opacity group-hover:opacity-90">
        {t('search.field')}
      </span>
    </button>
  );

  return (
    <>
      <a href="#contenu" className="sr-only-focusable btn fixed left-4 top-4 z-[300]">
        <span>{t('nav.skip')}</span>
      </a>

      {/* bandeau de livraison : en bas de l'image d'ouverture sur l'accueil, en haut des autres pages */}
      {overlay ? null : (
        <div className="ship-band">
          <p>{t('topbar.band')}</p>
        </div>
      )}

      <header className={`${overlay ? 'on-image absolute inset-x-0 top-0' : 'relative border-b border-rule bg-bg'} z-40 text-fg`}>
        <div className="px-[var(--gutter)] md:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pb-3 pt-5 md:gap-4 md:pb-5 md:pt-7">
            <div className="flex items-center">
              {menuButton}
              {searchField}
            </div>
            <Link href="/" aria-label={t('masthead.home')} className="block">
              <Brand priority />
            </Link>
            <div className="flex justify-end">{icons}</div>
          </div>
        </div>
        <div className="relative hidden nav:block">
          <div className="flex justify-center pb-4 pt-3">
            <MegaNav nav={nav} />
          </div>
        </div>
        <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      </header>

      {/* en-tête compact, au défilement */}
      <div
        inert={!compact}
        className={`nav-compact fixed inset-x-0 top-0 z-50 border-b border-rule-strong bg-bg text-fg transition-transform duration-300 ease-house ${compact ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex h-16 items-center justify-between gap-5 px-[var(--gutter)] md:px-8">
          <div className="flex items-center nav:w-[200px]">
            {menuButton}
            <Link href="/" aria-label={t('masthead.home')} className="hidden flex-none nav:block">
              <Brand size="sm" />
            </Link>
          </div>
          <Link href="/" aria-label={t('masthead.home')} className="block flex-none nav:hidden">
            <Brand size="sm" />
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center nav:flex">
            <MegaNav nav={nav} compact />
          </div>
          <div className="flex items-center justify-end nav:w-[200px]">
            <button type="button" onClick={() => setSearchOpen(true)} className="hidden h-11 w-11 place-items-center md:grid" aria-label={t('nav.search')}>
              <Loupe />
            </button>
            {icons}
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={nav} cartCount={count} onCart={openCart} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} entries={search} />
      <CartDrawer />
    </>
  );
}
