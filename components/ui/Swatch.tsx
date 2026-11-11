import Image from 'next/image';

/** Pastille de matière : photo réelle en disque ; sans photo, disque au trait pointillé. */
export function Swatch({ src, mini = false }: { src?: string; mini?: boolean }) {
  const size = mini ? 16 : 34;
  if (!src) return <span className={`swatch is-empty ${mini ? 'is-mini' : ''}`} aria-hidden="true" />;
  return (
    <span className={`swatch ${mini ? 'is-mini' : ''}`} aria-hidden="true">
      <Image src={src} alt="" width={size * 2} height={size * 2} sizes={`${size}px`} />
    </span>
  );
}
