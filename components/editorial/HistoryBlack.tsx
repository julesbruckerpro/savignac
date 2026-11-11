import Image from 'next/image';
import type { ReactNode } from 'react';
import { Heart } from '@/components/ui/Heart';
import { flags } from '@/lib/site';
import { rich } from '@/lib/typo';

type Entry = 'A' | 'B' | 'C' | 'D' | 'E';

/**
 * Section noire (Histoire). Entrée et sortie sans aucun dégradé : deux aplats francs.
 * Variante choisie par NEXT_PUBLIC_HISTORY_ENTRY (A par défaut) :
 *   A photo à cheval · B bloc encadré · C rideau · D coupure franche et cœur · E archive plein cadre
 */
export function HistoryBlack({
  children,
  entryImage,
  exitImages,
  variant = flags.historyEntry,
  id,
}: {
  children: ReactNode;
  entryImage?: { src: string; alt: string; caption?: string };
  exitImages?: { src: string; alt: string }[];
  variant?: Entry;
  id?: string;
}) {
  const caption = entryImage?.caption ? <p className="caption mx-auto max-w-[62ch] px-[var(--gutter)] pt-5 text-center">{rich(entryImage.caption)}</p> : null;

  if (variant === 'B') {
    return (
      <section id={id} className="wrap section">
        <div className="theme-dark px-6 py-14 md:px-14 md:py-24">
          {entryImage ? (
            <figure className="mx-auto mb-14 max-w-[980px]" data-reveal>
              <span className="relative block aspect-[980/560] w-full">
                <Image src={entryImage.src} alt={entryImage.alt} fill sizes="(min-width: 1100px) 980px, 100vw" className="bw object-cover" />
              </span>
              {caption}
            </figure>
          ) : null}
          {children}
        </div>
      </section>
    );
  }

  const entry =
    variant === 'A' && entryImage ? (
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" aria-hidden="true" />
        <figure className="wrap relative" data-reveal>
          <span className="relative mx-auto block aspect-[980/560] w-full max-w-[980px]">
            <Image src={entryImage.src} alt={entryImage.alt} fill sizes="(min-width: 1100px) 980px, 100vw" className="bw object-cover" />
          </span>
        </figure>
      </div>
    ) : variant === 'E' && entryImage ? (
      <figure className="relative h-[280px] w-full md:h-[460px]">
        <Image src={entryImage.src} alt={entryImage.alt} fill sizes="100vw" className="bw object-cover" style={{ objectPosition: '50% 62%' }} />
      </figure>
    ) : variant === 'D' ? (
      <div className="relative h-0">
        <span className="absolute left-1/2 top-0 z-10 grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center !rounded-full bg-paper text-ink">
          <Heart size={30} />
        </span>
      </div>
    ) : null;

  return (
    <section id={id} className="section-top">
      {entry}
      <div className="theme-dark" {...(variant === 'C' ? { 'data-curtain': '' } : {})}>
        {variant === 'A' || variant === 'E' ? caption : null}
        {(variant === 'C' || variant === 'D') && entryImage ? (
          <figure className="wrap pt-24" data-reveal>
            <span className="relative mx-auto block aspect-[980/560] w-full max-w-[980px]">
              <Image src={entryImage.src} alt={entryImage.alt} fill sizes="(min-width: 1100px) 980px, 100vw" className="bw object-cover" />
            </span>
            {caption}
          </figure>
        ) : null}
        <div className={`pt-14 md:pt-20 ${variant === 'A' && exitImages ? 'pb-14 md:pb-20' : 'pb-[var(--section)]'}`}>{children}</div>
      </div>
      {variant === 'A' && exitImages ? (
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-ink" aria-hidden="true" />
          <div className="wrap relative grid grid-cols-2 gap-3 md:gap-8" data-reveal>
            {exitImages.map((img) => (
              <span key={img.src} className="relative block h-[180px] w-full sm:h-[280px] md:h-[380px]">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 620px, 50vw" className="bw object-cover" />
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function FamilyCard({ name, era, text, image, alt, index = 0 }: { name: string; era: string; text: string; image: string; alt: string; index?: number }) {
  return (
    <article data-reveal style={{ ['--d' as string]: `${index * 80}ms` }}>
      <span className="relative block h-[240px] w-full md:h-[300px]">
        <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="bw object-cover" />
      </span>
      <p className="label mt-6 text-mute">{rich(era)}</p>
      <h3 className="name-family mt-3">{name}</h3>
      <p className="text-s mt-4">{rich(text)}</p>
    </article>
  );
}
