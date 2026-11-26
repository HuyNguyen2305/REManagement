import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// "Where am I, how do I get out": every inner page starts with this.
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ChevronLeft aria-hidden className="size-4" />
      {label}
    </Link>
  );
}
