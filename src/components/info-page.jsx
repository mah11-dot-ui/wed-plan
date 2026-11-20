import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function InfoPage({ overline, title, children }) {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <section aria-labelledby="info-title" className="border-b border-cream-300 bg-cream-200">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">{overline}</p>
          <h1 id="info-title" className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso">
            {title}
          </h1>
        </div>
      </section>
      <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-10 text-sm leading-7 text-espresso/75 sm:px-6">
        {children}
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mt-4 inline-flex h-10 items-center gap-2 rounded-full px-4 text-espresso hover:bg-garnet/5 hover:text-garnet"
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
