'use client';
import { useRef, type ReactNode } from 'react';
import { useDialog } from '@/lib/use-dialog';

/** Panneau latéral droit : 420 px sur desktop, plein écran sur mobile. Jamais de pop-up centrée. */
export function Drawer({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
  side = 'right',
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, onClose, ref);
  const hidden = side === 'right' ? 'translate-x-full' : '-translate-x-full';
  return (
    <div className={`fixed inset-0 z-[120] ${open ? '' : 'pointer-events-none'}`} inert={!open}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-lenis-prevent
        className={`theme-light absolute top-0 flex h-dvh w-full flex-col transition-transform duration-500 ease-house ${
          wide ? 'sm:w-[520px]' : 'sm:w-[420px]'
        } ${side === 'right' ? 'right-0 sm:border-l' : 'left-0 sm:border-r'} border-ink ${open ? 'translate-x-0' : hidden}`}
      >
        <div className="flex h-16 flex-none items-center justify-between border-b border-ink px-6">
          <p className="label">{title}</p>
          <button type="button" onClick={onClose} className="label -mr-3 flex min-h-11 items-center px-3">
            <span className="lu">{closeLabel}</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6">{children}</div>
        {footer ? <div className="flex-none border-t border-ink px-6 py-5">{footer}</div> : null}
      </div>
    </div>
  );
}
