import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Placeholder } from '@/components/ui/Placeholder';
import { Link } from '@/i18n/navigation';
import { PressNav } from '@/lib/press-nav';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Communication de presse' };

export default async function CommunicationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Presse', href: '/presse' }, { label: 'Communication' }]} />
      <PageIntro title="Communication de presse." text="Journalistes, rédactions : pour un reportage à l’atelier, des visuels ou un entretien, écrivez-nous." />
      <PressNav current="/presse/communication" />
      <section className="wrap section-bottom pt-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          <div className="border-t border-rule-strong pt-6">
            <p className="label text-mute">Contact presse</p>
            <p className="lyric mt-4 !text-[24px]">{site.phone}</p>
            <p className="mt-2">
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
            </p>
            <Link href="/contact?objet=presse" className="btn mt-8">
              <span>Écrire à la Maison</span>
            </Link>
          </div>
          <div className="border-t border-rule-strong pt-6">
            <p className="label text-mute">Documents</p>
            <ul className="mt-4">
              <li className="border-b border-rule">
                <Link href="/presse/catalogue" className="group flex min-h-12 items-center py-3 text-[17px]">
                  <span className="lu lu-group">Le catalogue</span>
                </Link>
              </li>
              <li className="border-b border-rule">
                <Link href="/presse/fabrication-illustree" className="group flex min-h-12 items-center py-3 text-[17px]">
                  <span className="lu lu-group">La bande dessinée « Fabrication du couteau de chasse »</span>
                </Link>
              </li>
              <li className="border-b border-rule">
                <Link href="/presse/video" className="group flex min-h-12 items-center py-3 text-[17px]">
                  <span className="lu lu-group">Le film de présentation</span>
                </Link>
              </li>
            </ul>
            <p className="mt-4">
              <Placeholder label="communiqués et dossier de presse (page vide sur le site actuel)" />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
