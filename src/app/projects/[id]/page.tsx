import {
  Activity,
  CalendarDays,
  FolderOpen,
  ListTodo,
  MessagesSquare,
} from "lucide-react";
import { BackLink } from "@/components/back-link";
import { requireMember } from "@/server/access";
import { listMembers } from "@/server/projects/queries";

// Filled in by later steps; shown now so the project's shape is clear.
const TOOLS = [
  { name: "Files", icon: FolderOpen },
  { name: "To-dos", icon: ListTodo },
  { name: "Message board", icon: MessagesSquare },
  { name: "Schedule", icon: CalendarDays },
  { name: "Activity", icon: Activity },
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { project } = await requireMember(id);
  const members = await listMembers(project.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      <BackLink href="/" label="Projects" />
      <header className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-semibold break-words sm:text-3xl">
          {project.name}
        </h1>
        {project.description && (
          <p className="mt-2 whitespace-pre-line break-words text-muted-foreground">
            {project.description}
          </p>
        )}
      </header>

      <section aria-labelledby="tools" className="mt-10">
        <h2 id="tools" className="sr-only">
          Tools
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className="flex flex-col gap-3 rounded-xl border border-dashed p-4"
            >
              <Icon aria-hidden className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="members" className="mt-10">
        <h2 id="members" className="font-semibold">
          Members{" "}
          <span className="text-muted-foreground">{members.length}</span>
        </h2>
        <ul className="mt-3 divide-y rounded-xl border">
          {members.map((m) => (
            <li key={m.id} className="flex min-w-0 flex-col px-4 py-3">
              <span
                title={m.name}
                className="truncate leading-relaxed font-medium"
              >
                {m.name}
              </span>
              <span
                title={m.email}
                className="truncate text-sm leading-relaxed text-muted-foreground"
              >
                {m.email}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
