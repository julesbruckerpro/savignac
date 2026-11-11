import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';

export interface Crumb {
  label: string;
  href?: string;
}

export async function Breadcrumb({ items }: { items: Crumb[] }) {
  const t = await getTranslations('common');
  const all: Crumb[] = [{ label: t('home'), href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: site.url + c.href } : {}),
    })),
  };
  return (
    <nav aria-label={t('breadcrumb')} className="wrap pt-6 md:pt-8">
      <ol className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-mute">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-x-3">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="lu py-2">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="py-2 text-fg">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
