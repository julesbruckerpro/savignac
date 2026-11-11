'use client';
import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';

/** Défilement amorti (Lenis), coupé sur écran tactile et si l'utilisateur réduit les animations. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduce || touch) return;
    let raf = 0;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { scrollTo(y: number, o: { immediate: boolean }): void } }).__lenis;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
