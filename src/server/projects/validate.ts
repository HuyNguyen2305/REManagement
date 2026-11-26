export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 1000;

export type ProjectInput = { name: string; description: string | null };
export type FieldError = { field: "name" | "description"; message: string };

// NFC so Vietnamese typed on any device (some send decomposed accents) is stored the same way.
const clean = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .normalize("NFC")
    .trim();

export function parseProjectInput(
  formData: FormData,
): ProjectInput | { error: FieldError } {
  const name = clean(formData.get("name"));
  const description = clean(formData.get("description"));
  if (!name)
    return { error: { field: "name", message: "Give the project a name." } };
  if (name.length > NAME_MAX)
    return {
      error: {
        field: "name",
        message: `Keep the name under ${NAME_MAX} characters.`,
      },
    };
  if (description.length > DESCRIPTION_MAX)
    return {
      error: {
        field: "description",
        message: `Keep the description under ${DESCRIPTION_MAX} characters.`,
      },
    };
  return { name, description: description || null };
}
