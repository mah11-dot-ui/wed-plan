import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

import AccessDenied from "@/components/access-denied";
import CustomerBookingCard from "@/components/customer-booking-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Customer Dashboard — WedPlan",
};

export const instant = false;

export default async function CustomerDashboardPage() {
  const { blocked, forbidden, user } = await requireRole("customer", "/dashboard");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="customer" />;

  const docs = await db
    .collection("bookings")
    .find({ customerId: user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const count = (status) => docs.filter((d) => (d.status ?? "pending") === status).length;

  const bookings = docs.map((doc) => ({
    id: doc._id.toString(),
    serviceName: doc.serviceName ?? "Wedding service",
    image: doc.serviceImage ?? null,
    vendorName: doc.vendorName ?? "WedPlan vendor",
    eventDate: doc.eventDate
      ? new Date(doc.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
    eventLocation: doc.eventLocation ?? "Not specified",
    guests: doc.guests ?? "—",
    message: doc.message ?? "",
    status: doc.status ?? "pending",
    requestedAt: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
  }));

  const stats = [
    { label: "Total Booking Requests", value: docs.length, icon: CalendarCheck },
    { label: "Pending Bookings", value: count("pending"), icon: Clock },
    { label: "Accepted Bookings", value: count("accepted"), icon: CheckCircle2 },
    { label: "Rejected Bookings", value: count("rejected"), icon: XCircle },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
            Customer Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
            Welcome back,{" "}
            <span className="italic text-garnet">{user.name?.split(" ")[0] ?? "there"}</span>
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-espresso/70">
            Track every booking request, from first message to the big day.
          </p>
        </div>
        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 rounded-full bg-garnet px-6 font-semibold text-garnet-foreground hover:bg-garnet-deep"
          )}
        >
          Browse services
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <section aria-labelledby="my-bookings">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 id="my-bookings" className="font-display text-2xl font-semibold tracking-tight text-espresso">
            My bookings
          </h2>
          <Link href="/services" className="text-sm font-medium text-garnet hover:underline">
            Find more services →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cream-300 px-6 py-16 text-center">
            <h3 className="font-heading text-lg font-semibold text-espresso">No bookings yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-espresso/70">
              Request a wedding service and it will appear here with images,
              dates and status.
            </p>
            <Link href="/services" className="mt-4 inline-flex h-11 items-center rounded-full bg-garnet px-6 text-sm font-semibold text-garnet-foreground hover:bg-garnet-deep">
              Explore wedding services
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <CustomerBookingCard key={booking.id} booking={booking} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
