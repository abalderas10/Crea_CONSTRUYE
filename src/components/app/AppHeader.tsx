import Link from "next/link";
import { Logo } from "@/components/ui";
import { UserMenu } from "@/components/app/UserMenu";
import type { AppUser } from "@/lib/auth";

/** Header ligero (logo + nav + usuario) para páginas sin proyecto activo. */
export function AppHeader({ user }: { user: AppUser }) {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-4 border-b border-line bg-surface px-4">
      <Logo size={24} withWordmark={false} />
      <nav className="flex items-center gap-1">
        <NavLink href="/app">Proyectos</NavLink>
        <NavLink href="/app/herramientas">Herramientas</NavLink>
        {user.isAdmin && <NavLink href="/app/admin">Admin</NavLink>}
      </nav>
      <div className="ml-auto">
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:bg-hover hover:text-ink"
    >
      {children}
    </Link>
  );
}
