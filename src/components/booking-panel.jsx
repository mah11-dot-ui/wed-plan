"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Store,
  Users,
} from "lucide-react";

import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";
import { apiFetch } from "@/lib/api-client";
import { formatBDT } from "@/lib/services";

const inputClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15";

export default function BookingPanel({ service, user }) {
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ state: "idle" }); // idle | submitting | error | success
  const { success: toastSuccess, error: toastError } = useToast();

  const role = user?.role ?? "customer";
  const vendorEmail = service?.vendor?.email?.toLowerCase?.() ?? null;
  const userEmail = user?.email?.toLowerCase?.() ?? null;
  const isOwnService = role === "vendor" && vendorEmail && userEmail === vendorEmail;

  const today = new Date().toISOString().split("T")[0];

  if (status.state === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-emerald-600/10">
          <CheckCircle2 className="size-8 text-emerald-600" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-xl font-semibold text-espresso">
          Request received!
        </h2>
        <p className="max-w-xs text-sm leading-6 text-espresso/70">{status.message}</p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-espresso/45">
          Booking ID: {status.bookingId}
        </p>
        <Link
          href="/services"
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-garnet px-6 text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep"
        >
          Explore more services
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/55">
          Request this service
        </p>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-4xl font-semibold tracking-tight text-garnet">
            From {formatBDT(service.priceFrom)}
          </span>
          <span className="text-xs text-espresso/55">starting price</span>
        </p>
      </div>

      {/* Vendor info */}
      <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-background p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-garnet/5 text-sm font-bold text-garnet">
          {(service.vendor?.name ?? "V")
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("")}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-espresso">
            <span className="truncate">{service.vendor?.name ?? "WedPlan Vendor"}</span>
            {service.vendor?.verified && (
              <BadgeCheck
                className="size-4 shrink-0 text-garnet"
                aria-label="Verified vendor"
              />
            )}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-espresso/60">
            {vendorEmail && (
              <a
                href={`mailto:${vendorEmail}`}
                className="flex items-center gap-1 transition-colors hover:text-garnet"
              >
                <Mail className="size-3" aria-hidden="true" />
                {vendorEmail}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Store className="size-3" aria-hidden="true" />
              WedPlan vendor
            </span>
          </div>
        </div>
      </div>

      {role === "admin" ? (
        <p className="rounded-xl border border-cream-300 bg-background px-4 py-3 text-sm leading-6 text-espresso/75">
          Admin accounts can&apos;t submit customer booking requests — they
          manage vendors and bookings instead.
        </p>
      ) : isOwnService ? (
        <p className="rounded-xl border border-cream-300 bg-background px-4 py-3 text-sm leading-6 text-espresso/75">
          This is your own listing — vendors can&apos;t book their own
          services.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setStatus({ state: "submitting" });
            try {
              const response = await apiFetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceSlug: service.slug,
                  eventDate,
                  eventLocation,
                  guests: guests ? Number(guests) : undefined,
                  phone,
                  message,
                }),
              });
              const data = await response.json();
              if (!response.ok) {
                setStatus({
                  state: "error",
                  message: data?.message ?? "Could not send your request.",
                  errors: data?.errors ?? {},
                });
                toastError(data?.message ?? "Could not send your request.");
                return;
              }
              setStatus({ state: "success", message: data.message, bookingId: data.bookingId });
              toastSuccess("Booking request sent!");
            } catch {
              setStatus({
                state: "error",
                message: "Network error — please check your connection and try again.",
                errors: {},
              });
              toastError("Network error — please try again.");
            }
          }}
        >
          {status.state === "error" && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive"
            >
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="eventDate" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
                Event date
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
                <input
                  id="eventDate"
                  type="date"
                  min={today}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={cn(inputClass, "pl-10 pr-2", status.errors?.eventDate && "border-destructive")}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="guests" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
                Guests
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="10000"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="150"
                  className={cn(inputClass, "pl-10 pr-2", status.errors?.guests && "border-destructive")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="eventLocation" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
              Event Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
              <input
                id="eventLocation"
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Venue or city"
                className={cn(inputClass, "pl-11", status.errors?.eventLocation && "border-destructive")}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
              Phone
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1X-XXXX-XXXX"
                autoComplete="tel"
                className={cn(inputClass, "pl-11", status.errors?.phone && "border-destructive")}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
              Message <span className="font-normal normal-case text-espresso/40">(optional)</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anything the vendor should know…"
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-cream-300 bg-background px-4 py-3 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15"
            />
          </div>

          <button
            type="submit"
            disabled={status.state === "submitting"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-garnet text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status.state === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending request…
              </>
            ) : (
              <>Request Booking</>
            )}
          </button>
          <p className="text-center text-[10px] leading-4 text-espresso/45">
            No payment is due now — the vendor will contact you to confirm
            details and availability.
          </p>
        </form>
      )}
    </div>
  );
}
