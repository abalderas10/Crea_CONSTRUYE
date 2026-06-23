import Link from "next/link";
import { ConstructivaMark, ConstructivaWordmark } from "./Mark";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cc-line)] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <ConstructivaMark size={24} variant="carbon" />
          <ConstructivaWordmark className="text-[14px] text-[var(--cc-text)]" />
        </div>

        <p className="text-[12px] text-[var(--cc-muted)]">
          una constructora de{" "}
          <Link href="/" className="font-semibold text-[var(--cc-text)] hover:text-[var(--cc-lime)]">
            crea<span className="text-[var(--cc-lime)]">Construye</span>
          </Link>
          {" · "}© {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
