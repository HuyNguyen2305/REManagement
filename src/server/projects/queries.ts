import "server-only";
import { and, asc, desc, eq, exists, isNull } from "drizzle-orm";
import { db } from "@/db";
import { memberships, projects, users } from "@/db/schema";

type Viewer = Pick<typeof users.$inferSelect, "id" | "role">;

// Admins get every open project; members only the ones they belong to. Newest first.
export function listProjects(viewer: Viewer) {
  const isMember = exists(
    db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.projectId, projects.id),
          eq(memberships.userId, viewer.id),
        ),
      ),
  );
  return db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
    })
    .from(projects)
    .where(
      and(
        isNull(projects.archivedAt),
        viewer.role === "admin" ? undefined : isMember,
      ),
    )
    .orderBy(desc(projects.createdAt));
}

// Call only after requireMember(projectId).
export function listMembers(projectId: string) {
  return db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(eq(memberships.projectId, projectId))
    .orderBy(asc(users.name));
}
