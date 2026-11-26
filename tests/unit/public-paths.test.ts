import { expect, test } from "vitest";
import { isPublicPath } from "@/lib/public-paths";

test("sign-in and auth callback are public", () => {
  expect(isPublicPath("/sign-in")).toBe(true);
  expect(isPublicPath("/auth/callback")).toBe(true);
});

test("app pages and look-alike paths are not public", () => {
  expect(isPublicPath("/")).toBe(false);
  expect(isPublicPath("/projects/1")).toBe(false);
  expect(isPublicPath("/sign-in-admin")).toBe(false);
  expect(isPublicPath("/auth")).toBe(false);
});
