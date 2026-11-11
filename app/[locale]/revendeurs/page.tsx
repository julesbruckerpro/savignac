import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Dealers, type DealerPoint } from '@/components/map/Dealers';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import dealersData from '@/content/dealers.json';
import { typo } from '@/lib/typo';

export const metadata: Metadata = { title: 'Nos revendeurs', description: 'Plus d’une centaine de couteliers, de caves et de boutiques en France et en Belgique présentent les couteaux Savignac. Trouvez le revendeur le plus proche.' };

type Entry = DealerPoint & { kind: string; note?: string };

export default async function DealersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const all = dealersData as Entry[];
  const dealers = all.filter((d) => d.kind === 'revendeur');
  const partners = all.filter((d) => d.kind === 'partenaire');
  const byDept = new Map<string, Entry[]>();
  for (const p of partners) byDept.set(p.department, [...(byDept.get(p.department) ?? []), p]);
  return (
    <>
      <Breadcrumb items={[{ label: 'Nos revendeurs' }]} />
      <PageIntro title="Nos revendeurs." text="Plus d’une centaine de couteliers, de caves et de boutiques en France et en Belgique présentent nos couteaux." />
      <section className="wrap section-bottom">
        <Dealers dealers={dealers} />
      </section>
      <section className="wrap section-bottom" aria-labelledby="partenaires">
        <h2 id="partenaires" className="title is-46">
          Nos partenaires.
        </h2>
        <p className="text mt-5">Des restaurants ont choisi nos couteaux pour leur table.</p>
        <div className="mt-10 grid grid-cols-1 gap-x-8 lg:grid-cols-3">
          {[...byDept.entries()].map(([dept, items]) => (
            <div key={dept} className="border-t border-rule-strong pb-10 pt-5">
              <h3 className="label text-mute">{dept}</h3>
              <ul className="mt-3">
                {items.map((p) => (
                  <li key={p.id} className="border-b border-rule py-4">
                    <p className="text-[16px] leading-snug">{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="lu">{p.name}</a> : p.name}</p>
                    <p className="mt-1 text-[14px] leading-snug text-mute">
                      {p.postalCode} {p.city}
                    </p>
                    {p.note ? <p className="mt-1 text-[14px] italic leading-snug text-soft">{typo(p.note)}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
