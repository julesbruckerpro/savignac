import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Heart } from '@/components/ui/Heart';

export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="wrap section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Heart size={44} />
      <h1 className="title mt-8">{t('notFound.title')}</h1>
      <p className="text mx-auto mt-5">{t('notFound.text')}</p>
      <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
        <Link href="/" className="btn">
          <span>{t('common.backHome')}</span>
        </Link>
        <Link href="/couteaux" className="btn btn-outline">
          <span>{t('common.chooseKnife')}</span>
        </Link>
      </div>
    </section>
  );
}
