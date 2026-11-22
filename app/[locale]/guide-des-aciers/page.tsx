import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { steels } from '@/content/pages/guides';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = { title: 'Guide des aciers', description: 'Inox 14C28, carbone XC75, RWL34, damas : origine, famille et dureté des aciers de la Coutellerie Savignac.' };

export default async function SteelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Guide des aciers' }]} />
      <PageIntro title={steels.title} text={[steels.intro, steels.text]} />
      <section className="wrap section-bottom">
        <div className="scroll-x" tabIndex={0} role="region" aria-label="Tableau des aciers">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">Aciers, origine, famille, dureté Rockwell et usage</caption>
            <thead>
              <tr className="label border-y border-rule-strong text-mute">
                {['Acier', 'Origine', 'Famille', 'Dureté (HRC)', 'Pour qui'].map((h) => (
                  <th key={h} scope="col" className="py-4 pr-6 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {steels.rows.map((r) => (
                <tr key={r.steel} className="border-b border-rule align-top">
                  <th scope="row" className="py-5 pr-6 font-sans text-[15px] font-medium uppercase tracking-[0.1em]">
                    {r.steel}
                  </th>
                  <td className="py-5 pr-6 text-[16px] text-soft">{r.origin}</td>
                  <td className="py-5 pr-6 text-[16px] text-soft">{r.family}</td>
                  <td className="price py-5 pr-6 text-[17px]">{r.hrc}</td>
                  <td className="max-w-[36ch] py-5 text-[15px] leading-snug text-soft">{r.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="label mt-12 flex flex-wrap gap-x-10 gap-y-2">
          <Link href="/conseils-entretien" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Conseils et entretien</span>
          </Link>
          <Link href="/couteaux/poche" className="inline-flex min-h-11 items-center">
            <span className="lu is-on">Couteaux de poche</span>
          </Link>
        </div>
      </section>
    </>
  );
}
