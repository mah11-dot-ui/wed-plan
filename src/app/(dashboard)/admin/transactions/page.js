import { Lock } from "lucide-react";

import AccessDenied from "@/components/access-denied";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Transactions — WedPlan Admin",
};

export const instant = false;

export default async function AdminTransactionsPage() {
  const { blocked, forbidden } = await requireRole("admin", "/admin/transactions");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="admin" />;

  const docs = await db.collection("transactions").find({}).sort({ createdAt: -1 }).toArray();

  const rows = docs.map((doc) => ({
    id: doc._id.toString(),
    vendor: doc.vendorName ?? "Vendor",
    plan: doc.plan ?? "—",
    amount: doc.amount ?? 0,
    currency: doc.currency ?? "BDT",
    status: doc.status ?? "pending",
    date: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Admin · Payments
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          <span className="italic text-garnet">Transactions</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Payment records are written by verified Stripe webhooks only — they
          are read-only here.
        </p>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-200 px-4 py-3 text-xs text-espresso/60">
        <Lock className="size-4 text-garnet" aria-hidden="true" />
        Records cannot be edited manually to mark an unsuccessful payment as successful.
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 px-6 py-16 text-center">
          <h2 className="font-heading text-lg font-semibold text-espresso">No transactions yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-espresso/70">
            Premium subscription payments will appear here once Stripe Checkout
            is enabled.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-300">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-cream-200 text-[10px] font-bold uppercase tracking-widest text-espresso/55">
              <tr>
                <th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-300 bg-background">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-espresso">{r.vendor}</td>
                  <td className="px-4 py-3 capitalize text-espresso/70">{r.plan}</td>
                  <td className="px-4 py-3 text-espresso/70">{r.currency} {r.amount}</td>
                  <td className="px-4 py-3 capitalize text-espresso/70">{r.status}</td>
                  <td className="px-4 py-3 text-xs text-espresso/55">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
