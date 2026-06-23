import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Constructiva — Construcción y mantenimiento",
  description:
    "Construimos, remodelamos y damos mantenimiento con las herramientas de creaConstruye. Obra nueva, fachadas, domótica y automatización.",
};

// Paleta propia de Constructiva (marca distinta dentro de creaConstruye).
// Grafitos como base + lima #C6F24E como acento. Se aplica como variables
// CSS locales para no tocar el tema global de la app.
const PALETTE = {
  "--cc-base": "#16181F",
  "--cc-surface": "#1B1E27",
  "--cc-raised": "#3C4350",
  "--cc-line": "rgba(167,174,188,0.16)",
  "--cc-text": "#EDEFF2",
  "--cc-muted": "#A7AEBC",
  "--cc-lime": "#C6F24E",
  "--cc-lime-sub": "#B4E23A",
} as React.CSSProperties;

export default function ConstructivaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={PALETTE}
      className="min-h-screen bg-[var(--cc-base)] text-[var(--cc-text)]"
    >
      {children}
    </div>
  );
}
