"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui";
import { TOOLS } from "@/lib/tools";
import { TOOL_ICONS } from "@/components/icons/ToolIcons";
import { UserMenu } from "@/components/app/UserMenu";
import type { AppUser } from "@/lib/auth";
import type { Project, ToolStatus, ToolStatusMap } from "@/lib/data/projects";

const STATUS_DOT: Record<ToolStatus, string> = {
  done: "var(--color-volt)",
  in_progress: "var(--color-violet)",
  empty: "var(--color-line)",
};

export function AppShell({
  user,
  projects,
  project,
  statuses,
  children,
}: {
  user: AppUser;
  projects: Project[];
  project: Project;
  statuses: ToolStatusMap;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const done = Object.values(statuses).filter((s) => s === "done").length;

  return (
    <div className="flex min-h-screen flex-col bg-base">
      <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-line bg-surface px-4">
        <Logo size={22} withWordmark={false} />
        <ProjectSwitcher projects={projects} active={project} statuses={statuses} />
        <div className="ml-auto flex items-center gap-2">
          <button
            className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-hover"
            aria-label="Notificaciones"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <UserMenu user={user} configHref={`/app/${project.id}/config`} />
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar pathname={pathname} project={project} statuses={statuses} done={done} />
        <main className="flex-1 overflow-x-hidden px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* ── Project switcher ───────────────────────────────────────────── */
function ProjectSwitcher({
  projects,
  active,
  statuses,
}: {
  projects: Project[];
  active: Project;
  statuses: ToolStatusMap;
}) {
  const router = useRouter();
  const activeDone = Object.values(statuses).filter((s) => s === "done").length;

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-line bg-base px-3 py-1.5 text-[13px] hover:bg-hover">
        <span className="font-semibold text-ink">{active.name}</span>
        <span className="text-faint">▾</span>
        <span className="ml-1 rounded-sm bg-success/15 px-1.5 py-0.5 text-[10px] font-bold text-success">
          {activeDone}/8
        </span>
      </summary>
      <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-line bg-raised p-1.5 shadow-card">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => router.push(`/app/${p.id}`)}
            className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-hover ${
              p.id === active.id ? "bg-hover" : ""
            }`}
          >
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-ink">{p.name}</div>
              {p.municipio && (
                <div className="text-[11px] text-faint">{p.municipio}</div>
              )}
            </div>
          </button>
        ))}
        <div className="my-1 h-px bg-line" />
        <Link
          href="/app/nuevo"
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] font-semibold text-volt hover:bg-hover"
        >
          <span className="text-base leading-none">+</span> Nuevo proyecto
        </Link>
      </div>
    </details>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({
  pathname,
  project,
  statuses,
  done,
}: {
  pathname: string;
  project: Project;
  statuses: ToolStatusMap;
  done: number;
}) {
  const base = `/app/${project.id}`;
  return (
    <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 flex-col border-r border-line bg-surface p-3 md:flex">
      <nav className="flex-1 overflow-y-auto">
        <NavItem href={base} pathname={pathname} exact label="Dashboard" icon={<GridIcon />} />

        <SectionLabel>Herramientas</SectionLabel>
        {TOOLS.map((t) => {
          const Icon = TOOL_ICONS[t.id];
          return (
            <NavItem
              key={t.id}
              href={`${base}/${t.id}`}
              pathname={pathname}
              label={t.name}
              icon={<Icon size={16} />}
              trailing={
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: STATUS_DOT[statuses[t.id]] }}
                />
              }
            />
          );
        })}

        <SectionLabel>Proyecto</SectionLabel>
        <NavItem href={`${base}/reportes`} pathname={pathname} label="Reportes" icon={<DocIcon />} />
        <NavItem href={`${base}/config`} pathname={pathname} label="Configuración" icon={<GearIcon />} />

        <SectionLabel>Comunidad</SectionLabel>
        <NavItem href="/app/herramientas" pathname={pathname} label="Herramientas" icon={<ToolboxIcon />} />
        <NavItem href="/legal" pathname={pathname} label="Legal" icon={<ScaleIcon />} />
      </nav>

      <div className="rounded-lg border border-line bg-raised p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.1em] text-faint">Progreso</span>
          <span className="tabular text-[11px] font-bold text-volt">{done}/8</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-volt transition-all" style={{ width: `${(done / 8) * 100}%` }} />
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
  const active = exact ? pathname === href : pathname === href;
  return (
    <Link
      href={href}
      className={`mb-0.5 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
        active
          ? "bg-violet/15 font-semibold text-ink [border-left:2px_solid_var(--color-violet)]"
          : "text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <span className={active ? "text-violet-sub" : "text-faint"}>{icon}</span>
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
function ScaleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M6 21h12M3 7h18M7 7l-3 7h6zM17 7l-3 7h6z" />
    </svg>
  );
}
function ToolboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 9.5A2 2 0 014.5 8h15a2 2 0 012 1.5L21 19a2 2 0 01-2 1.5H5A2 2 0 013 19z" />
      <path d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <path d="M2.5 13h19" />
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
