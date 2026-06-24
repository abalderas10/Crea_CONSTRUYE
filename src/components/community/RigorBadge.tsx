import { RIGOR_META, type RigorLevel } from "@/lib/community/rigor";

export function RigorBadge({
  level,
  size = "sm",
  withLabel = true,
}: {
  level: RigorLevel;
  size?: "sm" | "md";
  withLabel?: boolean;
}) {
  const m = RIGOR_META[level];
  const pad = size === "md" ? "px-2.5 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm font-bold uppercase tracking-wide ${pad}`}
      style={{ background: `${m.color}1f`, color: m.color }}
      title={m.desc}
    >
      <span aria-hidden className="text-[11px] leading-none">
        {m.icon}
      </span>
      {withLabel && m.label}
    </span>
  );
}
