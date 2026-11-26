# REManagement

Basecamp-inspired project management app for one lighting-design company (~5 people). It has its own name and look. The UI is in English, and all text must handle Vietnamese (diacritic fonts, accent-insensitive search). Phase 1 tools: Files (most used), To-dos, Message board, Schedule, Activity feed. Full scope and decisions are in `vault/memory.md`.

## Stack

Next.js (App Router) + React + TypeScript · Tailwind + shadcn/ui · Supabase Postgres + Auth (magic links) · Drizzle ORM · Tiptap · Cloudflare R2 for files (presigned multipart uploads from the browser, never through a route) · Vercel · Vitest + Playwright · ESLint + Prettier.

## File layout

- `src/app/` routes and pages; `(auth)/`, `projects/[id]/{files,todos,messages,schedule,activity}/`
- `src/components/ui/` shadcn primitives; `src/components/<feature>/` feature components
- `src/server/` server actions and queries, one folder per feature
- `src/db/` Drizzle schema and migrations; `src/lib/` shared helpers (auth, r2, search)
- `tests/unit/`, `tests/e2e/`
- `vault/` Obsidian vault: `memory.md`, `progress.md`, notes

## How to work

1. Before starting, read `vault/memory.md` and `vault/progress.md`, and use `/graphify` on the vault and codebase to find related code.
2. Use the `find-skills` skill to pick the right installed skill before a task. All frontend and UI work uses the installed design skills (`.claude/skills/`, ui-ux-pro-max).
3. Run `/ponytail` while working and `/ponytail-review` in every code review; use `/ponytail-audit` for dead-code and dead-file checks.
4. Before committing: `npm run lint` and `npm run format:check` must pass, plus typecheck and tests.
5. After each task, update `vault/progress.md`. Record new decisions, scope or targets in `vault/memory.md`. Notes go in the vault, not elsewhere.
6. Every server action checks project membership (or Admin) first, and every create, complete, comment or upload writes an Activity row.
7. Work on a branch and open a PR. CI (lint, format, typecheck, tests, build) must pass before merge; `main` is protected.
8. **Code review after every 3 steps, big or small. Crucial, no exceptions.** Follow the plan in `vault/progress.md`, one step per PR. After every third step, stop and run the review described there before starting the next step.
9. Ask before adding features outside phase 1. Log ideas in `vault/memory.md` under "Later".
