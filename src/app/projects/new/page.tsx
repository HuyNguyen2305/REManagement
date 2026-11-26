import { BackLink } from "@/components/back-link";
import { getCurrentUser } from "@/lib/auth";
import { NewProjectForm } from "./new-project-form";

export default async function NewProjectPage() {
  await getCurrentUser();
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-8 sm:px-8">
      <BackLink href="/" label="Projects" />
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">New project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You&apos;ll be its first member. Invite the team once it&apos;s created.
      </p>
      <NewProjectForm />
    </main>
  );
}
