import type { ReactNode } from "react";

// Bloques de prosa para los artículos del blog. Tipografía consistente
// sin depender de un procesador de Markdown ni del plugin typography.

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[15px] leading-[1.75] text-muted">{children}</p>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 text-xl font-extrabold tracking-tight text-ink">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-7 text-[16px] font-bold text-ink">{children}</h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 space-y-2">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.7] text-muted">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
      <span>{children}</span>
    </li>
  );
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 border-volt pl-4 text-[16px] font-medium italic leading-relaxed text-ink">
      {children}
    </blockquote>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-ink">{children}</strong>;
}

/** Fórmula destacada (mono, fondo sutil). */
export function Formula({ children }: { children: ReactNode }) {
  return (
    <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-raised p-4 font-mono text-[13px] leading-relaxed text-ink">
      {children}
    </pre>
  );
}
