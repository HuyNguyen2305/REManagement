import { beforeEach, expect, test, vi } from "vitest";

// requireMember with the DB and session mocked: who gets in, who gets "Not found".
const mocks = vi.hoisted(() => ({
  user: { id: "u1", role: "member" as "admin" | "member" },
  project: { id: "11111111-1111-4111-8111-111111111111", name: "P" } as unknown,
  membership: undefined as unknown,
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));
vi.mock("@/lib/auth", () => ({ getCurrentUser: async () => mocks.user }));
vi.mock("@/db", () => ({
  db: {
    query: {
      projects: { findFirst: async () => mocks.project },
      memberships: { findFirst: async () => mocks.membership },
    },
  },
}));

const { requireMember } = await import("@/server/access");
const ID = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
  mocks.user.role = "member";
  mocks.project = { id: ID, name: "P" };
  mocks.membership = undefined;
});

test("a member gets in", async () => {
  mocks.membership = { projectId: ID, userId: "u1" };
  await expect(requireMember(ID)).resolves.toMatchObject({
    project: { id: ID },
  });
});

test("an Admin gets in without being a member", async () => {
  mocks.user.role = "admin";
  await expect(requireMember(ID)).resolves.toMatchObject({
    project: { id: ID },
  });
});

test("a non-member gets Not found", async () => {
  await expect(requireMember(ID)).rejects.toThrow("NOT_FOUND");
});

test("a missing project gets Not found, even for an Admin", async () => {
  mocks.user.role = "admin";
  mocks.project = undefined;
  await expect(requireMember(ID)).rejects.toThrow("NOT_FOUND");
});

test("a malformed id gets Not found before touching the database", async () => {
  mocks.user.role = "admin";
  await expect(requireMember("not-a-uuid")).rejects.toThrow("NOT_FOUND");
});
