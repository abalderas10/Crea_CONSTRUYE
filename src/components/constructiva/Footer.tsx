import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cc-line)] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--cc-lime)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16181F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
            </svg>
          </span>
          <span className="text-[14px] font-extrabold text-[var(--cc-text)]">
            Constructiva
          </span>
        </div>

        <p className="text-[12px] text-[var(--cc-muted)]">
          Una división de{" "}
          <Link href="/" className="font-semibold text-[var(--cc-text)] hover:text-[var(--cc-lime)]">
            creaConstruye
          </Link>
          . © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
