import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ── Container ──────────────────────────────────────────────── */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* ── Eyebrow (label uppercase) ──────────────────────────────── */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.18em] text-faint ${className}`}
    >
      {children}
    </p>
  );
}

/* ── Pill / Badge ───────────────────────────────────────────── */
export function Pill({
  children,
  color = "var(--color-volt)",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xs border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${className}`}
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}
    >
      {children}
    </span>
  );
}

/* ── Buttons ────────────────────────────────────────────────── */
type CtaProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
};

export function Cta({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CtaProps) {
  const sizes =
    size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-[13px]";
  const variants = {
    primary:
      "bg-volt text-on-volt font-extrabold hover:bg-volt-sub shadow-[0_0_0_0_rgba(200,255,0,0)] hover:shadow-volt-glow",
    secondary:
      "border border-violet/50 bg-violet/10 text-violet-sub font-bold hover:bg-violet/20",
    ghost:
      "border border-line text-muted font-semibold hover:border-faint hover:text-ink",
  } as const;
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md transition-all duration-150 ${sizes} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ── Logo ───────────────────────────────────────────────────── */
export function Logo({
  size = 28,
  withWordmark = true,
}: {
  size?: number;
  withWordmark?: boolean;
}) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="creaConstruye">
      <span
        className="grid place-items-center bg-volt font-black text-on-volt"
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
          fontSize: Math.round(size * 0.5),
        }}
      >
        C
      </span>
      {withWordmark && (
        <span className="text-[15px] font-extrabold tracking-tight">
          <span className="font-normal text-muted">crea</span>
          <span className="text-ink">Construye</span>
        </span>
      )}
    </Link>
  );
}
