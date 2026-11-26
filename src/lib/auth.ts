import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

// The signed-in app user. Creates the users row on first sign-in; deactivated users are sent back to /sign-in.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) redirect("/sign-in");

  const current =
    (await db.query.users.findFirst({ where: eq(users.id, authUser.id) })) ??
    (
      await db
        .insert(users)
        .values({
          id: authUser.id,
          email: authUser.email,
          name: authUser.email.split("@")[0],
        })
        .onConflictDoNothing()
        .returning()
    )[0];
  if (!current || current.deactivatedAt) {
    await supabase.auth.signOut();
    redirect("/sign-in?error=deactivated");
  }
  return current;
});
