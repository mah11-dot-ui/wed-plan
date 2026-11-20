import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  Crown,
  PlusCircle,
  Store,
} from "lucide-react";

import AccessDenied from "@/components/access-denied";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Vendor Dashboard — WedPlan",
};

export const instant = false;

export default async function VendorPage() {
  const { blocked, forbidden, user } = await requireRole("vendor", "/vendor");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  const plan = user.plan ?? "free";

  const [totalServices, activeServices, pendingBookings, acceptedBookings] = await Promise.all([
    db.collection("services").countDocuments({ vendorId: user.id }),
    db.collection("services").countDocuments({ vendorId: user.id, active: true }),
    db.collection("bookings").countDocuments({
      $or: [{ vendorId: user.id }, { vendorEmail: user.email }],
      status: "pending",
    }),
    db.collection("bookings").countDocuments({
      $or: [{ vendorId: user.id }, { vendorEmail: user.email }],
      status: "accepted",
    }),
  ]);

  const stats = [
    { label: "Total Services", value: totalServices, icon: Store },
    { label: "Active Services", value: activeServices, icon: BadgeCheck },
    { label: "Pending Requests", value: pendingBookings, icon: CalendarCheck },
    { label: "Accepted Bookings", value: acceptedBookings, icon: BadgeCheck },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
            Vendor Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            Welcome,{" "}
            <span className="italic text-garnet">
              {user.name?.split(" ")[0] ?? "partner"}
            </span>
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-espresso/70">
            Here&apos;s how your wedding business is doing on WedPlan.
          </p>
        </div>
        <Link
          href="/vendor/services/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 rounded-full bg-garnet px-6 font-semibold text-garnet-foreground hover:bg-garnet-deep"
          )}
        >
          <PlusCircle className="size-4" aria-hidden="true" />
          Add Service
        </Link>
      </header>

      {/* Subscription snapshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-garnet/10 text-garnet">
            <Crown className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-espresso/55">
              Current Subscription Plan
            </p>
            <p className="mt-1 flex items-center gap-2 font-heading text-lg font-semibold capitalize text-espresso">
              {plan}
              {plan === "premium" && (
                <span className="inline-flex items-center rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-garnet">
                  Premium vendor
                </span>
              )}
            </p>
          </div>
        </div>
        <p className="text-xs text-espresso/60">
          {plan === "premium"
            ? "Unlimited active services."
            : `${activeServices} of 3 active services used.`}
        </p>
        {plan === "free" && (
          <Link
            href="/vendor/subscription"
            className="text-xs font-semibold text-garnet underline-offset-4 hover:underline"
          >
            Upgrade to Premium →
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-5"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-garnet/10 text-garnet">
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-3xl font-semibold leading-none text-espresso">
                {value}
              </span>
              <span className="mt-1.5 block text-xs font-medium text-espresso/60">
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { href: "/vendor/services", label: "Manage your services", icon: Store },
          { href: "/vendor/bookings", label: "Review booking requests", icon: CalendarCheck },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between rounded-2xl border border-cream-300 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-garnet/30 hover:shadow-lg"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-espresso">
              <Icon className="size-5 text-garnet" aria-hidden="true" />
              {label}
            </span>
            <span className="text-garnet transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
