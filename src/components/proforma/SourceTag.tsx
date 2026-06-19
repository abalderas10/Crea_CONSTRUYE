import { SOURCE_COLOR, type SourceKind } from "@/lib/proforma/types";

/** Etiqueta de procedencia de un dato (transparencia de origen). */
export function SourceTag({
  source,
  kind = "manual",
}: {
  source: string;
  kind?: SourceKind;
}) {
  const color = SOURCE_COLOR[kind];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]"
      style={{ color, background: `${color}14`, border: `1px solid ${color}33` }}
    >
      <span
        className="h-1 w-1 rounded-full"
        style={{ background: color }}
      />
      {source}
    </span>
  );
}
