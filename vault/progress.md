# Progress

## Rule: code review after every 3 steps

Every 3 completed steps, big or small, stop for a code review before starting the next step. No exceptions.

A review covers all changes since the previous review:

1. Run `/ponytail-review` and `/code-review` on the diff.
2. Run `/ponytail-audit` for dead code and dead files.
3. Fix every finding, or log why it was skipped, before the next step starts.
4. Record the review below: date, steps covered, findings and fixes.

## Now

- [x] Project setup (CLAUDE.md, vault notes, .gitignore, ESLint + Prettier, CI)
- Step 3 and Review 1 done (PR pending). Next: step 4
- Steps since last review: 0 of 3
- Not tested against real Supabase yet (no keys). When keys are in `.env.local`:
  1. Run `npm run db:migrate`.
  2. In Supabase > Authentication > Email Templates > Magic Link, set the link to `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email` (works across devices).
  3. Add the site URL to Authentication > URL Configuration.
  4. Try a real sign-in.

## Implementation plan

Tick a step when its PR is merged. Each step is one PR.

### Phase 1: Base

1. [x] Scaffold: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui; add `typecheck`, `test`, `build` scripts; Vitest + Playwright set up with one smoke test each
2. [x] Database: Supabase project, Drizzle config, `.env.example`, schema for users (role, deactivated), projects, memberships, invites, activity; first migration
3. [ ] Sign-in: Supabase magic links, session middleware, user row on first sign-in, deactivated users blocked

**→ Review 1 (steps 1–3)**

4. [ ] Projects: create, home list, `requireMember(projectId)` helper (Admins pass), Activity helper
5. [ ] Invites and users: invite by email, accept invite, Admin deactivates or reactivates users
6. [ ] App shell: layout, project nav, Vietnamese-safe fonts (shadcn set Geist, which has no Vietnamese subset; swap it), accent-insensitive search helper (`unaccent`)

**→ Review 2 (steps 4–6)**

### Phase 2: Files

7. [ ] R2: bucket, CORS, presigned multipart upload signing (browser uploads straight to R2)
8. [ ] Folders and files: per-project folder tree, upload UI, file records, download
9. [ ] Versions and trash: upload a new version, version list, 30-day trash for files and folders

**→ Review 3 (steps 7–9)**

10. [ ] Previews: images and PDFs
11. [ ] File comments, plus Activity rows for uploads and comments
12. [ ] File search by name (accent-insensitive)

**→ Review 4 (steps 10–12)**

### Phase 3: To-dos

13. [ ] To-do lists and to-dos: create, edit, several assignees, due date, notes
14. [ ] Complete and reopen, comments, Activity rows
15. [ ] My assignments: open to-dos assigned to me across projects

**→ Review 5 (steps 13–15)**

### Phase 4: Message board and Schedule

16. [ ] Message board: posts with Tiptap rich text; authors edit their own, Admins edit any
17. [ ] Message comments, plus Activity rows
18. [ ] Schedule events: create, edit, delete

**→ Review 6 (steps 16–18)**

19. [ ] Calendar view: events and to-do due dates together
20. [ ] Activity feed: per project and on home
21. [ ] In-app notifications: assignments, comments, mentions

**→ Review 7 (steps 19–21)**

### Phase 5: Polish and deploy

22. [ ] Trash UI for all tools, plus a daily job that purges items older than 30 days
23. [ ] Polish: mobile layout, dark mode, empty states, Playwright flows for the key paths
24. [ ] Deploy: Vercel, production env, R2 CORS for the real domain, smoke test

**→ Review 8 (steps 22–24)**

## Review log

### Review 1 (steps 1–3), 2026-11-26

Ran `/ponytail-review`, `/code-review` (medium) and `/ponytail-audit` (dead code).

Fixed:

- First sign-in race: two parallel first requests could mark a new user "deactivated". Now inserts on id conflict only, then re-reads.
- Sign-in hid every 400/422 Supabase error. Now only "otp_disabled" (no account) is hidden; others are logged.
- Callback now signs deactivated users out where cookies can be cleared.
- Magic links failed on a different device (PKCE). Callback now also accepts `token_hash` links.
- Magic-link redirect used the client's Origin header. Now uses `NEXT_PUBLIC_SITE_URL`.
- Proxy redirect dropped cookie changes. Now copies them.
- Dev hot reload opened a new DB pool each time. Now reuses one.
- Auth server actions moved to `src/server/auth/` (file layout rule).
- Invite tokens are stored as a SHA-256 hash (`token_hash`). The first migration was regenerated, since it had never been run.

- Follow-up re-check (after merge): RLS was off on every table, so Supabase's public API (anon key) could read and change all data. RLS is now on with no policies on all 5 tables. The app connects as the owner role, so it is not affected. The first migration was regenerated again (never run).

Skipped:

- `getCurrentUser` can't clear cookies from a page. The callback and proxy cover it.
- `lucide-react` is unused for now. shadcn components will use it.
- `docs/PLAN.md` was stale (Prisma, Auth.js, no Files). Deleted with the owner's OK.
- Not tested against real Supabase (no keys yet).
