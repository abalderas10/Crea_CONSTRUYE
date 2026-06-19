// Logomark oficial de creaConstruye: "Chispa C" — una C circular con un
// destello (chispa) en Volt al centro. Derivado de la familia de marca.

type Props = {
  /** Tamaño en px (cuadrado). */
  size?: number;
  /** Color del trazo de la "C". Default: ink. */
  color?: string;
  /** Color de la chispa central. Default: volt. */
  accent?: string;
  className?: string;
};

export function LogoMark({
  size = 28,
  color = "var(--color-ink)",
  accent = "var(--color-volt)",
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="creaConstruye"
    >
      <g transform="translate(4,0)">
        {/* C circular abierta a la derecha */}
        <path
          d="M64.9 77 A33 33 0 1 1 64.9 23"
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Chispa / destello */}
        <path
          d="M50 35 L55 45 L65 50 L55 55 L50 65 L45 55 L35 50 L45 45 Z"
          fill={accent}
        />
      </g>
    </svg>
  );
}
