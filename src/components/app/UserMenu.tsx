"use client";

import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import type { AppUser } from "@/lib/auth";

export function UserMenu({
  user,
  configHref,
}: {
  user: AppUser;
  configHref?: string;
}) {
  return (
    <details className="group relative">
      <summary className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-full bg-violet text-[11px] font-bold text-white">
        {user.initials}
      </summary>
      <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-line bg-raised p-1.5 shadow-card">
        <div className="px-2.5 py-2">
          <div className="text-[13px] font-semibold text-ink">{user.name}</div>
          <div className="truncate text-[11px] text-faint">{user.email}</div>
        </div>
        <div className="my-1 h-px bg-line" />
        {configHref && (
          <Link
            href={configHref}
            className="block rounded-md px-2.5 py-2 text-[13px] text-muted hover:bg-hover hover:text-ink"
          >
            Configuración
          </Link>
        )}
        <form action={signOut}>
          <button className="w-full rounded-md px-2.5 py-2 text-left text-[13px] text-danger hover:bg-hover">
            Cerrar sesión
          </button>
        </form>
      </div>
    </details>
  );
}
