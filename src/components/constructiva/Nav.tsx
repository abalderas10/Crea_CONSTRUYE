"use client";

import Link from "next/link";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#construccion", label: "Construcción" },
  { href: "#mantenimiento", label: "Mantenimiento" },
  { href: "#contacto", label: "Contacto" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cc-line)] bg-[var(--cc-base)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[var(--cc-muted)] transition-colors hover:text-[var(--cc-text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="rounded-md bg-[var(--cc-lime)] px-4 py-2 text-[13px] font-extrabold text-[var(--cc-base)] transition-colors hover:bg-[var(--cc-lime-sub)]"
        >
          Solicitar →
        </a>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/constructiva" className="flex items-center gap-2.5" aria-label="Constructiva">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--cc-lime)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16181F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
        </svg>
      </span>
      <span className="text-[15px] font-extrabold tracking-tight text-[var(--cc-text)]">
        Constructiva
      </span>
    </Link>
  );
}
