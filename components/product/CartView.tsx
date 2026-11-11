'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Heart } from '@/components/ui/Heart';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import { CartLineRow, ShippingGauge } from './CartLineRow';

/** Panier de démonstration : aucun paiement, aucune donnée collectée. */
export function CartView() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const tm = useTranslations('commitments');
  const cart = useCart((s) => s.cart);
  const hydrated = useCart((s) => s.hydrated);
  const [demo, setDemo] = useState(false);

  if (demo) {
    return (
      <section className="wrap section flex min-h-[50vh] flex-col items-center justify-center text-center" aria-live="polite">
        <Heart size={36} />
        <p className="label mt-8 text-mute">{t('demoTitle')}</p>
        <h1 className="title is-46 mt-4 max-w-[20ch]">{t('demoText')}</h1>
        <button type="button" onClick={() => setDemo(false)} className="btn btn-outline mt-10">
          <span>{t('demoBack')}</span>
        </button>
      </section>
    );
  }

  if (!hydrated) return <section className="wrap section min-h-[50vh]" aria-busy="true" />;

  if (cart.lines.length === 0) {
    return (
      <section className="wrap section flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Heart size={36} />
        <h1 className="title is-46 mt-8 max-w-[18ch]">{t('empty')}</h1>
        <Link href="/couteaux" className="btn mt-10">
          <span>{tc('chooseKnife')}</span>
        </Link>
      </section>
    );
  }

  return (
    <section className="wrap section-bottom pt-10 md:pt-16">
      <h1 className="title is-46">{t('title')}</h1>
      <p className="label mt-4 text-mute" aria-live="polite">
        {t('count', { count: cart.totalQuantity })}
      </p>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <ul className="border-t border-rule-strong lg:col-span-7">
          {cart.lines.map((line) => (
            <CartLineRow key={line.id} line={line} />
          ))}
        </ul>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-24">
            <dl className="border-t border-rule-strong">
              <div className="flex items-baseline justify-between border-b border-rule py-4">
                <dt className="label">{t('subtotal')}</dt>
                <dd className="price text-[18px]">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="border-b border-rule py-4">
                <div className="flex items-baseline justify-between">
                  <dt className="label">{t('shipping')}</dt>
                  <dd className="price text-[18px]" data-testid="livraison">
                    {cart.shipping === 0 ? t('shippingFree') : formatPrice(cart.shipping)}
                  </dd>
                </div>
                <div className="mt-2">
                  <ShippingGauge subtotal={cart.subtotal} threshold={site.freeShippingFromCents} />
                </div>
              </div>
              <div className="flex items-baseline justify-between border-b border-rule-strong py-5">
                <dt className="label">{t('total')}</dt>
                <dd className="price text-[26px]" aria-live="polite" data-testid="total">
                  {formatPrice(cart.total)}
                </dd>
              </div>
            </dl>
            <button type="button" onClick={() => { setDemo(true); window.scrollTo({ top: 0 }); }} className="btn btn-block mt-8">
              <span>{t('checkout')}</span>
            </button>
            <Link href="/couteaux" className="label mx-auto mt-3 flex min-h-11 w-max items-center">
              <span className="lu">{t('continue')}</span>
            </Link>
            <ul className="label-sm mt-8 space-y-2 border-t border-rule pt-6 text-mute">
              {[tm('local'), tm('french'), tm('delivery'), tm('payment'), tm('secure')].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
