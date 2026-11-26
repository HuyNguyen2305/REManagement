"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { memberships, projects } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/server/activity";
import { parseProjectInput, type FieldError } from "./validate";

// values: React resets the form after an action, so send back what was typed.
export type CreateProjectState = {
  error?: FieldError;
  values?: { name: string; description: string };
};

// Anyone signed in can create a project (no membership check: it doesn't exist yet).
export async function createProject(
  _prev: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const user = await getCurrentUser();
  const input = parseProjectInput(formData);
  if ("error" in input)
    return {
      error: input.error,
      values: {
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
      },
    };

  const projectId = await db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({ ...input, createdById: user.id })
      .returning({ id: projects.id });
    await tx
      .insert(memberships)
      .values({ projectId: project.id, userId: user.id });
    await logActivity(tx, {
      projectId: project.id,
      actorId: user.id,
      verb: "created",
      subjectType: "project",
      subjectId: project.id,
      summary: `created the project ${input.name}`,
    });
    return project.id;
  });
  redirect(`/projects/${projectId}`);
}
