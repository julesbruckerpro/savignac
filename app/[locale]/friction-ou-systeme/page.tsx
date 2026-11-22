import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { commerce } from '@/lib/commerce';
import { formatPriceShort } from '@/lib/format';
import { typo } from '@/lib/typo';

export const metadata: Metadata = { title: 'Friction ou système', description: 'Couteau à friction, dit « deux clous », ou couteau à système à cran plat : comprendre la différence avant de choisir.' };

/** Schémas au trait : la lame, le clou de rotation et le clou de butée ; le ressort et le cran à 90°. */
function Friction() {
  return (
    <svg viewBox="0 0 520 220" className="h-auto w-full" role="img" aria-label="Schéma d’un couteau à friction : la lame tourne sur un clou de rotation et s’arrête sur un clou de butée" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M250 96 C330 78 430 84 500 104 C512 108 512 132 498 136 L262 140 Z" />
      <path d="M20 128 C90 96 180 86 290 92 L296 132 C200 134 100 138 20 128 Z" />
      <circle cx="270" cy="112" r="6" />
      <circle cx="302" cy="100" r="4" />
      <path d="M270 118 V176 M302 96 V44" strokeDasharray="2 4" />
      <text x="270" y="194" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Clou de rotation</text>
      <text x="302" y="34" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Clou de butée</text>
      <text x="110" y="76" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Lame</text>
    </svg>
  );
}
function System() {
  return (
    <svg viewBox="0 0 520 220" className="h-auto w-full" role="img" aria-label="Schéma d’un couteau à cran plat : un ressort dans le dos du manche retient la lame et l’arrête à 90 degrés" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M250 96 C330 80 430 86 500 104 C512 108 512 132 498 136 L262 140 Z" />
      <path d="M262 100 C340 88 430 92 494 108" strokeWidth="3" />
      <path d="M20 128 C90 96 180 86 290 92 L296 132 C200 134 100 138 20 128 Z" />
      <circle cx="272" cy="114" r="6" />
      <path d="M272 108 V30 C272 22 276 18 284 18 H292" strokeDasharray="5 5" />
      <path d="M252 114 A20 20 0 0 1 272 94" />
      <text x="232" y="88" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">90°</text>
      <path d="M390 92 V44" strokeDasharray="2 4" />
      <text x="390" y="34" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Ressort</text>
      <text x="110" y="76" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Lame</text>
      <text x="272" y="194" textAnchor="middle" className="fill-current font-sans text-[11px] uppercase tracking-[0.2em]" stroke="none">Cran d’arrêt</text>
    </svg>
  );
}

export default async function MechanismsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const friction = (await commerce.getCollection('friction', locale))!.listings;
  const systeme = (await commerce.getCollection('systeme', locale))!.listings;
  const min = (ls: { fromPrice: number }[]) => formatPriceShort(Math.min(...ls.map((l) => l.fromPrice)));
  const cols = [
    {
      schema: <Friction />,
      label: 'À friction · deux clous',
      title: 'Une lame, un manche, deux clous.',
      text: [
        'Le couteau du berger pyrénéen, héritier du capucin. La lame tourne sur un clou, s’arrête sur l’autre ; rien d’autre. Léger, franc, fidèle.',
        'Un clou de rotation riveté, un clou de butée à l’arrière : c’est le frottement de la lame entre les deux flancs du manche qui la tient. Quand la matière sèche, la friction se relâche ; elle se resserre en quelques coups de marteau.',
        'Le Phasme est monté à friction avec une lentille dite piémontaise : il s’ouvre et se ferme d’une main et reste bloqué en position ouverte.',
      ],
      models: friction,
      href: '/couteaux/friction',
      cta: `Voir les couteaux à friction · dès ${min(friction)}`,
    },
    {
      schema: <System />,
      label: 'À système · cran plat',
      title: 'Un ressort qui retient la lame.',
      text: [
        'Le dos du manche porte un ressort qui s’appuie sur le talon de la lame et la maintient ouverte. Difficile de le refermer par mégarde.',
        'À 90°, la lame marque un arrêt ; il faut prolonger la flexion pour la refermer. C’est ce qui distingue le cran plat du cran forcé classique.',
        'Sur Le Capi, le ressort maintient la lame ouverte, la ramène à 90°, puis l’entraîne en position fermée.',
      ],
      models: systeme,
      href: '/couteaux/systeme',
      cta: `Voir les couteaux à système · dès ${min(systeme)}`,
    },
  ];
  return (
    <>
      <Breadcrumb items={[{ label: 'Friction ou système' }]} />
      <PageIntro title="Friction ou système." text="Deux façons de tenir une lame ouverte. La première n’a besoin que de deux clous ; la seconde ajoute un ressort." />
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 border-t border-rule-strong pt-12 md:grid-cols-2">
          {cols.map((c, i) => (
            <article key={c.href} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <div className="border-b border-rule pb-8 text-fg">{c.schema}</div>
              <p className="label mt-8 text-mute">{c.label}</p>
              <h2 className="lyric mt-4">{c.title}</h2>
              {c.text.map((p, j) => (
                <p key={j} className="text mt-5">
                  {typo(p)}
                </p>
              ))}
              <ul className="mt-8 border-t border-rule">
                {c.models.map((l) => (
                  <li key={l.id} className="border-b border-rule">
                    <Link href={l.href} className="group flex min-h-12 items-baseline justify-between gap-4 py-3">
                      <span className="text-[17px]">
                        <span className="lu lu-group">{l.name}</span>
                      </span>
                      <span className="price text-[14px] text-mute">{l.fromPrice === l.toPrice ? formatPriceShort(l.fromPrice) : `dès ${formatPriceShort(l.fromPrice)}`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={c.href} className="btn mt-8">
                <span>{c.cta}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
