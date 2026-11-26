import "server-only";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { memberships, projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Gate for everything inside a project. Admins see all projects; others must be members.
// Anything else is "Not found", so people can't tell which projects exist.
export async function requireMember(projectId: string) {
  const user = await getCurrentUser();
  if (!UUID.test(projectId)) notFound(); // a malformed id would make Postgres throw

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  if (!project) notFound();

  if (user.role !== "admin") {
    const membership = await db.query.memberships.findFirst({
      where: and(
        eq(memberships.projectId, projectId),
        eq(memberships.userId, user.id),
      ),
    });
    if (!membership) notFound();
  }
  return { user, project };
}
