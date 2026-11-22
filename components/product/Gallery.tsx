'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import zones from '@/content/products/data/engrave-zones.json';
import type { EngraveStyle } from '@/lib/engrave-fonts';
import { useDialog } from '@/lib/use-dialog';

type Zone = { x: number; y: number; w: number; h: number; rot: number };
const ZONES = zones as Record<string, Zone>;
const ZOOM = 2.1;

export interface EngravingPreview {
  text: string;
  placeholder: string;
  style: EngraveStyle;
}

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
export function Gallery({ views, swapKey, engraving }: { views: GalleryView[]; swapKey: string; engraving?: EngravingPreview }) {
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
  const engraveOn = !!engraving;
  useEffect(() => {
    if (engraveOn) setActive('troisQuarts');
  }, [engraveOn]);

  const labels: Record<GalleryView['id'], string> = { troisQuarts: t('threeQuarter'), ferme: t('closed'), atelier: t('atelier') };

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoom(true)}
        aria-label={t('zoom')}
       
        className="relative block h-[clamp(170px,46vw,300px)] w-full overflow-hidden border-b border-rule md:h-[340px]"
      >
        <span key={`${swapKey}-${view.id}`} className="swap absolute inset-0 block [container-type:inline-size]">
          {view.cutout ? (
            <span className="absolute inset-x-0 top-1/2 block -translate-y-1/2">
              <KnifeStage src={view.src} alt={view.alt} engraving={view.id === 'troisQuarts' ? engraving : undefined} priority />
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

/** Photo détourée au ratio 3,4:1, avec, si demandé, le gros plan sur la lame et le texte gravé. */
export function KnifeStage({ src, alt, engraving, priority = false }: { src: string; alt: string; engraving?: EngravingPreview; priority?: boolean }) {
  const zone = engraving ? ZONES[src] : undefined;
  const text = engraving ? engraving.text || engraving.placeholder : '';
  const shown = engraving?.style.upper ? text.toUpperCase() : text;
  // taille de lettre : hauteur de la zone, réduite si le texte est long (unités : % de la largeur)
  const fontSize = zone && engraving ? Math.min(zone.h / 3.4, zone.w / (Math.max(shown.length, 6) * engraving.style.advance)) : 0;
  return (
    <span className="relative block aspect-[3.4/1] w-full overflow-hidden bg-bg [container-type:inline-size]">
      <span className="engrave-stage absolute inset-0 block" style={zone ? { transform: `scale(${ZOOM})`, transformOrigin: `${zone.x}% ${zone.y}%` } : undefined}>
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 1480px, 200vw" className="knife" />
        {zone && engraving ? (
          <span
            aria-hidden="true"
            data-testid="apercu-gravure"
            className={`engrave-text ${engraving.style.className} ${engraving.text ? '' : 'is-empty'}`}
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, fontSize: `${fontSize}cqw`, transform: `translate(-50%, -50%) rotate(${zone.rot}deg)` }}
          >
            {shown}
          </span>
        ) : null}
      </span>
    </span>
  );
}
