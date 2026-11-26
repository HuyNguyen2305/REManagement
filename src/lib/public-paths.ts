// Paths that work without a session. Everything else redirects to /sign-in.
const PUBLIC_PATHS = ["/sign-in", "/auth/"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname === p,
  );
}
