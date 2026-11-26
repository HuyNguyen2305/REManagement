import { expect, test } from "vitest";
import { cn } from "@/lib/utils";

test("cn merges classes and lets later Tailwind classes win", () => {
  expect(cn("p-2", false && "hidden", "p-4")).toBe("p-4");
});
