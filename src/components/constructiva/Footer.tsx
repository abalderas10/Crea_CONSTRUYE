import Link from "next/link";
import { ConstructivaMark, ConstructivaWordmark } from "./Mark";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cc-line)] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <ConstructivaMark size={28} variant="carbon" />
          <div className="flex flex-col items-end">
            <ConstructivaWordmark className="text-[15px] leading-none text-[var(--cc-text)]" />
            <Link
              href="/"
              className="mt-0.5 text-[10px] leading-none text-[var(--cc-muted)] hover:text-[var(--cc-lime)]"
            >
              crea<span className="font-semibold text-[var(--cc-text)]">Construye</span>
            </Link>
          </div>
        </div>

        <p className="text-[12px] text-[var(--cc-muted)]">
          © {new Date().getFullYear()} Constructiva
        </p>
      </div>
    </footer>
  );
}
