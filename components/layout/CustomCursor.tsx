'use client';
import { useEffect, useRef } from 'react';

/**
 * Curseur personnalisé (desktop) : point de 8 px avec retard, cercle de 40 px sur les liens,
 * disque « VOIR » sur les photos produits. Coupé sur tactile et en mouvement réduit.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = ref.current;
    if (!fine || reduce || !node) return;

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    let started = false;

    const state = (target: EventTarget | null): string => {
      const el = target instanceof Element ? target : null;
      if (!el) return 'dot';
      if (el.closest('input, textarea, select, [contenteditable], iframe, .maplibregl-map')) return 'hidden';
      if (el.closest('[data-cursor="voir"]')) return 'voir';
      if (el.closest('a, button, [role="button"], label, summary')) return 'link';
      return 'dot';
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!started) {
        started = true;
        cx = x;
        cy = y;
        document.documentElement.classList.add('has-cursor');
      }
      node.dataset.state = state(e.target);
    };
    const onLeave = () => (node.dataset.state = 'hidden');
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-state="hidden" aria-hidden="true">
      <div className="cursor-dot">
        <span className="cursor-word label-sm">Voir</span>
      </div>
    </div>
  );
}
