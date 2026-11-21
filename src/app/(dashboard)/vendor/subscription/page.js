import { BadgeCheck, Check, Crown, Infinity } from "lucide-react";

import AccessDenied from "@/components/access-denied";
import UpgradeButton from "@/components/upgrade-button";
import { ObjectId } from "mongodb";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Subscription — WedPlan Vendor",
};

export const instant = false;

const plans = [
  {
    name: "Free",
    price: "৳0",
    note: "forever",
    current: true,
    features: [
      "Maximum 3 active services",
      "Basic Vendor Dashboard",
      "Booking Request Management",
    ],
  },
  {
    name: "Premium",
    price: "$9.99",
    note: "one-time upgrade",
    current: false,
    highlight: true,
    features: [
      "Unlimited active services",
      "Premium Vendor Badge",
      "All Free Plan Features",
    ],
  },
];

export default async function SubscriptionPage() {
  const { blocked, forbidden, user } = await requireRole("vendor", "/vendor/subscription");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  const fresh = ObjectId.isValid(user.id)
    ? await db.collection("user").findOne({ _id: new ObjectId(user.id) })
    : null;
  const plan = fresh?.plan ?? user.plan ?? "free";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Vendor Studio
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          Choose your <span className="italic text-garnet">plan</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Start free and upgrade whenever your wedding business grows.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {plans.map((item) => {
          const isCurrent = item.name.toLowerCase() === plan;
          return (
            <section
              key={item.name}
              aria-label={`${item.name} plan`}
              className={`relative flex flex-col gap-5 rounded-2xl border p-6 ${
                item.highlight
                  ? "border-garnet/40 bg-cream-200 shadow-lg shadow-garnet/10"
                  : "border-cream-300 bg-cream-200"
              }`}
            >
              {item.highlight && (
                <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-garnet px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-garnet-foreground">
                  <Crown className="size-3" aria-hidden="true" />
                  Best value
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  {item.highlight ? (
                    <Infinity className="size-5 text-garnet" aria-hidden="true" />
                  ) : (
                    <BadgeCheck className="size-5 text-garnet" aria-hidden="true" />
                  )}
                  <h2 className="font-display text-2xl font-semibold text-espresso">{item.name}</h2>
                </div>
                <p className="mt-3 font-display text-3xl font-semibold text-garnet">
                  {item.price}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-espresso/50">
                  {item.note}
                </p>
              </div>

              <ul className="space-y-2.5 text-sm text-espresso/75">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-garnet" strokeWidth={3} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                {isCurrent ? (
                  <div className="flex h-11 items-center justify-center rounded-full border border-cream-300 bg-background text-xs font-semibold text-espresso/70">
                    Your current plan
                  </div>
                ) : item.name === "Premium" ? (
                  <UpgradeButton />
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
