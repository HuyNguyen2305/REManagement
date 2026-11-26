import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/server/auth/sign-out";
import { listProjects } from "@/server/projects/queries";

const TAP = "max-sm:h-11 max-sm:px-4"; // 44px touch targets on phones

export default async function Home() {
  const user = await getCurrentUser();
  const projects = await listProjects(user);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">Projects</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Signed in as {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="lg" className={TAP}>
              Sign out
            </Button>
          </form>
          <Link
            href="/projects/new"
            className={buttonVariants({ size: "lg", className: TAP })}
          >
            <Plus aria-hidden />
            New project
          </Link>
        </div>
      </header>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed p-8 text-center">
          <h2 className="font-medium">No projects yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start one for your next job, or ask a teammate to invite you to
            theirs.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id} className="min-w-0">
              <Link
                href={`/projects/${p.id}`}
                className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {/* Lift on mouse hover (Tailwind gates hover: to real hover devices), press on touch. */}
                <Card className="h-full transition-[translate,scale,background-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-muted/40 group-active:scale-[0.98] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <CardHeader>
                    <CardTitle className="break-words">{p.name}</CardTitle>
                    {p.description && (
                      <CardDescription className="line-clamp-3 break-words">
                        {p.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
