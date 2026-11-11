import type { ReactNode } from 'react';
import { rich } from '@/lib/typo';

/** Ouverture de page : libellé, titre Caslon, texte d'introduction, mention à droite. */
export function PageIntro({ label, title, text, aside, wide = false, h1Class = 'title' }: { label?: string; title: string; text?: string | string[]; aside?: ReactNode; wide?: boolean; h1Class?: string }) {
  const paragraphs = text ? (Array.isArray(text) ? text : [text]) : [];
  return (
    <header className="wrap pb-12 pt-10 md:pb-16 md:pt-16">
      <div className="grid grid-cols-1 items-end gap-x-8 gap-y-6 lg:grid-cols-12">
        <div className={wide ? 'lg:col-span-10' : 'lg:col-span-8'}>
          {label ? <p className="label mb-5 text-mute">{rich(label)}</p> : null}
          <h1 className={`${h1Class} rise max-w-[22ch]`}>{rich(title)}</h1>
          {paragraphs.map((p, i) => (
            <p key={i} className="text rise mt-6" style={{ ['--d' as string]: `${0.15 + i * 0.1}s` }}>
              {rich(p)}
            </p>
          ))}
        </div>
        {aside ? <div className={`label text-mute lg:text-right ${wide ? 'lg:col-span-2' : 'lg:col-span-4'}`}>{aside}</div> : null}
      </div>
    </header>
  );
}
