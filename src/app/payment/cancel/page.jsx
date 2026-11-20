import Link from "next/link";
import { XCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata = {
  title: "Payment Cancelled — WedPlan",
};

export default function PaymentCancelPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-background px-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <XCircle className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-espresso">
        Payment <span className="italic text-garnet">cancelled</span>
      </h1>
      <p className="max-w-md text-sm leading-7 text-espresso/70">
        No charge was made — your account is still on the Free plan. You can
        try the upgrade again whenever you&apos;re ready.
      </p>
      <Link
        href="/vendor/subscription"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-2 h-11 rounded-full bg-garnet px-7 text-sm font-semibold text-garnet-foreground hover:bg-garnet-deep"
        )}
      >
        Back to subscription plans
      </Link>
    </main>
  );
}
