import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/Logo';
import { site } from '@/lib/site';
import { LocaleSwitcher } from './LocaleSwitcher';

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t('shop'),
      links: [
        { label: tn('poche'), href: '/couteaux/poche' },
        { label: tn('table'), href: '/couteaux/table' },
        { label: tn('cuisine'), href: '/couteaux/cuisine' },
        { label: tn('fixes'), href: '/couteaux/fixes' },
        { label: tn('prestige'), href: '/couteaux/prestige' },
        { label: tn('accessoires'), href: '/couteaux/accessoires' },
        { label: tn('cadeaux'), href: '/idees-cadeaux' },
      ],
    },
    {
      title: t('help'),
      links: [
        { label: t('contact'), href: '/contact' },
        { label: t('shipping'), href: '/livraison-retours' },
        { label: t('care'), href: '/conseils-entretien' },
        { label: t('steels'), href: '/guide-des-aciers' },
        { label: t('mechanisms'), href: '/friction-ou-systeme' },
        { label: t('dealers'), href: '/revendeurs' },
        { label: t('account'), href: '/compte' },
      ],
    },
    {
      title: t('house'),
      links: [
        { label: t('history'), href: '/la-maison/histoire' },
        { label: t('workshops'), href: '/la-maison/les-ateliers' },
        { label: t('local'), href: '/la-maison/une-production-locale' },
        { label: t('range'), href: '/la-maison/notre-gamme' },
        { label: t('patents'), href: '/la-maison/brevets' },
        { label: t('tour'), href: '/la-maison/visite-virtuelle' },
        { label: t('press'), href: '/presse' },
      ],
    },
    {
      title: t('info'),
      links: [
        { label: t('cgv'), href: '/cgv' },
        { label: t('legal'), href: '/mentions-legales' },
        { label: t('privacy'), href: '/confidentialite' },
      ],
    },
  ];
  return (
    <footer className="bg-bg text-fg">
      <div className="wrap">
        <div className="grid gap-x-8 gap-y-12 border-t border-rule-strong pb-14 pt-14 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-4">
            <Link href="/" aria-label="Savignac" className="block w-[240px]">
              <Logo />
            </Link>
            <p className="label mt-8 text-mute">{t('shopLabel')}</p>
            <address className="mt-3 text-[16px] not-italic leading-relaxed text-soft">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              <br />
              <a href={`tel:${site.phoneIntl}`} className="lu mt-2">
                {site.phone}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="lu">
                {site.email}
              </a>
            </address>
          </div>
          <nav aria-label={t('info')} className="grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-8 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="label mb-4">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-9 items-center text-[15px] leading-snug text-soft">
                        <span className="lu">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-5 border-t border-rule py-7 md:flex-row md:items-center md:justify-between">
          <p className="label-sm text-mute">{t('rights')}</p>
          <ul className="label-sm flex flex-wrap items-center gap-x-6 gap-y-2" aria-label={t('follow')}>
            {(['instagram', 'facebook', 'pinterest'] as const).map((n) => (
              <li key={n}>
                <a href={site.social[n]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center">
                  <span className="lu">{n}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={site.sisterSite} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center normal-case tracking-[0.12em]">
                <span className="lu">{t('combs')}</span>
              </a>
            </li>
          </ul>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
