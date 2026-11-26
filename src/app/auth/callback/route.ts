import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

// Magic-link landing: swap the one-time code for a session cookie, then go home.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return redirectTo(request, "/sign-in?error=link");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return redirectTo(request, "/sign-in?error=link");

  // Route handlers can clear cookies, so deactivated users are fully signed out here.
  const row = await db.query.users.findFirst({
    where: eq(users.id, data.user.id),
  });
  if (row?.deactivatedAt) {
    await supabase.auth.signOut();
    return redirectTo(request, "/sign-in?error=deactivated");
  }
  return redirectTo(request, "/");
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}
