import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/ui";
import { UserMenu } from "@/components/app/UserMenu";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-base">
      <header className="sticky top-0 z-40 flex h-12 items-center gap-4 border-b border-line bg-surface px-4">
        <Logo size={24} withWordmark={false} />
        <span className="rounded-sm bg-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-sub">
          Admin
        </span>
        <nav className="flex items-center gap-1">
          <AdminLink href="/app/admin">Dashboard</AdminLink>
          <AdminLink href="/app/admin/herramientas">Herramientas</AdminLink>
          <AdminLink href="/app/admin/leads">Leads</AdminLink>
        </nav>
        <div className="ml-auto">
          <UserMenu user={user} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8">{children}</main>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:bg-hover hover:text-ink"
    >
      {children}
    </Link>
  );
}
