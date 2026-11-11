'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const SUBJECTS = [
  ['question', 'Question sur un couteau'],
  ['sur-mesure', 'Pièce sur mesure'],
  ['gravure', 'Gravure'],
  ['affutage', 'Affûtage et réparation'],
  ['revendeurs', 'Revendeurs et professionnels'],
  ['presse', 'Presse'],
  ['autre', 'Autre'],
] as const;

const schema = z.object({
  nom: z.string().trim().min(2, 'Indiquez votre nom.'),
  courriel: z.string().trim().email('Indiquez une adresse de courriel valide.'),
  telephone: z.string().trim().max(30).optional(),
  objet: z.enum(SUBJECTS.map((s) => s[0]) as [string, ...string[]]),
  message: z.string().trim().min(10, 'Écrivez-nous quelques mots de plus.'),
});
type Errors = Partial<Record<'nom' | 'courriel' | 'telephone' | 'objet' | 'message', string>>;

/** Formulaire de contact : validation côté client, envoi simulé en démonstration (aucune donnée transmise). */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState('question');

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('objet');
    if (wanted && SUBJECTS.some((s) => s[0] === wanted)) setSubject(wanted);
  }, []);

  if (sent) {
    return (
      <div role="status" className="border-y border-rule-strong py-14 text-center">
        <p className="lyric">Merci. Votre message est bien parti vers Foix.</p>
        <p className="caption mt-4">Démonstration : aucun message n’est réellement envoyé.</p>
      </div>
    );
  }
  const field = (name: keyof Errors) => ({ 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `err-${name}` : undefined });
  const error = (name: keyof Errors) =>
    errors[name] ? (
      <p id={`err-${name}`} role="alert" className="mt-2 text-[14px] italic">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const parsed = schema.safeParse(data);
        if (!parsed.success) {
          const next: Errors = {};
          for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] ??= issue.message;
          setErrors(next);
          const first = Object.keys(next)[0];
          (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
          return;
        }
        setErrors({});
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="nom" className="label">
            Nom
          </label>
          <input id="nom" name="nom" type="text" autoComplete="name" required className="field" {...field('nom')} />
          {error('nom')}
        </div>
        <div>
          <label htmlFor="courriel" className="label">
            Courriel
          </label>
          <input id="courriel" name="courriel" type="email" autoComplete="email" required className="field" {...field('courriel')} />
          {error('courriel')}
        </div>
        <div>
          <label htmlFor="telephone" className="label">
            Téléphone <span className="text-mute">· facultatif</span>
          </label>
          <input id="telephone" name="telephone" type="tel" autoComplete="tel" className="field" />
        </div>
        <div>
          <label htmlFor="objet" className="label">
            Objet
          </label>
          <select id="objet" name="objet" value={subject} onChange={(e) => setSubject(e.target.value)} className="field cursor-pointer bg-bg">
            {SUBJECTS.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className="field resize-y" {...field('message')} />
        {error('message')}
      </div>
      <button type="submit" className="btn">
        <span>Envoyer</span>
      </button>
    </form>
  );
}
