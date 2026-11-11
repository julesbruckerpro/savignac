import Image from 'next/image';
import { rich } from '@/lib/typo';

/** Photo d'archive, d'atelier ou de boutique : toujours en noir et blanc, légende italique dessous. */
export function Photo({
  src,
  alt,
  caption,
  ratio = '3/2',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className = '',
  fit = 'cover',
  priority = false,
  reveal = true,
  position,
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  sizes?: string;
  className?: string;
  fit?: 'cover' | 'contain';
  priority?: boolean;
  reveal?: boolean;
  position?: string;
}) {
  return (
    <figure className={className} {...(reveal ? { 'data-reveal': '' } : {})}>
      <span className="relative block w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`bw ${fit === 'cover' ? 'object-cover' : 'object-contain'}`} style={position ? { objectPosition: position } : undefined} />
      </span>
      {caption ? <figcaption className="caption mt-3">{rich(caption)}</figcaption> : null}
    </figure>
  );
}
