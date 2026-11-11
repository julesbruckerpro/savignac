import type { ReactNode } from 'react';
import { PageIntro } from '@/components/editorial/PageIntro';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb';
import { rich } from '@/lib/typo';

/** Page en accordéons (entretien, livraison). */
export function AccordionPage({ crumbs, title, intro, items, children }: { crumbs: Crumb[]; title: string; intro: string; items: { title: string; text: string[] }[]; children?: ReactNode }) {
  return (
    <>
      <Breadcrumb items={crumbs} />
      <PageIntro title={title} text={intro} />
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Accordion>
              {items.map((it, i) => (
                <AccordionItem key={it.title} title={it.title} defaultOpen={i === 0}>
                  {it.text.map((p, j) => (
                    <p key={j} className={`text ${j > 0 ? 'mt-4' : ''}`}>
                      {rich(p)}
                    </p>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">{children}</div>
        </div>
      </section>
    </>
  );
}

interface LegalDoc {
  title: string;
  blocks: { type: string; text?: string; items?: string[]; id?: string }[];
}

/** Pages légales : texte intégral du site actuel, mis en page ; sommaire ancré à gauche sur desktop. */
export function LegalPage({ doc, crumb }: { doc: LegalDoc; crumb: string }) {
  const blocks = doc.blocks.filter((b, i) => !(i === 0 && (b.type === 'h2' || b.type === 'h3') && b.text?.toLowerCase() === doc.title.toLowerCase()));
  const toc = blocks.filter((b) => (b.type === 'h2' || b.type === 'h3') && b.id);
  return (
    <>
      <Breadcrumb items={[{ label: crumb }]} />
      <PageIntro title={`${doc.title}.`} h1Class="title is-46" />
      <section className="wrap section-bottom">
        <div className="grid grid-cols-1 gap-x-8 border-t border-rule-strong pt-10 lg:grid-cols-12">
          {toc.length > 2 ? (
            <nav aria-label="Sommaire" className="hidden lg:col-span-3 lg:block">
              <ol className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-1 overflow-y-auto pr-4" data-lenis-prevent>
                {toc.map((b) => (
                  <li key={b.id}>
                    <a href={`#${b.id}`} className="label-sm inline-flex min-h-8 items-center leading-snug text-mute hover:text-fg">
                      <span className="lu">{b.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div className={`prose text-[16px] ${toc.length > 2 ? 'lg:col-span-8 lg:col-start-5' : 'lg:col-span-8'}`}>
            {blocks.map((b, i) => {
              if (b.type === 'h2' || b.type === 'h3')
                return (
                  <h2 key={i} id={b.id} className="label mb-4 mt-12 scroll-mt-28 leading-relaxed first:mt-0">
                    {b.text}
                  </h2>
                );
              if (b.type === 'ul')
                return (
                  <ul key={i}>
                    {b.items?.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              return <p key={i}>{b.text}</p>;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
