import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { listProjects, getProject, getToolStatuses } from "@/lib/data/projects";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const [user, projects, project, statuses] = await Promise.all([
    getCurrentUser(),
    listProjects(),
    getProject(projectId),
    getToolStatuses(projectId),
  ]);

  if (!project) notFound();

  return (
    <AppShell
      user={user}
      projects={projects}
      project={project}
      statuses={statuses}
    >
      {children}
    </AppShell>
  );
}
