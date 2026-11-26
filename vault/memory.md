# Memory

Project facts and decisions. Supersedes `docs/PLAN.md` where they differ (stack, roles, Files in phase 1).

## Goal

A Basecamp-inspired project management app with its own name and look. Target: the team uses it daily.

## Scope

- Single company: a ~5-person lighting-design team. Free to run.
- No guests or clients in v1.
- English UI; all text must handle Vietnamese (diacritic fonts, accent-insensitive search).

## Roles

- Admin and Member.
- Only project members see a project; Admins see all projects.
- Anyone can create a project.
- Deactivated users can't sign in, but their content stays.
- No open sign-up: magic links go only to existing accounts (`shouldCreateUser: false`). New people join by invite (step 5). The first Admin is created by hand: add the user in Supabase Auth, sign in once, then set `role = 'admin'` on their `users` row.

## Phase 1 tools

- **Files** (most used): per-project folders, uploads to R2, versions, comments, image and PDF previews.
- **To-dos**: multiple assignees, due date, notes, comments, open or done. No columns, no subtasks.
- **Message board**: title + rich text + comments. Authors edit their own posts; Admins edit any.
- **Schedule**: events and to-do due dates on one calendar.
- **Activity feed**: every create, complete, comment or upload writes an Activity row.

Across tools: 30-day trash; in-app notifications (email later). Group chat comes next after phase 1.

## Stack

Next.js (App Router) + React + TypeScript, Tailwind + shadcn/ui, Supabase Postgres + Auth (magic links), Drizzle ORM, Tiptap, Cloudflare R2, Vercel, Vitest + Playwright, ESLint + Prettier.

- Files go to Cloudflare R2 with presigned multipart uploads straight from the browser, never through a route.
- Supabase Storage was rejected: 1 GB free storage and a 50 MB per-file cap are too small for lighting-design files.

## Later

- Group chat (next after phase 1)
- Email notifications
