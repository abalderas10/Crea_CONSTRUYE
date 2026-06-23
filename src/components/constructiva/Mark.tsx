// Marca de Constructiva — la "C" pixelada (grid 5×5) con el punto Volt
// desprendido en la esquina superior derecha, que hereda de la Chispa C
// de creaConstruye. Hija de creaConstruye, ejecución sobre idea.

type Variant = "carbon" | "volt" | "mono";

// Celdas encendidas de la C (col, row) en una rejilla 5×5.
// Sin trazo medio: solo arriba, izquierda y abajo — si no, parece una E.
const C_CELLS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 0], // borde superior
  [0, 1],
  [0, 2],                         // costado izquierdo
  [0, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], // borde inferior
];

// El punto de acento, desprendido arriba a la derecha.
const ACCENT_CELL: [number, number] = [4, 0];

const PITCH = 20; // 5 celdas × 20 = 100
const SIZE = 14; // lado del cuadrado (deja gap de 6)
const RAD = 3;

export function ConstructivaMark({
  size = 40,
  variant = "carbon",
  accent = "var(--cc-lime, #C6F24E)",
  rounded = true,
}: {
  size?: number;
  variant?: Variant;
  /** Color del punto de acento (solo en variante carbon). */
  accent?: string;
  rounded?: boolean;
}) {
  // Color de los cuadrados de la C según el tratamiento.
  const squareColor =
    variant === "volt" ? "#16181F" : variant === "mono" ? "#16181F" : "#FFFFFF";
  // En carbon el acento es Volt; en volt/mono todo es del mismo tono.
  const accentColor = variant === "carbon" ? accent : squareColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Constructiva"
    >
      {C_CELLS.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          x={c * PITCH}
          y={r * PITCH}
          width={SIZE}
          height={SIZE}
          rx={rounded ? RAD : 0}
          fill={squareColor}
        />
      ))}
      <rect
        x={ACCENT_CELL[0] * PITCH}
        y={ACCENT_CELL[1] * PITCH}
        width={SIZE}
        height={SIZE}
        rx={rounded ? RAD : 0}
        fill={accentColor}
      />
    </svg>
  );
}

/** Wordmark "Construc·tiva" — la sílaba "tiva" se enciende en Volt. */
export function ConstructivaWordmark({
  className = "",
  liteColor = "var(--cc-lime, #C6F24E)",
}: {
  className?: string;
  liteColor?: string;
}) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      Construc<span style={{ color: liteColor }}>tiva</span>
    </span>
  );
}
