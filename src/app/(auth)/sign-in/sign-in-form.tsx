"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink, type SignInState } from "./actions";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    sendMagicLink,
    {},
  );

  if (state.sent) {
    return (
      <p role="status">
        Check your email. If you have an account, a sign-in link is on its way.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <Label htmlFor="email">Work email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        aria-invalid={!!state.error}
        aria-describedby={state.error ? "email-error" : undefined}
      />
      {state.error && (
        <p id="email-error" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
