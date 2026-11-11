'use client';
import Image from 'next/image';
import { Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PriceBox } from '@/components/ui/Price';
import { Swatch } from '@/components/ui/Swatch';
import { GROUP_LABELS, GROUP_ORDER, MECHANISM_LABELS, STEEL_LABELS } from '@/content/materials';
import { useCart } from '@/lib/cart-store';
import type { OptionId, Product, Variant } from '@/lib/commerce/types';
import { ORDER, defaultVariant, finishLabel, label, pick, sanitizeEngraving, selectionToQuery, valuesFor, type Selection } from '@/lib/configurator';
import { formatPrice, formatPriceShort } from '@/lib/format';
import { flags } from '@/lib/site';
import { rich } from '@/lib/typo';
import { Gallery, type GalleryView } from './Gallery';

export interface UpsellLine {
  name: string;
  href: string;
  price: string;
}

/** Lit la configuration dans l'URL (liens partagés, redirections des anciennes fiches). */
function UrlSync({ onParams }: { onParams: (sel: Selection) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    const sel: Selection = {};
    for (const id of ORDER) {
      const v = params.get(id);
      if (v) sel[id] = v;
    }
    if (Object.keys(sel).length) onParams(sel);
  }, [params, onParams]);
  return null;
}

export function Configurator({ product, upsells, atelier }: { product: Product; upsells: UpsellLine[]; atelier: { src: string; alt: string; caption: string } }) {
  const t = useTranslations('config');
  const tc = useTranslations('common');
  const add = useCart((s) => s.add);
  const uid = useId();

  const [variant, setVariant] = useState<Variant>(() => defaultVariant(product));
  const [note, setNote] = useState<{ option: OptionId; text: string } | null>(null);
  const [engrave, setEngrave] = useState(false);
  const [engraving, setEngraving] = useState('');
  const [engravingError, setEngravingError] = useState(false);
  const [chisel, setChisel] = useState(false);
  const [sticky, setSticky] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const engravingRef = useRef<HTMLInputElement>(null);
  const userChanged = useRef(false);

  const selection = variant.options;
  const isModel = product.template === 'modele';

  const onParams = useCallback(
    (sel: Selection) => {
      const first = ORDER.find((id) => sel[id]);
      const v = pick(product, sel, first);
      if (v) setVariant(v);
    },
    [product],
  );

  // l'URL reflète la configuration (partageable)
  useEffect(() => {
    if (!userChanged.current) return;
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${selectionToQuery(product, variant)}`);
  }, [variant, product]);

  useEffect(() => {
    const node = buyRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  function choose(id: OptionId, value: string) {
    userChanged.current = true;
    const rule = product.optionNotes?.find((n) => n.when[id] === value);
    const next = pick(product, { ...selection, [id]: value }, id, rule?.prefer);
    if (!next) return;
    // un choix aval a-t-il dû basculer ?
    const moved = ORDER.find((o) => o !== id && selection[o] && next.options[o] && next.options[o] !== selection[o]);
    if (moved) {
      const fallback = `${label(product, moved, selection[moved])} n’existe pas avec ce choix : nous avons sélectionné ${label(product, moved, next.options[moved]).toLowerCase()}.`;
      setNote({ option: id, text: rule?.note ?? fallback });
    } else setNote(null);
    setVariant(next);
  }

  function selectVariant(v: Variant) {
    userChanged.current = true;
    setNote(null);
    setVariant(v);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const engravingOn = !!product.engraving?.enabled && engrave;
  const chiselOn = !!product.chiseling?.enabled && chisel;
  const total = variant.price + (engravingOn ? product.engraving!.priceCents : 0) + (chiselOn ? product.chiseling!.priceCents : 0);
  const finish = finishLabel(product, variant);
  const mechanism = selection.mecanisme ?? product.mechanisms[0];
  const displayName = product.listings.find((l) => l.preset?.mecanisme && l.preset.mecanisme === selection.mecanisme)?.name ?? product.name;

  function addToCart() {
    const text = engraving.trim();
    if (engravingOn && !text) {
      setEngravingError(true);
      engravingRef.current?.focus();
      engravingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const attributes: Record<string, string> = {};
    if (engravingOn) attributes.Gravure = text;
    if (chiselOn) attributes.Ciselage = 'Oui';
    add({
      sku: variant.sku,
      productHandle: product.handle,
      href: `${isModel ? '/modele' : '/produit'}/${product.handle}${selectionToQuery(product, variant)}`,
      name: displayName,
      variantTitle: variant.title,
      finish,
      image: variant.images.troisQuarts,
      unitPrice: total,
      attributes,
    });
  }

  const views = useMemo<GalleryView[]>(() => {
    const out: GalleryView[] = [];
    const img = variant.images;
    const lower = finish.charAt(0).toLowerCase() + finish.slice(1);
    const base = `${displayName}, ${lower}`;
    const honest = img.exact === false && img.shows ? `Visuel : ${img.shows}. Photo de cette finition à venir.` : `Visuel : ${lower}.`;
    if (img.troisQuarts) out.push({ id: 'troisQuarts', src: img.troisQuarts, alt: `${base}, vue de trois-quarts`, caption: honest, cutout: true });
    if (img.ferme) out.push({ id: 'ferme', src: img.ferme, alt: `${base}, couteau fermé`, caption: `Couteau fermé. ${honest}`, cutout: true });
    if (isModel) out.push({ id: 'atelier', src: atelier.src, alt: atelier.alt, caption: atelier.caption, cutout: false });
    return out;
  }, [variant, displayName, finish, atelier, isModel]);

  const story = product.stories.find((s) => !s.when?.mecanisme || s.when.mecanisme === mechanism) ?? product.stories[0];
  const specs = product.specs.filter((s) => !s.when?.mecanisme || s.when.mecanisme === mechanism);
  const others = product.variants.filter((v) => v.sku !== variant.sku && (!selection.mecanisme || v.options.mecanisme === selection.mecanisme));

  const optionGroup = (id: OptionId) => {
    const option = product.options.find((o) => o.id === id);
    if (!option) return null;
    const values = valuesFor(product, id, selection);
    if (values.length === 0) return null;
    const current = selection[id];
    const asTiles = id === 'manche' && option.values.some((v) => v.swatch);
    const single = values.length === 1;
    const legend = (
      <legend className="label mb-3 flex w-full items-baseline gap-2">
        <span>{option.label}</span>
        <span aria-hidden="true">·</span>
        <span className="font-serif text-[15px] font-normal normal-case italic tracking-normal text-soft">{label(product, id, current)}</span>
      </legend>
    );
    const noteLine =
      note?.option === id ? (
        <p className="mt-3 text-[14px] italic leading-snug text-soft" role="status">
          {note.text}
        </p>
      ) : null;

    if (asTiles) {
      const groups = GROUP_ORDER.map((g) => ({ g, items: values.filter((v) => option.values.find((o) => o.id === v.id)?.group === g) })).filter((x) => x.items.length);
      const showGroupTitles = groups.length > 1 && values.length > 9;
      return (
        <fieldset key={id} className="mt-8 min-w-0">
          {legend}
          {groups.map(({ g, items }) => (
            <div key={g} className={showGroupTitles ? 'mb-4' : 'mb-2'}>
              {showGroupTitles ? <p className="label-sm mb-2 text-mute">{GROUP_LABELS[g]}</p> : null}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
                {items.map((v) => {
                  const val = option.values.find((o) => o.id === v.id)!;
                  return (
                    <button key={v.id} type="button" className="tile" aria-pressed={current === v.id} onClick={() => choose(id, v.id)}>
                      <Swatch src={val.swatch} />
                      <span className="min-w-0">
                        <span className="block text-[14px] leading-tight">{val.label}</span>
                        <span className="mt-0.5 block text-[12px] leading-tight text-mute">{formatPriceShort(v.fromPrice)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {noteLine}
        </fieldset>
      );
    }
    return (
      <fieldset key={id} className="mt-8 min-w-0">
        {legend}
        <div className="flex flex-wrap gap-2">
          {values.map((v) => {
            const text = id === 'lame' ? STEEL_LABELS[v.id] ?? v.id : id === 'mecanisme' ? MECHANISM_LABELS[v.id] ?? v.id : label(product, id, v.id);
            const priced = id !== 'mecanisme' && values.some((o) => o.fromPrice !== values[0].fromPrice);
            return (
              <button
                key={v.id}
                type="button"
                className={`pill ${!v.compatible && current !== v.id ? 'text-mute' : ''}`}
                aria-pressed={current === v.id}
                disabled={single}
                onClick={() => choose(id, v.id)}
              >
                {text}
                {priced && v.compatible ? <span className="ml-2 text-[12px] opacity-70">{formatPriceShort(v.fromPrice)}</span> : null}
              </button>
            );
          })}
        </div>
        {noteLine}
      </fieldset>
    );
  };

  return (
    <>
      <Suspense fallback={null}>
        <UrlSync onParams={onParams} />
      </Suspense>

      {/* ------------------------------------------------------------ bloc achat */}
      <div ref={topRef} className="wrap scroll-mt-24 pt-6 md:pt-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <Gallery views={views} swapKey={variant.sku} engraving={engravingOn ? engraving.trim() : undefined} />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5 lg:pl-4">
            <p className="label text-mute">{product.eyebrow}</p>
            <h1 className="name-xl is-fiche mt-4">{displayName}</h1>
            <p className="mt-4 text-[19px] italic leading-snug text-soft" aria-live="polite">
              {finish}
            </p>
            <div className="mt-6">
              <PriceBox cents={total} label={tc('priceTtc')} />
            </div>
            {flags.currencySwitch ? <p className="caption mt-2">{tc('chfNote')}</p> : null}

            {ORDER.map((id) => optionGroup(id))}

            {product.engraving?.enabled ? (
              <fieldset className="mt-8 min-w-0 border-t border-rule pt-6">
                <legend className="sr-only">{t('engraving')}</legend>
                <label className="flex min-h-11 cursor-pointer items-center gap-4">
                  <input type="checkbox" className="peer sr-only" checked={engrave} onChange={(e) => { setEngrave(e.target.checked); setEngravingError(false); if (e.target.checked) window.setTimeout(() => engravingRef.current?.focus(), 50); }} />
                  <span aria-hidden="true" className="grid h-[18px] w-[18px] flex-none place-items-center border border-rule-strong peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg">
                    <span className={`block h-[10px] w-[10px] bg-fg transition-opacity ${engrave ? 'opacity-100' : 'opacity-0'}`} />
                  </span>
                  <span className="label flex flex-1 flex-wrap items-baseline gap-x-2">
                    {t('engraving')}
                    <span className="text-mute">· {t('beta')}</span>
                  </span>
                  <span className="price text-[15px] text-soft">{t('plus', { price: formatPriceShort(product.engraving.priceCents) })}</span>
                </label>
                {engrave ? (
                  <div className="mt-2">
                    <label htmlFor={`${uid}-gravure`} className="sr-only">
                      {t('engravingLabel')}
                    </label>
                    <input
                      ref={engravingRef}
                      id={`${uid}-gravure`}
                      type="text"
                      value={engraving}
                      maxLength={product.engraving.maxChars}
                      onChange={(e) => { setEngraving(sanitizeEngraving(e.target.value, product.engraving!.maxChars)); setEngravingError(false); }}
                      placeholder={t('engravingPlaceholder')}
                      autoComplete="off"
                      aria-invalid={engravingError}
                      aria-describedby={`${uid}-gravure-aide`}
                      className="field italic"
                    />
                    <p id={`${uid}-gravure-aide`} className="mt-2 flex justify-between gap-4 text-[13px] italic text-mute">
                      <span role={engravingError ? 'alert' : undefined} className={engravingError ? 'text-fg' : ''}>
                        {engravingError ? 'Écrivez le texte à graver, ou décochez la gravure.' : t('engravingNote')}
                      </span>
                      <span className="not-italic tabular-nums">
                        {engraving.length}/{product.engraving.maxChars}
                      </span>
                    </p>
                  </div>
                ) : null}
              </fieldset>
            ) : null}

            {product.chiseling?.enabled ? (
              <fieldset className="mt-4 min-w-0 border-t border-rule pt-4">
                <legend className="sr-only">{t('chisel')}</legend>
                <label className="flex min-h-11 cursor-pointer items-center gap-4">
                  <input type="checkbox" className="peer sr-only" checked={chisel} onChange={(e) => setChisel(e.target.checked)} />
                  <span aria-hidden="true" className="grid h-[18px] w-[18px] flex-none place-items-center border border-rule-strong peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg">
                    <span className={`block h-[10px] w-[10px] bg-fg transition-opacity ${chisel ? 'opacity-100' : 'opacity-0'}`} />
                  </span>
                  <span className="label flex-1">{t('chisel')}</span>
                  <span className="price text-[15px] text-soft">{t('plus', { price: formatPriceShort(product.chiseling.priceCents) })}</span>
                </label>
                {chisel ? <p className="pb-1 text-[13px] italic text-mute">{t('chiselNote')}</p> : null}
              </fieldset>
            ) : null}

            <button ref={buyRef} type="button" onClick={addToCart} className="btn btn-block mt-8">
              <span>
                {tc('addToCart')} · {formatPrice(total)}
              </span>
            </button>
            <p className="label-sm mt-4 text-center leading-relaxed text-mute">{t('reassurance')}</p>
            {flags.showLeadTimes && variant.madeToOrder ? <p className="mt-3 text-center text-[14px] italic text-soft">{variant.madeToOrder.delayLabel}</p> : null}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ récit (bloc noir encadré, variante B) ou description */}
      {story ? (
        <section className="wrap section-top" aria-label={t('story')}>
          <div className="theme-dark grid grid-cols-1 lg:grid-cols-12">
            <div className="px-6 py-12 md:px-12 md:py-20 lg:col-span-7" data-reveal>
              {story.label ? <p className="label text-mute">{rich(story.label)}</p> : null}
              <h2 className="title is-46 mt-5">{rich(story.title)}</h2>
              {story.paragraphs.map((p, i) => (
                <p key={i} className="text mt-6">
                  {rich(p)}
                </p>
              ))}
              {story.quote ? (
                <blockquote className="mt-10 border-t border-rule pt-8">
                  <p className="lyric italic">{rich(story.quote)}</p>
                  {story.quoteSource ? <footer className="label-sm mt-4 text-mute">{story.quoteSource}</footer> : null}
                </blockquote>
              ) : null}
            </div>
            <div className="relative min-h-[320px] lg:col-span-5">
              <Image src={story.image} alt={story.imageAlt} fill sizes="(min-width: 1024px) 520px, 100vw" className={`bw ${story.image.includes('/produits/') ? 'bg-white object-contain p-6' : 'object-cover'}`} />
            </div>
          </div>
        </section>
      ) : null}

      {product.description?.length ? (
        <section className="wrap section-top">
          <div className="grid grid-cols-1 gap-x-8 border-t border-rule-strong pt-10 lg:grid-cols-12">
            <h2 className="label lg:col-span-4">{product.kicker}</h2>
            <div className="mt-6 lg:col-span-7 lg:mt-0">
              {product.description.map((p, i) => (
                <p key={i} className={`${i === 0 ? 'lyric !text-[22px] md:!text-[26px]' : 'text mt-6'} max-w-[60ch]`}>
                  {rich(p)}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ caractéristiques et accompagnement */}
      <section className="wrap section-top">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="label mb-5">{t('specs')}</h2>
            <dl className="specs text-[16px]">
              {product.mechanisms.length > 0 && mechanism && mechanism !== 'fixe' ? (
                <div>
                  <dt className="label self-center text-mute">{t('mecanisme')}</dt>
                  <dd>{MECHANISM_LABELS[mechanism]}</dd>
                </div>
              ) : null}
              {selection.lame ? (
                <div>
                  <dt className="label self-center text-mute">{t('lame')}</dt>
                  <dd>{STEEL_LABELS[selection.lame]}</dd>
                </div>
              ) : null}
              {selection.manche && product.category !== 'accessoires' ? (
                <div>
                  <dt className="label self-center text-mute">{t('manche')}</dt>
                  <dd>{label(product, 'manche', selection.manche)}</dd>
                </div>
              ) : null}
              {specs.map((s) => (
                <div key={s.label + s.value}>
                  <dt className="label self-center text-mute">{s.label}</dt>
                  <dd>{rich(s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
          {upsells.length ? (
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="label mb-5">{t('accompany')}</h2>
              <ul className="border-t border-rule-strong">
                {upsells.map((u) => (
                  <li key={u.href} className="border-b border-rule">
                    <Link href={u.href} className="group flex min-h-[58px] items-baseline justify-between gap-6 py-4">
                      <span className="text-[17px] leading-snug">
                        <span className="lu lu-group">{u.name}</span>
                      </span>
                      <span className="price text-[15px] text-soft">{u.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------------ les autres finitions */}
      {others.length > 0 && isModel ? (
        <section className="section-top" aria-label={t('otherFinishes')}>
          <div className="wrap">
            <h2 className="label border-b border-rule-strong pb-5">{t('otherFinishes')}</h2>
          </div>
          <div className="scroll-x" data-lenis-prevent-wheel>
            <ul className="mx-auto flex w-max min-w-full max-w-none gap-x-6 px-[var(--gutter)] pt-8 xl:px-[max(var(--gutter),calc((100vw-1280px)/2))]">
              {others.map((v) => (
                <li key={v.sku} className="w-[260px] flex-none">
                  <button type="button" onClick={() => selectVariant(v)} className="group block w-full text-left" data-cursor="voir">
                    <span className="relative block aspect-[3.4/1] w-full">
                      {v.images.troisQuarts ? <Image src={v.images.troisQuarts} alt="" fill sizes="260px" loading="lazy" className="knife" /> : null}
                    </span>
                    <span className="mt-4 flex items-baseline justify-between gap-3 border-t border-rule pt-3">
                      <span className="text-[15px] leading-tight">
                        <span className="lu lu-group">{finishLabel(product, v)}</span>
                      </span>
                      <span className="price text-[14px] text-soft">{formatPriceShort(v.price)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ barre d'achat collante (mobile) */}
      <div
        inert={!sticky}
        className={`fixed inset-x-0 bottom-0 z-[60] border-t border-rule-strong bg-bg pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-house lg:hidden ${sticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <p className="min-w-0">
            <span className="price block text-[19px] leading-tight">{formatPrice(total)}</span>
            <span className="block truncate text-[12px] italic leading-tight text-mute">{finish}</span>
          </p>
          <button type="button" onClick={addToCart} className="btn !min-h-12 flex-none !px-5 !py-3">
            <span>{tc('addToCart')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
