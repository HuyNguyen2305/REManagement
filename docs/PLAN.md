# REManagement plan

A compact, team-oriented project management web app. Each project is a small hub of tools. The first version keeps scope small on purpose.

## Goals for version 1

- A team can sign in, create projects and invite teammates.
- Each project has four tools: **To-dos**, **Message board**, **Schedule** and **Activity feed**.
- A home screen lists your projects, and a **My assignments** view lists to-dos assigned to you across all projects.
- Works well on phone and desktop, with light and dark themes.

Left for version 2: real-time chat, file uploads, recurring check-in questions, notifications by email, and search across projects.

## Stack

| Part | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | One codebase for pages and server logic; easy to deploy |
| Styling | Tailwind CSS | Fast to build a clean, compact UI |
| Database | PostgreSQL (free tier on Neon or Supabase) | Reliable, relational data fits projects, members and to-dos |
| ORM | Prisma | Typed queries and simple migrations |
| Auth | Auth.js with email magic links (and optionally Google or GitHub sign-in) | No passwords to store |
| Validation | Zod | Same input checks on client and server |
| Tests | Vitest for logic, Playwright for a few key flows | Catch regressions early |
| Hosting | Vercel | Free tier, deploys from GitHub on each push |

## Data model

```
User          id, name, email, avatarUrl, createdAt
Project       id, name, description, color, archivedAt, createdById, createdAt
Membership    id, projectId, userId, role (OWNER | MEMBER), joinedAt
Invite        id, projectId, email, token, invitedById, expiresAt, acceptedAt

TodoList      id, projectId, name, position, createdAt
Todo          id, listId, title, notes, assigneeId?, dueOn?, completedAt?, position, createdById, createdAt

Message       id, projectId, title, body, authorId, createdAt, updatedAt
Comment       id, authorId, body, createdAt, todoId? | messageId?   (exactly one parent)

Event         id, projectId, title, notes, startsAt, endsAt?, allDay, createdById

Activity      id, projectId, actorId, verb (created | completed | commented | ...),
              subjectType (todo | message | event | project), subjectId, summary, createdAt
```

Rules:
- Only members of a project can see or change anything in it. Every server action checks membership first.
- Owners can rename or archive the project and manage members. Members can do everything else.
- Every create, complete or comment writes one `Activity` row, which powers the feed.

## Pages

- `/` home: your projects as cards, plus a "My assignments" panel
- `/projects/[id]`: project overview with the four tools as tiles
- `/projects/[id]/todos`, `/messages`, `/schedule`, `/activity`
- `/invite/[token]`: accept an invite
- `/settings`: your profile

## Build order

1. **Base**: project scaffold, database, sign-in, create project, invite members.
2. **To-dos**: lists, to-dos, assign, due dates, complete, comments, My assignments.
3. **Message board and Schedule**: posts with comments, and a month or list calendar of events.
4. **Activity feed, polish and deploy**: feed, mobile layout, dark mode, deploy to Vercel.

Each step lands as its own pull request for review.
