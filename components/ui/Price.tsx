import { formatChf, formatPrice, formatPriceShort } from '@/lib/format';
import { flags } from '@/lib/site';

/** Prix en italique Caslon. `from` → « dès 73 € » ; `range` → « de 73 € à 305 € ». */
export function Price({
  cents,
  to,
  from = false,
  long = false,
  className = '',
}: {
  cents: number;
  to?: number;
  from?: boolean;
  long?: boolean;
  className?: string;
}) {
  const f = long ? formatPrice : formatPriceShort;
  let text = f(cents);
  if (to !== undefined && to !== cents) text = `de ${f(cents)} à ${f(to)}`;
  else if (from) text = `dès ${f(cents)}`;
  return (
    <span className={`price ${className}`}>
      {text}
      {flags.currencySwitch ? <span className="ml-2 text-mute">({formatChf(cents, flags.chfRate)})</span> : null}
    </span>
  );
}

/** Prix de fiche : encadré de deux filets noirs, libellé « PRIX TTC » à gauche. */
export function PriceBox({ cents, label }: { cents: number; label: string }) {
  return (
    <div className="flex items-baseline justify-between border-y border-rule-strong py-4" aria-live="polite" aria-atomic="true">
      <span className="label">{label}</span>
      <span className="price text-[26px] leading-none">
        {formatPrice(cents)}
        {flags.currencySwitch ? <span className="ml-3 text-[15px] text-mute">({formatChf(cents, flags.chfRate)})</span> : null}
      </span>
    </div>
  );
}
