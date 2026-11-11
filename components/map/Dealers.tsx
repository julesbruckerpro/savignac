'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface DealerPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  department: string;
  departmentCode: string;
  country: string;
  phone?: string;
  url?: string;
  lat?: number;
  lng?: number;
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const HEART =
  '<span style="display:block;width:16px;height:15px;background:var(--ink);-webkit-mask:url(/images/logo/savignac-coeur-noir.svg) center/contain no-repeat;mask:url(/images/logo/savignac-coeur-noir.svg) center/contain no-repeat"></span>';

/**
 * Carte monochrome (MapLibre, tuiles OpenStreetMap passées en niveaux de gris) et liste par département.
 * Au lancement : brancher un fond de carte sous contrat (clé d'API) à la place des tuiles communautaires.
 */
export function Dealers({ dealers }: { dealers: DealerPoint[] }) {
  const container = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const selectFromMap = useRef<(id: string) => void>(() => undefined);

  const located = useMemo(() => dealers.filter((d) => d.lat !== undefined && d.lng !== undefined), [dealers]);
  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return dealers;
    return dealers.filter((d) => fold(`${d.city} ${d.postalCode} ${d.department} ${d.name}`).includes(q));
  }, [dealers, query]);
  const groups = useMemo(() => {
    const map = new Map<string, DealerPoint[]>();
    for (const d of filtered) map.set(d.departmentCode, [...(map.get(d.departmentCode) ?? []), d]);
    return [...map.entries()].sort(([a], [b]) => (a === 'BE' ? 1 : b === 'BE' ? -1 : a.localeCompare(b)));
  }, [filtered]);

  selectFromMap.current = (id: string) => {
    setQuery('');
    setSelected(id);
    window.setTimeout(() => {
      const row = listRef.current?.querySelector<HTMLElement>(`[data-dealer="${id}"]`);
      const list = listRef.current;
      if (!row || !list) return;
      if (list.scrollHeight > list.clientHeight + 4) list.scrollTo({ top: row.offsetTop - list.offsetTop - 16, behavior: 'smooth' });
      else row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  // la carte est chargée à la demande, quand elle approche de l'écran
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const [{ default: maplibregl }, { default: Supercluster }] = await Promise.all([import('maplibre-gl'), import('supercluster')]);
        if (cancelled) return;
        const map = new maplibregl.Map({
          container: node,
          style: {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                maxzoom: 19,
                attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">les contributeurs d’OpenStreetMap</a>',
              },
            },
            layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
          },
          center: [2.3, 46.4],
          zoom: 4.6,
          minZoom: 3,
          maxZoom: 17,
          attributionControl: { compact: false },
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        mapRef.current = map;

        const index = new Supercluster<{ id: string; name: string }>({ radius: 46, maxZoom: 12 });
        index.load(located.map((d) => ({ type: 'Feature' as const, properties: { id: d.id, name: `${d.name}, ${d.city}` }, geometry: { type: 'Point' as const, coordinates: [d.lng!, d.lat!] } })));
        let markers: Marker[] = [];
        const draw = () => {
          markers.forEach((m) => m.remove());
          markers = [];
          const b = map.getBounds();
          for (const f of index.getClusters([b.getWest() - 1, b.getSouth() - 1, b.getEast() + 1, b.getNorth() + 1], Math.round(map.getZoom()))) {
            const [lng, lat] = f.geometry.coordinates;
            const el = document.createElement('button');
            el.type = 'button';
            const props = f.properties as { cluster?: boolean; point_count?: number; cluster_id?: number; id?: string; name?: string };
            if (props.cluster) {
              el.setAttribute('aria-label', `${props.point_count} revendeurs : zoomer`);
              el.style.cssText = `width:${props.point_count! > 9 ? 38 : 32}px;height:${props.point_count! > 9 ? 38 : 32}px;border-radius:50% !important;background:var(--ink);color:var(--paper);font:500 12px/1 var(--font-jost),sans-serif;letter-spacing:.04em;display:grid;place-items:center;cursor:pointer`;
              el.style.setProperty('border-radius', '50%', 'important');
              el.textContent = String(props.point_count);
              el.addEventListener('click', () => map.easeTo({ center: [lng, lat], zoom: Math.min(index.getClusterExpansionZoom(props.cluster_id!), 15) }));
            } else {
              el.setAttribute('aria-label', props.name ?? '');
              el.style.cssText = 'width:36px;height:36px;display:grid;place-items:center;cursor:pointer';
              el.innerHTML = HEART;
              el.addEventListener('click', () => selectFromMap.current(props.id!));
            }
            markers.push(new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
          }
        };
        map.on('load', () => {
          setReady(true);
          draw();
        });
        map.on('moveend', draw);
        cleanup = () => {
          markers.forEach((m) => m.remove());
          map.remove();
          mapRef.current = null;
        };
      },
      { rootMargin: '300px' },
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, [located]);

  const focus = useCallback((d: DealerPoint) => {
    setSelected(d.id);
    if (d.lat === undefined || d.lng === undefined) return;
    mapRef.current?.flyTo({ center: [d.lng, d.lat], zoom: 14, essential: true });
    if (window.matchMedia('(max-width: 1023px)').matches) container.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // la recherche recadre la carte sur les résultats
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !query.trim()) return;
    const pts = filtered.filter((d) => d.lat !== undefined && d.lng !== undefined);
    if (pts.length === 0) return;
    const lngs = pts.map((d) => d.lng!);
    const lats = pts.map((d) => d.lat!);
    map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 70, maxZoom: 13, duration: 800 });
  }, [filtered, query, ready]);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <div ref={container} className="dealers-map h-[62vh] min-h-[360px] w-full scroll-mt-20 border border-rule-strong bg-white lg:h-[calc(100vh-140px)] lg:max-h-[760px]" role="region" aria-label="Carte des revendeurs" />
        </div>
      </div>
      <div className="lg:col-span-5">
        <label htmlFor="recherche-revendeur" className="label">
          Ville ou code postal
        </label>
        <input id="recherche-revendeur" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Toulouse, 75, Bruxelles…" autoComplete="off" className="field" />
        <p className="label-sm mt-3 text-mute" aria-live="polite">
          {filtered.length} {filtered.length > 1 ? 'adresses' : 'adresse'}
        </p>
        <div ref={listRef} data-lenis-prevent className="relative mt-4 border-t border-rule-strong lg:max-h-[640px] lg:overflow-y-auto lg:pr-3">
          {groups.length === 0 ? <p className="caption py-8">Aucun revendeur ne correspond à cette recherche.</p> : null}
          {groups.map(([code, items]) => (
            <section key={code} className="border-b border-rule pb-4 pt-5">
              <h3 className="label text-mute">
                {items[0].department}
                {code !== 'BE' ? ` · ${code}` : ''}
              </h3>
              <ul className="mt-2">
                {items.map((d) => (
                  <li key={d.id} data-dealer={d.id}>
                    <button type="button" onClick={() => focus(d)} aria-pressed={selected === d.id} className={`group block w-full py-3 text-left ${selected === d.id ? 'border-l-2 border-rule-strong pl-4' : 'border-l-2 border-transparent'}`}>
                      <span className="block text-[16px] leading-snug">
                        <span className="lu lu-group">{d.name}</span>
                      </span>
                      <span className="mt-1 block text-[14px] leading-snug text-mute">
                        {d.address ? `${d.address}, ` : ''}
                        {d.postalCode} {d.city}
                      </span>
                    </button>
                    {selected === d.id && (d.phone || d.url) ? (
                      <p className="flex flex-wrap gap-x-5 pb-3 pl-[18px] text-[14px] text-soft">
                        {d.phone ? (
                          <a href={`tel:${d.phone.replace(/\s/g, '')}`} className="link">
                            {d.phone}
                          </a>
                        ) : null}
                        {d.url ? (
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="link">
                            Site du revendeur
                          </a>
                        ) : null}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
