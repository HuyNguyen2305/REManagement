import { expect, test } from "vitest";
import { parseProjectInput } from "@/server/projects/validate";

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

test("trims and accepts a name, empty description becomes null", () => {
  expect(
    parseProjectInput(form({ name: "  Office lobby ", description: " " })),
  ).toEqual({
    name: "Office lobby",
    description: null,
  });
});

test("rejects a missing or blank name", () => {
  expect(parseProjectInput(form({}))).toMatchObject({
    error: { field: "name" },
  });
  expect(parseProjectInput(form({ name: "   " }))).toMatchObject({
    error: { field: "name" },
  });
});

test("rejects text over the limits", () => {
  expect(parseProjectInput(form({ name: "a".repeat(101) }))).toMatchObject({
    error: { field: "name" },
  });
  expect(
    parseProjectInput(form({ name: "ok", description: "a".repeat(1001) })),
  ).toMatchObject({ error: { field: "description" } });
});

test("stores Vietnamese in one form (NFC) whatever the keyboard sent", () => {
  const decomposed = "Chiếu sáng sảnh".normalize("NFD");
  const result = parseProjectInput(form({ name: decomposed }));
  expect(result).toEqual({
    name: "Chiếu sáng sảnh".normalize("NFC"),
    description: null,
  });
});
