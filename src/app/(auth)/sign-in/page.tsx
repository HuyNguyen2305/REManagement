import { SignInForm } from "./sign-in-form";

const ERRORS: Record<string, string> = {
  deactivated: "This account has been deactivated. Ask an Admin to restore it.",
  link: "That sign-in link has expired or was already used. Request a new one.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Sign in to REManagement</h1>
      {error && ERRORS[error] && (
        <p role="alert" className="text-sm text-destructive">
          {ERRORS[error]}
        </p>
      )}
      <SignInForm />
    </main>
  );
}
