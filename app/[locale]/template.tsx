import type { ReactNode } from 'react';

/** Transition entre pages : le contenu entrant apparaît en fondu (350 ms), sans rideau ni glissement. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
