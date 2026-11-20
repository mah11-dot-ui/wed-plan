import Link from "next/link";
import { SearchX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-garnet/5 text-garnet">
        <SearchX className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-espresso">
        This page took a different aisle
      </h1>
      <p className="max-w-sm text-sm leading-6 text-espresso/70">
        We couldn&apos;t find what you were looking for — the link may be old or
        the page may have moved.
      </p>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-2 h-11 rounded-full bg-garnet px-6 font-semibold text-garnet-foreground hover:bg-garnet-deep"
        )}
      >
        Back to home
      </Link>
    </main>
  );
}
