import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/server/auth/sign-out";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">REManagement</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
      <form action={signOut} className="mt-4">
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
