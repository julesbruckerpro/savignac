'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { CartLineRow, ShippingGauge } from '@/components/product/CartLineRow';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';

export function CartDrawer() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const { cart, drawerOpen, closeDrawer, lastAdded } = useCart();
  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      title={lastAdded ? t('added') : t('title')}
      closeLabel={tc('close')}
      footer={
        cart.lines.length > 0 ? (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="label">{t('subtotal')}</span>
              <span className="price text-[22px]">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="mt-2">
              <ShippingGauge subtotal={cart.subtotal} threshold={site.freeShippingFromCents} />
            </div>
            <Link href="/panier" onClick={closeDrawer} className="btn btn-block mt-5">
              <span>{t('view')}</span>
            </Link>
            <button type="button" onClick={closeDrawer} className="label mx-auto mt-3 flex min-h-11 items-center">
              <span className="lu">{t('continue')}</span>
            </button>
          </div>
        ) : undefined
      }
    >
      {cart.lines.length === 0 ? (
        <div className="py-16 text-center">
          <p className="lyric mx-auto max-w-[16ch]">{t('empty')}</p>
          <Link href="/couteaux" onClick={closeDrawer} className="btn mt-8">
            <span>{tc('chooseKnife')}</span>
          </Link>
        </div>
      ) : (
        <ul aria-label={t('title')}>
          {cart.lines.map((line) => (
            <CartLineRow key={line.id} line={line} compact onNavigate={closeDrawer} />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
