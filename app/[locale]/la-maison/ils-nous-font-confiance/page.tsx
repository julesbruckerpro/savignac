import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Placeholder } from '@/components/ui/Placeholder';
import dealersData from '@/content/dealers.json';
import { press } from '@/content/pages/guides';
import { Link } from '@/i18n/navigation';
import { formatDateLong } from '@/lib/format';
import { typo } from '@/lib/typo';

export const metadata: Metadata = {
  title: 'Ils nous font confiance',
  description: 'La presse, les restaurants qui servent nos couteaux de table et les couteliers qui présentent nos couteaux en France et en Belgique.',
};

interface Entry {
  id: string;
  kind: string;
  name: string;
  city: string;
  postalCode: string;
  department: string;
  url?: string;
  note?: string;
}

/**
 * Preuves sélectionnées, présentées comme telles (pas un flux d'avis clients).
 * V1 : uniquement des informations déjà publiques sur le site actuel. Les témoignages de chefs
 * attendent les autorisations écrites ; leur emplacement est prêt mais masqué.
 */
export default async function TrustPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const all = dealersData as Entry[];
  const restaurants = all.filter((d) => d.kind === 'partenaire').sort((a, b) => a.name.replace(/^Restaurant /, '').localeCompare(b.name.replace(/^Restaurant /, ''), 'fr'));
  const dealers = all.filter((d) => d.kind === 'revendeur');
  const departments = new Set(dealers.filter((d) => d.department !== 'Belgique').map((d) => d.department)).size;
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Ils nous font confiance' }]} />
      <PageIntro
        label="La Maison"
        title="Ils nous font confiance."
        text="La presse qui a raconté la Maison, les tables qui servent nos couteaux, les couteliers qui les présentent. Une sélection, présentée comme telle."
      />

      <section className="wrap section-bottom" aria-labelledby="presse">
        <h2 id="presse" className="label border-b border-rule-strong pb-5">
          La presse
        </h2>
        <ol className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          {press.articles.map((a) => (
            <li key={a.date} className="border-b border-rule py-8" data-reveal>
              <p className="label-sm text-mute">
                {a.media} · <time dateTime={a.date}>{formatDateLong(a.date)}</time>
              </p>
              <h3 className="h3 mt-3">{a.title}</h3>
              {a.quote ? <p className="mt-4 text-[19px] italic leading-snug">{a.quote}</p> : <p className="text-s mt-3">{a.summary}</p>}
              {a.url ? (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="label mt-5 inline-flex min-h-11 items-center">
                  <span className="lu is-on">Lire l’article</span>
                </a>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section-bottom" aria-labelledby="tables">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="tables" className="title is-46">
              À leur table.
            </h2>
            <p className="text mt-5">{restaurants.length} restaurants ont choisi nos couteaux de table. Présentés par ordre alphabétique.</p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 border-t border-rule-strong sm:grid-cols-2 lg:col-span-8">
            {restaurants.map((r) => (
              <li key={r.id} className="border-b border-rule py-5">
                <p className="text-[17px] leading-snug">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="lu">
                      {r.name}
                    </a>
                  ) : (
                    r.name
                  )}
                </p>
                <p className="mt-1 text-[14px] text-mute">
                  {r.city} · {r.department}
                </p>
                {r.note ? <p className="mt-1 text-[14px] italic text-soft">{typo(r.note)}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section-bottom" aria-labelledby="chefs">
        <h2 id="chefs" className="sr-only">
          Témoignages
        </h2>
        <Placeholder label="témoignages de chefs, restaurateurs et revendeurs, avec leur accord écrit (citation, photo, nom)" />
      </section>

      <section className="wrap section-bottom" aria-labelledby="couteliers">
        <div className="grid grid-cols-1 items-end gap-x-8 gap-y-8 border-t border-rule-strong pt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="couteliers" className="title is-46">
              Chez les couteliers.
            </h2>
            <p className="text mt-5">
              {dealers.length} couteliers, caves et boutiques présentent nos couteaux, dans {departments} départements et en Belgique.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
            <Link href="/revendeurs" className="btn">
              <span>Voir la carte des revendeurs</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
