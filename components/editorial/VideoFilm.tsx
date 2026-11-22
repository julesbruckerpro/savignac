'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Le film de la Maison : lecture en boucle sans le son à l'arrivée (chargée seulement quand le cadre
 * entre à l'écran), bouton « VOIR LE FILM » qui relance avec le son et les contrôles.
 * Images en noir et blanc tant que le film définitif n'est pas fourni.
 */
export function VideoFilm({ src, poster, label = 'Voir le film' }: { src: string; poster: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [withSound, setWithSound] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          if (!reduce) node.play().catch(() => undefined);
        } else if (!withSound) node.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [withSound]);

  function play() {
    const node = ref.current;
    if (!node) return;
    setLoad(true);
    setWithSound(true);
    node.muted = false;
    node.loop = false;
    node.currentTime = 0;
    node.play().catch(() => undefined);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink">
      <video ref={ref} className="bw h-full w-full object-cover" poster={poster} muted loop playsInline preload="none" controls={withSound} aria-label="Film de présentation de la Coutellerie Savignac">
        {load ? <source src={src} type="video/mp4" /> : null}
      </video>
      {!withSound ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 md:pb-10">
          <button type="button" onClick={play} className="btn theme-light !border-paper !bg-paper !text-ink">
            <span>{label}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
