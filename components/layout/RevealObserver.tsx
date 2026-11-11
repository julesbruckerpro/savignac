'use client';
import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

/**
 * Apparitions au défilement : tout élément [data-reveal] ou [data-curtain] reçoit .is-in
 * quand 15 % est visible, une seule fois par chargement.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -4% 0px' },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in), [data-curtain]:not(.is-in)').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
