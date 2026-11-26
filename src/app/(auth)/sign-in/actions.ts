"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { sent?: boolean; error?: string };

export async function sendMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    // No open sign-up: only people who already have an account (or an invite, step 5) get a link.
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  // Same answer whether or not the account exists, so the form can't be used to find accounts.
  if (error && error.code !== "otp_disabled") {
    console.error("signInWithOtp failed", error.code, error.message);
    return { error: "Couldn't send the link. Try again in a minute." };
  }
  return { sent: true };
}
