'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/lib/cart-store';
import type { CartLine } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/format';

export function CartLineRow({ line, compact = false, onNavigate }: { line: CartLine; compact?: boolean; onNavigate?: () => void }) {
  const t = useTranslations('cart');
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const extras = Object.entries(line.attributes);
  return (
    <li className={`grid gap-x-5 border-b border-rule py-6 ${compact ? 'grid-cols-[96px_1fr]' : 'grid-cols-[96px_1fr] md:grid-cols-[160px_1fr_auto]'}`}>
      <Link href={line.href} onClick={onNavigate} className="block self-start bg-white" data-cursor="voir" tabIndex={-1} aria-hidden="true">
        {line.image ? (
          <Image src={line.image} alt="" width={320} height={94} sizes="160px" className="h-auto w-full" />
        ) : (
          <span className="block aspect-[3.4/1] w-full" />
        )}
      </Link>
      <div className="min-w-0">
        <Link href={line.href} onClick={onNavigate} className="name-card block !text-[17px]">
          {line.name}
        </Link>
        <p className="mt-1 text-[15px] italic leading-snug text-soft">{line.finish}</p>
        {extras.map(([k, v]) => (
          <p key={k} className="mt-1 text-[15px] italic leading-snug text-soft">
            {k === 'Gravure' ? t('engraving', { text: v }) : k === 'Ciselage' ? t('chisel') : `${k} : ${v}`}
          </p>
        ))}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center border border-rule-strong" role="group" aria-label={t('quantity')}>
            <button type="button" className="grid h-11 w-11 place-items-center text-[18px]" aria-label={t('decrease')} onClick={() => setQuantity(line.id, line.quantity - 1)}>
              −
            </button>
            <span className="min-w-8 text-center font-sans text-[13px]" aria-live="polite">
              {line.quantity}
            </span>
            <button type="button" className="grid h-11 w-11 place-items-center text-[18px]" aria-label={t('increase')} onClick={() => setQuantity(line.id, line.quantity + 1)}>
              +
            </button>
          </div>
          <button type="button" className="label-sm flex min-h-11 items-center text-mute" onClick={() => remove(line.id)}>
            <span className="lu">{t('remove')}</span>
          </button>
          {compact ? <span className="price ml-auto text-[17px]">{formatPrice(line.unitPrice * line.quantity)}</span> : null}
        </div>
      </div>
      {compact ? null : (
        <div className="col-span-2 mt-4 text-right md:col-span-1 md:mt-0">
          <p className="price text-[20px]">{formatPrice(line.unitPrice * line.quantity)}</p>
          {line.quantity > 1 ? (
            <p className="caption mt-1">
              {formatPrice(line.unitPrice)} {t('unit')}
            </p>
          ) : null}
        </div>
      )}
    </li>
  );
}

/** Jauge texte de la livraison offerte. */
export function ShippingGauge({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const t = useTranslations('cart');
  if (subtotal <= 0) return null;
  return (
    <p className="caption" aria-live="polite">
      {subtotal >= threshold ? t('shippingReached') : t('shippingGauge', { amount: formatPrice(threshold - subtotal) })}
    </p>
  );
}
