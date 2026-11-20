"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Loader2, MapPin, X } from "lucide-react";

import { cn } from "cn";
import { apiFetch } from "@/lib/api-client";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  accepted: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
};

export default function BookingActions({ bookings }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const decide = async (id, status) => {
    setError("");
    setBusyId(id);
    try {
      const response = await apiFetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) setError(data?.message ?? "Could not update the booking.");
      else router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {bookings.map((booking) => (
        <div key={booking.id} className="rounded-2xl border border-cream-300 bg-cream-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading text-base font-semibold leading-snug text-espresso">
                {booking.serviceName}
              </h3>
              <p className="mt-1 text-xs font-medium text-garnet">
                {booking.customerName} · {booking.customerEmail}
              </p>
              <p className="mt-0.5 text-[11px] text-espresso/55">Phone: {booking.phone}</p>
            </div>
            <span className={cn("inline-flex shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest", statusStyles[booking.status] ?? statusStyles.pending)}>
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid gap-2 border-t border-cream-300 pt-4 text-xs text-espresso/70 sm:grid-cols-2">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4 text-garnet/70" aria-hidden="true" />
              {booking.eventDate}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-garnet/70" aria-hidden="true" />
              {booking.eventLocation || "Location not specified"}
            </span>
            <span>Guests: {booking.guests}</span>
            <span>Price: ৳{Number(booking.priceFrom ?? 0).toLocaleString("en-US")}</span>
          </div>

          {booking.message && (
            <p className="mt-3 rounded-xl bg-background p-3 text-xs leading-6 text-espresso/70">
              <span className="font-semibold text-espresso/85">Message: </span>
              {booking.message}
            </p>
          )}

          {booking.status === "pending" ? (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={busyId === booking.id}
                onClick={() => decide(booking.id, "accepted")}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-garnet text-xs font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:opacity-60"
              >
                {busyId === booking.id ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
                Accept
              </button>
              <button
                type="button"
                disabled={busyId === booking.id}
                onClick={() => decide(booking.id, "rejected")}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
              >
                <X className="size-4" aria-hidden="true" />
                Reject
              </button>
            </div>
          ) : (
            <p className="mt-3 text-[11px] font-medium text-espresso/45">
              This request is {booking.status} and can no longer be changed.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
