import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Plataforma",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AppShell user={user} projects={DEMO_PROJECTS}>
      {children}
    </AppShell>
  );
}
