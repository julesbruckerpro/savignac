import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Placeholder } from '@/components/ui/Placeholder';
import { patents } from '@/content/pages/house';

export const metadata: Metadata = { title: 'Les brevets', description: 'Les marques et les dessins déposés de la Coutellerie Savignac : L’Ariégeois, Le Cathare, Le Grat, Le Roques, Le Montagnol.' };

export default async function PatentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'La Maison', href: '/la-maison' }, { label: 'Les brevets' }]} />
      <PageIntro label="La Maison" title={patents.title} text={patents.text} />
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="label border-b border-rule-strong pb-5">Marques déposées</h2>
            <dl>
              {patents.marks.map((m) => (
                <div key={m.number} className="flex items-baseline justify-between gap-6 border-b border-rule py-5">
                  <dt className="name-card !text-[17px]">{m.name}</dt>
                  <dd className="font-sans text-[14px] tracking-[0.08em] text-soft">N° {m.number}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="label border-b border-rule-strong pb-5">Dessins déposés</h2>
            <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {patents.designs.map((d) => (
                <li key={d.name} className="border-b border-rule py-6" data-reveal>
                  {d.image ? (
                    <span className="relative mb-4 block aspect-[3/2] w-full overflow-hidden bg-white">
                      <Image src={d.image} alt={`Dessin déposé : ${d.name}`} fill sizes="(min-width: 1024px) 340px, 100vw" className="bw object-contain" />
                    </span>
                  ) : null}
                  <p className="text-[18px] leading-snug">{d.name}</p>
                  <p className="mt-1 font-sans text-[14px] tracking-[0.08em] text-soft">{d.number ? `N° ${d.number}` : <Placeholder label={'missing' in d ? (d.missing as string) : 'numéro de dépôt'} fallback={<span className="font-serif italic tracking-normal text-mute">Dessin déposé</span>} />}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
