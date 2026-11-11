'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDialog } from '@/lib/use-dialog';

export interface GalleryView {
  id: 'troisQuarts' | 'ferme' | 'atelier';
  src: string;
  alt: string;
  caption: string;
  /** Photo détourée (fondue dans le papier) ou photo d'atelier en noir et blanc. */
  cutout: boolean;
}

/**
 * Galerie de la fiche : photo de la finition choisie, onglets texte, légende qui décrit
 * exactement ce que montre la photo, agrandissement plein écran (Échap pour fermer).
 */
export function Gallery({ views, swapKey, engraving }: { views: GalleryView[]; swapKey: string; engraving?: string }) {
  const t = useTranslations('config');
  const tc = useTranslations('common');
  const [active, setActive] = useState<GalleryView['id']>('troisQuarts');
  const [zoom, setZoom] = useState(false);
  const lightbox = useRef<HTMLDivElement>(null);
  useDialog(zoom, () => setZoom(false), lightbox);

  const view = views.find((v) => v.id === active) ?? views[0];
  useEffect(() => {
    if (!views.some((v) => v.id === active)) setActive('troisQuarts');
  }, [views, active]);
  // une gravure se regarde sur la lame : on revient à la vue de trois-quarts
  useEffect(() => {
    if (engraving) setActive('troisQuarts');
  }, [engraving]);

  const labels: Record<GalleryView['id'], string> = { troisQuarts: t('threeQuarter'), ferme: t('closed'), atelier: t('atelier') };

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={t('zoom')}
        data-cursor="voir"
        className="relative block h-[clamp(190px,56vw,300px)] w-full overflow-hidden border-b border-rule md:h-[420px]"
      >
        <span key={`${swapKey}-${view.id}`} className="swap absolute inset-0 block [container-type:inline-size]">
          {view.cutout ? (
            <span className="absolute inset-x-0 top-1/2 block aspect-[3.4/1] -translate-y-1/2 bg-bg">
              <Image src={view.src} alt={view.alt} fill priority sizes="(min-width: 1024px) 740px, 100vw" className="knife" />
              {engraving && view.id === 'troisQuarts' ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[14%] top-[46%] w-[30%] -rotate-[5deg] text-center font-serif italic leading-none text-ink-70 underline decoration-dotted decoration-1 underline-offset-[0.3em]"
                  style={{ fontSize: `clamp(9px, ${Math.max(1.5, 2.9 - engraving.length * 0.06)}cqw, 22px)` }}
                >
                  {engraving}
                </span>
              ) : null}
            </span>
          ) : (
            <Image src={view.src} alt={view.alt} fill sizes="(min-width: 1024px) 740px, 100vw" className="object-cover" />
          )}
        </span>
      </button>

      <div role="group" aria-label={t('views')} className="flex gap-x-7">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === view.id}
            onClick={() => setActive(v.id)}
            className={`label -mt-px min-h-11 border-t-2 pt-3 ${v.id === view.id ? 'border-rule-strong text-fg' : 'border-transparent text-mute hover:text-fg'}`}
          >
            {labels[v.id]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[13px] italic leading-snug text-mute" aria-live="polite">
        {view.caption}
      </p>

      <div
        ref={lightbox}
        role="dialog"
        aria-modal="true"
        aria-label={view.alt}
        inert={!zoom}
        data-lenis-prevent
        className={`theme-light fixed inset-0 z-[130] flex flex-col transition-[opacity,visibility] duration-300 ${zoom ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="flex h-16 flex-none items-center justify-between px-6">
          <p className="label">{labels[view.id]}</p>
          <button type="button" onClick={() => setZoom(false)} className="label -mr-3 flex min-h-11 items-center px-3">
            <span className="lu is-on">{tc('close')}</span>
          </button>
        </div>
        <button type="button" onClick={() => setZoom(false)} aria-label={tc('close')} className="relative min-h-0 flex-1 cursor-zoom-out bg-white">
          {zoom ? <Image src={view.src} alt={view.alt} fill sizes="100vw" className="object-contain p-4 md:p-12" /> : null}
        </button>
        <p className="flex-none px-6 py-4 text-center text-[13px] italic text-ink-55">{view.caption}</p>
      </div>
    </div>
  );
}
