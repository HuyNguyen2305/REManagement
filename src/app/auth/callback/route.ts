import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

// Magic-link landing: turn the link into a session cookie, then go home.
// token_hash links (our email template) work on any device; ?code= links only in the browser that asked.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const code = params.get("code");

  const supabase = await createClient();
  const { data, error } = tokenHash
    ? await supabase.auth.verifyOtp({ type: "email", token_hash: tokenHash })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { data: { user: null }, error: true };
  if (error || !data.user) return redirectTo(request, "/sign-in?error=link");

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
