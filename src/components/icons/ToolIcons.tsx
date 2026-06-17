import type { FC } from "react";
import type { ToolId } from "@/lib/tools";

type IconProps = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export function TerrenoIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2C9.2 2 7 4.2 7 7c0 3.6 5 10 5 10s5-6.4 5-10c0-2.8-2.2-5-5-5z" />
      <circle cx="12" cy="7" r="1.5" />
      <path d="M4 21h16" />
      <path d="M7.5 19q4.5-2 9 0" />
    </svg>
  );
}

export function ZonificacionIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

export function MercadoIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M3 17l4.5-5L11 15l4-5.5 3 2" />
      <circle cx="20.5" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CostosIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="15" x2="13" y2="15" />
    </svg>
  );
}

export function FinancieroIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <line x1="3" y1="20" x2="21" y2="20" />
      <line x1="3" y1="4" x2="3" y2="20" />
      <path d="M3 15l4-5 4 3 3-6 4 4" />
      <path d="M17 11l2-3 2 2" />
    </svg>
  );
}

export function RoiIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5.1 18.9A9 9 0 1018.9 5.1" />
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16 5l2-2 2 2M18 3v5" />
    </svg>
  );
}

export function CronogramaIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="7" y1="14" x2="12" y2="14" />
      <line x1="7" y1="17" x2="15" y2="17" />
    </svg>
  );
}

export function RiesgosIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2L4 6.5v6C4 17.1 7.4 21.5 12 23c4.6-1.5 8-5.9 8-10.5v-6L12 2z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const TOOL_ICONS: Record<ToolId, FC<IconProps>> = {
  terreno: TerrenoIcon,
  zonificacion: ZonificacionIcon,
  mercado: MercadoIcon,
  costos: CostosIcon,
  financiero: FinancieroIcon,
  roi: RoiIcon,
  cronograma: CronogramaIcon,
  riesgos: RiesgosIcon,
};
