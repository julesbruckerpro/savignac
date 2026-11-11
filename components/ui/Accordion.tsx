'use client';
import { useId, useState, type ReactNode } from 'react';

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  titleClassName = 'label',
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-rule">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[60px] w-full items-center justify-between gap-6 py-4 text-left"
        >
          <span className={titleClassName}>{title}</span>
          <span className="plus" aria-hidden="true" />
        </button>
      </h3>
      <div id={id} className="acc-panel" data-open={open} inert={!open}>
        <div>
          <div className="pb-8 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-rule-strong">{children}</div>;
}
