"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui";
import { TOOLS } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";
import {
  type DemoProject,
  type ToolStatus,
  completedCount,
} from "@/lib/projects";
import { signOut } from "@/app/auth/actions";
import type { AppUser } from "@/lib/auth";

const STATUS_DOT: Record<ToolStatus, string> = {
  done: "var(--color-volt)",
  in_progress: "var(--color-violet)",
  empty: "var(--color-line)",
};

export function AppShell({
  user,
  projects,
  children,
}: {
  user: AppUser;
  projects: DemoProject[];
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const pathname = usePathname();
  const done = active ? completedCount(active) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Topbar
        user={user}
        projects={projects}
        active={active}
        onSelect={setActiveId}
      />
      <div className="flex flex-1">
        <Sidebar pathname={pathname} project={active} done={done} />
        <main className="flex-1 overflow-x-hidden px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* ── Topbar ─────────────────────────────────────────────────────── */
function Topbar({
  user,
  projects,
  active,
  onSelect,
}: {
  user: AppUser;
  projects: DemoProject[];
  active?: DemoProject;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-line bg-surface px-4">
      <Logo size={24} withWordmark={false} />

      {/* Project switcher */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-line bg-base px-3 py-1.5 text-[13px] hover:bg-hover"
        >
          <span className="font-semibold text-ink">
            {active?.name ?? "Sin proyecto"}
          </span>
          <span className="text-faint">▾</span>
          {active && (
            <span className="ml-1 rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
              {completedCount(active)}/8
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-line bg-raised p-1.5 shadow-card">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-hover ${
                    p.id === active?.id ? "bg-hover" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-ink">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-faint">{p.municipio}</div>
                  </div>
                  <span className="rounded-sm bg-base px-1.5 py-0.5 text-[10px] font-bold text-muted">
                    {completedCount(p)}/8
                  </span>
                </button>
              ))}
              <div className="my-1 h-px bg-line" />
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] font-semibold text-volt hover:bg-hover">
                <span className="text-base leading-none">+</span> Nuevo proyecto
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {user.demo && (
          <span className="hidden rounded-sm border border-warning/30 bg-warning/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-warning sm:inline">
            Demo · sin Supabase
          </span>
        )}
        <button
          className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-hover"
          aria-label="Notificaciones"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Avatar + menu */}
        <div className="relative">
          <button
            onClick={() => setMenu((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-full bg-violet text-[11px] font-bold text-white"
          >
            {user.initials}
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border border-line bg-raised p-1.5 shadow-card">
                <div className="px-2.5 py-2">
                  <div className="text-[13px] font-semibold text-ink">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-faint">{user.email}</div>
                </div>
                <div className="my-1 h-px bg-line" />
                <Link
                  href="/app/config"
                  onClick={() => setMenu(false)}
                  className="block rounded-md px-2.5 py-2 text-[13px] text-muted hover:bg-hover hover:text-ink"
                >
                  Configuración
                </Link>
                <form action={signOut}>
                  <button className="w-full rounded-md px-2.5 py-2 text-left text-[13px] text-danger hover:bg-hover">
                    Cerrar sesión
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({
  pathname,
  project,
  done,
}: {
  pathname: string;
  project?: DemoProject;
  done: number;
}) {
  return (
    <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 flex-col border-r border-line bg-surface p-3 md:flex">
      <nav className="flex-1 overflow-y-auto">
        <NavItem href="/app" pathname={pathname} exact label="Dashboard" icon={<GridIcon />} />

        <SectionLabel>Herramientas</SectionLabel>
        {TOOLS.map((t) => {
          const Icon = TOOL_ICONS[t.id];
          const status = project?.toolStatus[t.id] ?? "empty";
          return (
            <NavItem
              key={t.id}
              href={`/app/${t.id}`}
              pathname={pathname}
              label={t.name}
              icon={<Icon size={16} />}
              trailing={
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: STATUS_DOT[status] }}
                />
              }
            />
          );
        })}

        <SectionLabel>Proyecto</SectionLabel>
        <NavItem href="/app/reportes" pathname={pathname} label="Reportes" icon={<DocIcon />} />
        <NavItem href="/app/config" pathname={pathname} label="Configuración" icon={<GearIcon />} />
      </nav>

      {/* Progress */}
      <div className="rounded-lg border border-line bg-raised p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
            Progreso
          </span>
          <span className="tabular text-[11px] font-bold text-volt">{done}/8</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-volt transition-all"
            style={{ width: `${(done / 8) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  pathname,
  label,
  icon,
  trailing,
  exact,
}: {
  href: string;
  pathname: string;
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
  exact?: boolean;
}) {
  const activeRoute = exact ? pathname === href : pathname === href;
  return (
    <Link
      href={href}
      className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
        activeRoute
          ? "bg-violet/15 font-semibold text-ink [border-left:2px_solid_var(--color-violet)]"
          : "text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <span className={activeRoute ? "text-violet-sub" : "text-faint"}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {trailing}
    </Link>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 mt-4 px-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-faint">
      {children}
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
