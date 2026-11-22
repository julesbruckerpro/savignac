import { Link } from '@/i18n/navigation';

const TABS = [
  ['La presse en parle', '/presse'],
  ['Fabrication illustrée', '/presse/fabrication-illustree'],
  ['Communication', '/presse/communication'],
  ['Catalogue', '/presse/catalogue'],
  ['Vidéo', '/presse/video'],
] as const;

export function PressNav({ current }: { current: string }) {
  return (
    <nav aria-label="Rubriques presse" className="wrap">
      <ul className="label scroll-x flex gap-x-8 border-y border-rule-strong">
        {TABS.map(([label, href]) => (
          <li key={href} className="flex-none">
            <Link href={href} aria-current={href === current ? 'page' : undefined} className={`inline-flex min-h-[52px] items-center ${href === current ? 'text-fg' : 'text-mute'}`}>
              <span className={`lu ${href === current ? 'is-on' : ''}`}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
