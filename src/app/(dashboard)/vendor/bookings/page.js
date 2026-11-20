import AccessDenied from "@/components/access-denied";
import BookingActions from "@/components/booking-actions";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Booking Requests — WedPlan Vendor",
};

export const instant = false;

export default async function VendorBookingsPage() {
  const { blocked, forbidden, user } = await requireRole("vendor", "/vendor/bookings");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  const docs = await db
    .collection("bookings")
    .find({
      $or: [{ vendorId: user.id }, { vendorEmail: user.email }],
    })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const bookings = docs.map((doc) => ({
    id: doc._id.toString(),
    serviceName: doc.serviceName ?? "Wedding service",
    customerName: doc.customerName ?? "Customer",
    customerEmail: doc.customerEmail ?? "—",
    phone: doc.phone ?? "—",
    eventDate: doc.eventDate
      ? new Date(doc.eventDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",
    eventLocation: doc.eventLocation ?? "Not specified",
    guests: doc.guests ?? "—",
    priceFrom: doc.priceFrom ?? 0,
    message: doc.message ?? "",
    status: doc.status ?? "pending",
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Vendor Studio
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          Booking <span className="italic text-garnet">requests</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Review requests for your services. Only pending requests can be
          accepted or rejected.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 px-6 py-16 text-center">
          <h2 className="font-heading text-lg font-semibold text-espresso">
            No booking requests yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-espresso/70">
            When a customer requests one of your services, it appears here.
          </p>
        </div>
      ) : (
        <BookingActions bookings={bookings} />
      )}
    </div>
  );
}
