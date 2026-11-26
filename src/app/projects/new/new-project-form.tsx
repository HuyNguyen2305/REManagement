"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProject,
  type CreateProjectState,
} from "@/server/projects/actions";
import { DESCRIPTION_MAX, NAME_MAX } from "@/server/projects/validate";

export function NewProjectForm() {
  const [state, action, pending] = useActionState<CreateProjectState, FormData>(
    createProject,
    {},
  );
  const errorFor = (field: "name" | "description") =>
    state.error?.field === field ? state.error.message : undefined;
  const nameError = errorFor("name");
  const descriptionError = errorFor("description");

  return (
    <form action={action} className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={NAME_MAX}
          defaultValue={state.values?.name}
          autoFocus
          autoComplete="off"
          enterKeyHint="next"
          className="h-11 sm:h-9"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "name-error" : undefined}
        />
        {nameError && (
          <p id="name-error" role="alert" className="text-sm text-destructive">
            {nameError}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          maxLength={DESCRIPTION_MAX}
          defaultValue={state.values?.description}
          rows={4}
          className="max-h-60"
          aria-invalid={!!descriptionError}
          aria-describedby={
            descriptionError ? "description-error" : "description-hint"
          }
        />
        {descriptionError ? (
          <p
            id="description-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {descriptionError}
          </p>
        ) : (
          <p id="description-hint" className="text-xs text-muted-foreground">
            The client, site or brief, so teammates know what this is.
          </p>
        )}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="max-sm:h-11 sm:self-start"
      >
        {pending ? "Creating…" : "Create project"}
      </Button>
    </form>
  );
}
