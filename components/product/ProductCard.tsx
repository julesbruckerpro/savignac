import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Price } from '@/components/ui/Price';
import { Swatch } from '@/components/ui/Swatch';
import type { Listing } from '@/lib/commerce/types';
import { rich } from '@/lib/typo';

/**
 * Carte de la grille : pas de cadre, photo détourée au ratio 3,4:1, filet bas.
 * Au survol, la photo avance de 8 px et la vue « fermé » se fond par-dessus.
 */
export async function ProductCard({
  listing,
  index = 0,
  swatches = false,
  priority = false,
  headingLevel = 'h3',
  override,
}: {
  listing: Listing;
  index?: number;
  swatches?: boolean;
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
  /** Sélection éditoriale : une finition précise plutôt que le modèle (idées cadeaux). */
  override?: { href: string; image?: string; imageAlt?: string; price: number; label: string };
}) {
  const t = await getTranslations('common');
  const H = headingLevel;
  const isModel = listing.href.startsWith('/modele/');
  const shown = listing.swatches.slice(0, 7);
  const more = listing.swatches.length - shown.length;
  const image = override?.image ?? listing.image;
  const cutout = !image.includes('/site/') || !['42', '118', '180'].some((id) => image.endsWith(`/${id}.jpg`));
  return (
    <article className="card group relative flex h-full flex-col border-b border-rule pb-6" data-reveal style={{ ['--d' as string]: `${(index % 3) * 80}ms` }}>
      <Link href={override?.href ?? listing.href} className="flex h-full flex-col" data-cursor="voir">
        <span className="relative block aspect-[3.4/1] w-full overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={override?.imageAlt ?? listing.imageAlt}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
              priority={priority}
              className={`card-photo ${cutout ? 'knife' : 'object-contain'}`}
            />
          ) : null}
          {listing.imageClosed && !override ? (
            <span className="card-closed absolute inset-0 hidden bg-bg [isolation:isolate] md:block" aria-hidden="true">
              <Image src={listing.imageClosed} alt="" fill sizes="400px" loading="lazy" className="knife" />
            </span>
          ) : null}
        </span>
        <span className="label-sm mt-6 block text-mute">{rich(listing.kicker)}</span>
        <H className="name-card mt-2">{listing.name}</H>
        {override ? <span className="mt-2 block text-[15px] italic leading-snug text-soft">{override.label}</span> : <span className="mt-2 block text-[15px] leading-snug text-soft">{rich(listing.shortLine)}</span>}
        {swatches && !override && shown.length > 1 ? (
          <span className="mt-4 flex items-center gap-[6px]" aria-label={`${listing.swatches.length} finitions`}>
            {shown.map((s) => (
              <Swatch key={s.id} src={s.swatch} mini />
            ))}
            {more > 0 ? <span className="label-sm ml-1 text-mute">+ {more}</span> : null}
          </span>
        ) : null}
        <span className="mt-auto flex items-baseline justify-between gap-4 pt-5">
          {override ? <Price cents={override.price} className="text-[17px]" /> : <Price cents={listing.fromPrice} from={listing.fromPrice !== listing.toPrice} className="text-[17px]" />}
          <span className="label">
            <span className="lu lu-group">{isModel ? t('personalize') : t('discover')}</span>
          </span>
        </span>
      </Link>
    </article>
  );
}

export function ProductGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>{children}</div>;
}
