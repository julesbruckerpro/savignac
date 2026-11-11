import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: 'Accès réservé · Coutellerie Savignac', robots: { index: false, follow: false } };

export default async function AccesPage({ searchParams }: { searchParams: Promise<{ retour?: string; erreur?: string }> }) {
  const { retour, erreur } = await searchParams;
  return (
        <main className="wrap flex min-h-dvh flex-col items-center justify-center py-16 text-center">
          <Image src="/images/logo/savignac-logo-noir.svg" alt="Savignac" width={500} height={47} priority className="h-auto w-[84vw] max-w-[440px]" />
          <p className="label mt-10 text-mute">Présentation réservée</p>
          <p className="lyric mt-4 max-w-[22ch]">Le nouveau site de la Maison, avant son ouverture.</p>
          <form method="post" action="/api/acces" className="mt-10 w-full max-w-[360px] text-left">
            <input type="hidden" name="retour" value={retour ?? '/'} />
            <label htmlFor="motdepasse" className="label block">
              Mot de passe
            </label>
            <input id="motdepasse" name="motdepasse" type="password" required autoFocus autoComplete="current-password" className="field" aria-describedby={erreur ? 'erreur' : undefined} />
            {erreur ? (
              <p id="erreur" role="alert" className="caption mt-3 text-fg">
                Ce mot de passe n’ouvre pas la porte. Essayez encore.
              </p>
            ) : null}
            <button type="submit" className="btn btn-block mt-8">
              <span>Entrer</span>
            </button>
          </form>
        </main>
  );
}
