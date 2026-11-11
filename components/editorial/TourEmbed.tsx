'use client';
import Image from 'next/image';
import { useState } from 'react';

/** Visite Google Maps chargée au clic seulement : performance et consentement. */
export function TourEmbed({ title, cta, poster, alt, embed }: { title: string; cta: string; poster: string; alt: string; embed: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink md:aspect-[16/9]">
      {open ? (
        <iframe src={embed} title={`Visite virtuelle : ${title}`} className="absolute inset-0 h-full w-full border-0" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <>
          <Image src={poster} alt={alt} fill sizes="(min-width: 1280px) 1280px, 100vw" className="bw object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 pb-8 md:pb-12">
            <button type="button" onClick={() => setOpen(true)} className="btn theme-light !border-paper !bg-paper !text-ink">
              <span>{cta}</span>
            </button>
            <p className="label-sm bg-paper px-3 py-2 text-ink-55">La visite s’ouvre avec Google Maps</p>
          </div>
        </>
      )}
    </div>
  );
}
