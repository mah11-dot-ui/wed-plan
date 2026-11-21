"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Crown, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { apiFetch } from "@/lib/api-client";

function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id") ?? "";
  const [status, setStatus] = useState(() => (sessionId ? "checking" : "missing"));

  useEffect(() => {
    if (!sessionId) return;
    apiFetch('/api/subscription/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => ({ ok: res.ok, data: await res.json().catch(() => ({})) }))
      .then((result) => {
        setStatus(result.ok && result.data.activated ? 'paid' : 'pending');
        router.refresh();
      })
      .catch(() => setStatus('unavailable'));
  }, [sessionId]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-background px-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-emerald-600/10 text-emerald-600">
        <CheckCircle2 className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">Payment received</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-espresso">
        Thank you — welcome to <span className="italic text-garnet">Premium</span>
      </h1>
      <p className="max-w-md text-sm leading-7 text-espresso/70">
        {status === "checking" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Confirming your payment…
          </span>
        ) : status === "paid" ? (
          "Your payment is verified and Premium access is active. Open the subscription page to see your updated plan."
        ) : (
          "Your payment is being verified with Stripe. Premium activates automatically once confirmed — no action needed from you."
        )}
      </p>
      <Link
        href="/vendor/subscription"
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-garnet px-7 text-sm font-semibold text-garnet-foreground hover:bg-garnet-deep"
        )}
      >
        <Crown className="size-4" aria-hidden="true" />
        View subscription
      </Link>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
