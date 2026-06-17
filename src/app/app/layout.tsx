import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plataforma",
};

// El shell con sidebar/switcher vive en /app/[projectId]/layout.
// Aquí solo queda el índice de proyectos y el alta de proyecto.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-base">{children}</div>;
}
