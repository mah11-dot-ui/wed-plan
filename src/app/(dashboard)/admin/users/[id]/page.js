import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Phone, Store, User } from "lucide-react";
import { ObjectId } from "mongodb";

import AccessDenied from "@/components/access-denied";
import AdminBlockButton from "@/components/admin-block-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "User Details — WedPlan Admin",
};

export const instant = false;

export default async function UserDetailsPage({ params }) {
  const { blocked, forbidden, user: admin } = await requireRole("admin", "/admin/users/[id]");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="admin" />;

  const { id } = await params;
  const valid = ObjectId.isValid(id);
  const doc = valid ? await db.collection("user").findOne({ _id: new ObjectId(id) }) : null;

  if (!doc) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-cream-300 px-6 py-16 text-center">
        <h1 className="font-heading text-xl font-semibold text-espresso">User not found</h1>
        <p className="text-sm text-espresso/70">
          This account may have been removed or the link is invalid.
        </p>
        <Link href="/admin/users" className={cn(buttonVariants({ variant: "outline" }), "h-10 rounded-full")}>
          Back to Manage Users
        </Link>
      </div>
    );
  }

  const role = doc.role ?? "customer";
  const isBlocked = Boolean(doc.blocked || doc.isBlocked);
  const isSelf = doc._id.toString() === admin.id;

  const [serviceCount, bookingCount] = await Promise.all([
    role === "vendor"
      ? db.collection("services").countDocuments({ vendorId: doc._id.toString() })
      : Promise.resolve(0),
    role === "customer"
      ? db.collection("bookings").countDocuments({ customerId: doc._id.toString() })
      : Promise.resolve(0),
  ]);

  const details = [
    { label: "Account role", value: role, icon: User },
    { label: "Email", value: doc.email ?? "—", icon: Mail },
    { label: "Phone", value: doc.phone ?? "Not provided", icon: Phone },
    ...(role === "vendor"
      ? [{ label: "Business name", value: doc.businessName ?? "Not provided", icon: Store }]
      : []),
    { label: "Subscription", value: doc.subscriptionPlan ?? doc.plan ?? "free", icon: Store },
    { label: "Joined", value: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—", icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso/60 transition-colors hover:text-garnet"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Manage Users
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        {doc.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={doc.image} alt="" className="size-16 rounded-2xl object-cover" />
        ) : (
          <span className="grid size-16 place-items-center rounded-2xl bg-garnet text-lg font-bold text-garnet-foreground">
            {(doc.name ?? "U").slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-espresso">
            {doc.name ?? "Unnamed user"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-garnet/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-garnet">
              {role}
            </span>
            <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest", isBlocked ? "bg-destructive/10 text-destructive" : "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400")}>
              {isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
        </div>
        <AdminBlockButton userId={doc._id.toString()} blocked={isBlocked} isSelf={isSelf} />
      </header>

      <section aria-labelledby="account-details" className="rounded-2xl border border-cream-300 bg-cream-200 p-6">
        <h2 id="account-details" className="font-heading text-lg font-semibold text-espresso">
          Account details
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {details.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-cream-300 bg-background p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-espresso/55">
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 break-all text-sm font-medium capitalize text-espresso">{value}</dd>
            </div>
          ))}
          {role === "vendor" && (
            <div className="rounded-xl border border-cream-300 bg-background p-4">
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-espresso/55">Services submitted</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-espresso">{serviceCount}</dd>
            </div>
          )}
          {role === "customer" && (
            <div className="rounded-xl border border-cream-300 bg-background p-4">
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-espresso/55">Booking requests</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-espresso">{bookingCount}</dd>
            </div>
          )}
        </dl>
        <p className="mt-4 text-[11px] text-espresso/45">User ID: {doc._id.toString()}</p>
      </section>

      <div className="rounded-xl border border-cream-300 bg-background p-4 text-xs leading-6 text-espresso/60">
        Blocked users cannot access dashboards, service details or booking
        actions. Blocking takes effect on their next request — no re-login
        required.
      </div>
    </div>
  );
}
