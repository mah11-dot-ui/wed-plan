"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";

import { cn } from "cn";
import { useToast } from "@/components/toast-provider";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  accepted: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
  cancelled: "bg-cream-300 text-espresso/60",
};

export default function CustomerBookingCard({ booking }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, { method: "PATCH" });
      const data = await response.json();
      if (!response.ok) error(data?.message ?? "Could not cancel the booking.");
      else {
        success("Booking request cancelled.");
        router.refresh();
      }
    } catch {
      error("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-200">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {booking.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={booking.image} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-garnet/5 text-xs text-garnet/50">
            No image
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-espresso">
              {booking.serviceName}
            </h3>
            <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest", statusStyles[booking.status] ?? statusStyles.pending)}>
              {booking.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-espresso/60">{booking.vendorName}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-espresso/60">
            <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-garnet/70" aria-hidden="true" />{booking.eventDate}</span>
            <span className="flex items-center gap-1"><MapPin className="size-3.5 text-garnet/70" aria-hidden="true" />{booking.eventLocation}</span>
            <span className="flex items-center gap-1"><Clock className="size-3.5 text-garnet/70" aria-hidden="true" />Requested {booking.requestedAt}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
          >
            Details
            <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
          </button>
          {booking.status === "pending" && (
            <button
              type="button"
              disabled={busy}
              onClick={cancel}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-4 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <XCircle className="size-3.5" aria-hidden="true" />}
              Cancel
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="grid gap-3 border-t border-cream-300 bg-background p-4 text-xs text-espresso/70 sm:grid-cols-2">
          <p><span className="font-semibold text-espresso/85">Service:</span> {booking.serviceName}</p>
          <p><span className="font-semibold text-espresso/85">Vendor:</span> {booking.vendorName}</p>
          <p><span className="font-semibold text-espresso/85">Event date:</span> {booking.eventDate}</p>
          <p><span className="font-semibold text-espresso/85">Location:</span> {booking.eventLocation}</p>
          <p><span className="font-semibold text-espresso/85">Guests:</span> {booking.guests}</p>
          <p><span className="font-semibold text-espresso/85">Message:</span> {booking.message || "—"}</p>
          <p><span className="font-semibold text-espresso/85">Requested:</span> {booking.requestedAt}</p>
          <p><span className="font-semibold text-espresso/85">Status:</span> {booking.status}</p>
        </div>
      )}
    </li>
  );
}
