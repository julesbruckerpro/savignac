import type { ReactNode } from 'react';
import '../globals.css';
import { caslon, jost } from '@/lib/fonts';

export default function AccesLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${caslon.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
