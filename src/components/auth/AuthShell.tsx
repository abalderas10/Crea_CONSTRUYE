import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca (oculto en móvil) */}
      <div className="relative hidden overflow-hidden border-r border-line bg-surface/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "radial-gradient(circle, #C8FF00 0%, transparent 70%)" }}
        />
        <Logo size={32} />
        <div className="relative">
          <p className="max-w-sm text-2xl font-extrabold leading-tight tracking-tight">
            La proforma inmobiliaria que trabaja{" "}
            <span className="text-volt">mientras tú duermes.</span>
          </p>
          <div className="mt-8 max-w-sm">
            <DashboardPreview />
          </div>
        </div>
        <p className="relative text-xs text-faint">Hecho en México 🇲🇽</p>
      </div>

      {/* Panel de formulario */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size={30} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-muted">{footer}</p>

          <Link
            href="/"
            className="mt-8 inline-block text-xs text-faint transition-colors hover:text-muted"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
