'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';

/** Compte de démonstration : la connexion est simulée, aucune donnée n'est envoyée ni conservée. */
export function AccountDemo() {
  const [email, setEmail] = useState('');
  const [logged, setLogged] = useState(false);

  if (logged) {
    return (
      <section className="wrap section-bottom pt-10 md:pt-16">
        <p className="label text-mute">Mon compte · démonstration</p>
        <h1 className="title is-46 mt-4">Bonjour.</h1>
        <p className="caption mt-3">{email}</p>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          <div className="border-t border-rule-strong pt-6">
            <h2 className="label">Mes commandes</h2>
            <p className="text mt-5">Aucune commande pour l’instant.</p>
            <Link href="/couteaux" className="label mt-5 inline-flex min-h-11 items-center">
              <span className="lu is-on">Choisir son couteau</span>
            </Link>
          </div>
          <div className="border-t border-rule-strong pt-6">
            <h2 className="label">Mes adresses</h2>
            <p className="text mt-5">Aucune adresse enregistrée.</p>
          </div>
        </div>
        <button type="button" onClick={() => setLogged(false)} className="label mt-12 min-h-11 text-mute">
          <span className="lu is-on">Se déconnecter</span>
        </button>
      </section>
    );
  }
  return (
    <section className="wrap section-bottom pt-10 md:pt-16">
      <div className="mx-auto max-w-[440px]">
        <p className="label text-mute">Mon compte</p>
        <h1 className="title is-46 mt-4">Se connecter.</h1>
        <form
          className="mt-10 space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            setLogged(true);
          }}
        >
          <div>
            <label htmlFor="compte-courriel" className="label">
              Courriel
            </label>
            <input id="compte-courriel" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="compte-mdp" className="label">
              Mot de passe
            </label>
            <input id="compte-mdp" type="password" required autoComplete="current-password" className="field" />
          </div>
          <button type="submit" className="btn btn-block">
            <span>Se connecter</span>
          </button>
          <p className="caption text-center">Démonstration : la connexion est simulée, rien n’est enregistré.</p>
        </form>
      </div>
    </section>
  );
}
