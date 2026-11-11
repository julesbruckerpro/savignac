import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { ContactForm } from '@/components/layout/ContactForm';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Placeholder } from '@/components/ui/Placeholder';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact', description: 'Coutellerie Savignac, 15 rue des Marchands, 09000 Foix. Téléphone : 05 61 02 90 70.' };

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <PageIntro title="Nous écrire." text="Une question sur un couteau, une pièce sur mesure, une lame à affûter : la réponse vient de Foix." />
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 border-t border-rule-strong pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="label text-mute">La boutique « Le 15 »</h2>
            <address className="lyric mt-4 not-italic !text-[22px] md:!text-[24px]">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
            <dl className="mt-8 border-t border-rule">
              <div className="flex items-baseline justify-between gap-6 border-b border-rule py-4">
                <dt className="label text-mute">Téléphone</dt>
                <dd>
                  <a href={`tel:${site.phoneIntl}`} className="lu">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-4">
                <dt className="label text-mute">Courriel</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="lu">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-4">
              <Placeholder label="horaires de la boutique (absents du site actuel)" />
            </p>
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="label mt-4 inline-flex min-h-11 items-center">
              <span className="lu is-on">Voir sur la carte</span>
            </a>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
