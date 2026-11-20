import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { rich } from '@/lib/typo';

const ITEMS = [
  {
    label: 'Depuis le XVIIIᵉ siècle',
    title: 'Quatre familles, une seule échoppe.',
    text: 'Des Roques aux Montariol, le métier s’est transmis de mariage en mariage, sans jamais quitter Foix.',
    href: '/la-maison/histoire',
    cta: 'Histoire & archives',
    image: '/images/archives/archive-facade-1920.jpg',
    alt: 'La façade de la coutellerie vers 1920',
  },
  {
    label: 'À l’atelier',
    title: 'Monté à l’atelier de Foix.',
    text: 'L’atelier historique du 17 et celui de Peysales : on y façonne les manches, on y ajuste et on y monte les couteaux.',
    href: '/la-maison/les-ateliers',
    cta: 'L’atelier & la fabrication',
    image: '/images/atelier/atelier-3.jpg',
    alt: 'Une coutelière monte un couteau à l’établi',
  },
  {
    label: 'En boutique',
    title: 'Le voir, le prendre en main.',
    text: 'À Foix, au 15 rue des Marchands, et chez plus de quatre-vingts couteliers et boutiques en France et en Belgique.',
    href: '/revendeurs',
    cta: 'Trouver un revendeur',
    image: '/images/boutique/boutique-15-interieur.jpg',
    alt: 'L’intérieur de la boutique du 15 rue des Marchands',
  },
];

/** Bandeau « La Maison » : l'héritage et le savoir-faire dans le parcours d'achat. */
export function HouseStrip({ title = 'La Maison Savignac' }: { title?: string }) {
  return (
    <section className="wrap section-top" aria-labelledby="maison-strip">
      <h2 id="maison-strip" className="label border-b border-rule-strong pb-5">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-10 md:grid-cols-3">
        {ITEMS.map((it, i) => (
          <Link key={it.href} href={it.href} className="group block" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
            <span className="relative block aspect-[3/2] w-full overflow-hidden">
              <Image src={it.image} alt={it.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="bw object-cover transition-transform duration-700 ease-house group-hover:scale-[1.03]" />
            </span>
            <span className="label-sm mt-5 block text-mute">{rich(it.label)}</span>
            <span className="h3 mt-2 block">{it.title}</span>
            <span className="text-s mt-2 block">{it.text}</span>
            <span className="label mt-4 inline-block">
              <span className="lu lu-group">{it.cta}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
