import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Photo } from '@/components/editorial/Photo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Placeholder } from '@/components/ui/Placeholder';
import { Link } from '@/i18n/navigation';
import { PressNav } from '@/lib/press-nav';

export const metadata: Metadata = { title: 'Catalogue' };

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ label: 'Presse', href: '/presse' }, { label: 'Catalogue' }]} />
      <PageIntro title="Le catalogue." text="Les modèles, les matières, les aciers et l’histoire de la Maison, réunis dans un même document." />
      <PressNav current="/presse/catalogue" />
      <section className="wrap section-bottom pt-12">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 md:grid-cols-12">
          <Photo src="/images/atelier/atelier-5.jpg" alt="Lames et manches avant montage" ratio="4/5" className="md:col-span-4" sizes="(min-width: 768px) 400px, 100vw" />
          <div className="md:col-span-6 md:col-start-6">
            <p className="label text-mute">Catalogue 2024</p>
            <p className="lyric mt-4">Pour le recevoir, écrivez-nous ou passez à la boutique.</p>
            <p className="mt-3">
              <Placeholder label="fichier PDF du catalogue 2024 et sa couverture (page vide sur le site actuel)" />
            </p>
            <Link href="/contact" className="btn mt-8">
              <span>Demander le catalogue</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
