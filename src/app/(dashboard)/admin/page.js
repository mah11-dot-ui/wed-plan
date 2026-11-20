import { BadgeCheck, Store, Users, Wallet } from "lucide-react";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";
import AccessDenied from "@/components/access-denied";

export const metadata = {
  title: "Admin Dashboard — WedPlan",
};

export const instant = false;

export default async function AdminPage() {
  const { blocked, forbidden } = await requireRole("admin", "/admin");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="admin" />;

  const [totalUsers, vendors, customers, totalServices, pendingServices, transactions] =
    await Promise.all([
      db.collection("user").countDocuments({}),
      db.collection("user").countDocuments({ role: "vendor" }),
      db.collection("user").countDocuments({ role: "customer" }),
      db.collection("services").countDocuments({}),
      db.collection("services").countDocuments({ status: "pending", approved: false }),
      db.collection("transactions").countDocuments({}),
    ]);

  const stats = [
    { label: "Total Registered Users", value: totalUsers, icon: Users },
    { label: "Total Vendors", value: vendors, icon: Store },
    { label: "Total Customers", value: customers, icon: Users },
    { label: "Total Services", value: totalServices, icon: Store },
    { label: "Pending Services", value: pendingServices, icon: BadgeCheck },
    { label: "Total Transactions", value: transactions, icon: Wallet },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Admin Dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
          Platform <span className="italic text-garnet">overview</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          A live snapshot of WedPlan — users, services and payments.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-garnet/10 text-garnet">
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-3xl font-semibold leading-none text-espresso">{value}</span>
              <span className="mt-1.5 block text-xs font-medium text-espresso/60">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-200 p-5 text-xs leading-6 text-espresso/70">
        Use the sidebar to manage users, review pending services and inspect
        payment transactions. Payment records are read-only — they can only be
        created by verified Stripe webhooks.
      </div>
    </div>
  );
}
