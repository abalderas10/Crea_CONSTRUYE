// Logomark oficial de creaConstruye: una "C" en grid de cuadros redondeados
// con el cuadro superior derecho en Volt. Derivado del logo standalone.

type Props = {
  /** Altura en px (el ancho se calcula proporcional). */
  size?: number;
  /** Color de los cuadros de la "C". Default: ink. */
  color?: string;
  /** Color del cuadro de acento (superior derecho). Default: volt. */
  accent?: string;
  className?: string;
};

// El mark mide 79.5 × 99.5 en su grid nativo (4 col × 5 fila).
const RATIO = 79.5 / 99.5;

const INK_SQUARES: Array<[number, number]> = [
  [0.5, 0.5],
  [21, 0.5],
  [41.5, 0.5],
  [0.5, 21],
  [0.5, 41.5],
  [0.5, 62],
  [0.5, 82.5],
  [21, 82.5],
  [41.5, 82.5],
  [62, 82.5],
];

export function LogoMark({
  size = 28,
  color = "var(--color-ink)",
  accent = "var(--color-volt)",
  className,
}: Props) {
  return (
    <svg
      width={size * RATIO}
      height={size}
      viewBox="0 0 79.5 99.5"
      className={className}
      role="img"
      aria-label="creaConstruye"
    >
      <g fill={color}>
        {INK_SQUARES.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="17" height="17" rx="3.5" />
        ))}
      </g>
      <rect x="62" y="0.5" width="17" height="17" rx="3.5" fill={accent} />
    </svg>
  );
}
