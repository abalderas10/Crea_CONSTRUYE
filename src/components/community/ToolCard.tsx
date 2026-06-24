import type { ReactNode } from "react";
import Link from "next/link";
import { RigorBadge } from "@/components/community/RigorBadge";
import type { RigorLevel } from "@/lib/community/rigor";

export function ToolCard({
  name,
  description,
  color,
  feeds,
  normatividad,
  rigor,
  available,
  footer,
  href,
}: {
  name: string;
  description: string;
  color: string;
  feeds?: string[];
  normatividad?: string;
  rigor?: RigorLevel;
  available?: boolean;
  footer?: ReactNode;
  href?: string;
}) {
  const Wrapper = href
    ? ({ children }: { children: ReactNode }) => (
        <Link
          href={href}
          className="flex flex-col rounded-xl border border-line bg-raised p-4 transition-colors hover:border-faint"
        >
          {children}
        </Link>
      )
    : ({ children }: { children: ReactNode }) => (
        <div className="flex flex-col rounded-xl border border-line bg-raised p-4 transition-colors hover:border-faint">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg text-[15px] font-extrabold"
            style={{ background: `${color}18`, color }}
          >
            {name.charAt(0)}
          </span>
          <h3 className="text-[14px] font-bold leading-tight text-ink">
            {name}
          </h3>
        </div>
        {available ? (
          <span className="shrink-0 rounded-sm bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
            Disponible
          </span>
        ) : (
          <span className="shrink-0 rounded-sm bg-line/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">
            Por crear
          </span>
        )}
      </div>

      <p className="mt-2.5 flex-1 text-[12.5px] leading-relaxed text-muted">
        {description}
      </p>

      {rigor && rigor !== "borrador" && (
        <div className="mt-3">
          <RigorBadge level={rigor} />
        </div>
      )}

      {feeds && feeds.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-faint">
            Alimenta
          </span>
          {feeds.map((f) => (
            <span
              key={f}
              className="rounded-sm border border-line bg-base px-1.5 py-0.5 text-[10px] font-semibold capitalize text-muted"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {normatividad && (
        <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-faint">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l9-4 9 4M4 10v8M20 10v8M3 22h18M8 10v8M16 10v8M12 10v8" />
          </svg>
          {normatividad}
        </div>
      )}

      {footer && <div className="mt-3">{footer}</div>}
    </Wrapper>
  );
}
