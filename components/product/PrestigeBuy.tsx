'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart-store';
import type { Variant } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/format';
import { flags } from '@/lib/site';

/** Achat direct d'une pièce de prestige (bouton blanc sur noir). */
export function PrestigeBuy({ name, productHandle, href, variants, finishes, mancheLabels }: { name: string; productHandle: string; href: string; variants: Variant[]; finishes: Record<string, string>; mancheLabels: Record<string, string> }) {
  const t = useTranslations('common');
  const tc = useTranslations('config');
  const add = useCart((s) => s.add);
  const [sku, setSku] = useState(variants[0].sku);
  const v = variants.find((x) => x.sku === sku) ?? variants[0];
  return (
    <div>
      <p className="text-[19px] italic leading-snug text-soft" aria-live="polite">
        {finishes[v.sku]}
      </p>
      {variants.length > 1 ? (
        <fieldset className="mt-6">
          <legend className="label mb-3 text-mute">{tc('manche')}</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((x) => (
              <button key={x.sku} type="button" className="pill" aria-pressed={x.sku === sku} onClick={() => setSku(x.sku)}>
                {mancheLabels[x.options.manche ?? ''] ?? x.options.manche}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <p className="price mt-7 text-[30px] leading-none" aria-live="polite">
        {formatPrice(v.price)}
      </p>
      {flags.showLeadTimes && v.madeToOrder ? <p className="mt-3 text-[14px] italic text-soft">{v.madeToOrder.delayLabel}</p> : null}
      <button
        type="button"
        className="btn mt-8"
        onClick={() =>
          add({ sku: v.sku, productHandle, href, name, variantTitle: v.title, finish: finishes[v.sku], image: v.images.troisQuarts, unitPrice: v.price, attributes: {} })
        }
      >
        <span>{t('addToCart')}</span>
      </button>
    </div>
  );
}
