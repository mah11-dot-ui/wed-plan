import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  SearchX,
  Star,
} from "lucide-react";

import BookingPanel from "@/components/booking-panel";
import ServiceGallery from "@/components/service-gallery";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { getSession } from "@/lib/get-session";
import { getServiceBySlug, formatBDT } from "@/lib/services";

export const metadata = {
  title: "Service Details — WedPlan",
};

// Page reads the session per request.
export const instant = false;

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/services/${id}`)}`);
  }

  const service = await getServiceBySlug(id);

  if (!service) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-garnet/5 text-garnet">
          <SearchX className="size-8" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h1 className="font-display text-3xl font-semibold text-espresso">
          We couldn&apos;t find that service
        </h1>
        <p className="max-w-sm text-sm leading-6 text-espresso/70">
          The link may be invalid, or the listing was paused or removed. Only
          approved, active services are available for booking.
        </p>
        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-2 h-11 rounded-full bg-garnet px-6 font-semibold text-garnet-foreground hover:bg-garnet-deep"
          )}
        >
          Browse all services
        </Link>
      </main>
    );
  }

  const { vendor = {} } = service;
  const rating = Number(vendor.rating ?? 0);
  const fullStars = Math.floor(rating);
  const initials = (vendor.name ?? "V")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="flex flex-1 flex-col bg-background">
      {/* Band */}
      <section
        aria-labelledby="service-name"
        className="border-b border-cream-300 bg-cream-200"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso/60 transition-colors hover:text-garnet"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to Browse Services
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Badge
                variant="secondary"
                className="border-none bg-garnet/10 text-garnet"
              >
                {service.category}
              </Badge>
              <h1
                id="service-name"
                className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-espresso sm:text-4xl"
              >
                {service.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-espresso/70">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-garnet/70" aria-hidden="true" />
                  {service.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < fullStars
                            ? "fill-gold text-gold"
                            : "text-cream-300"
                        )}
                      />
                    ))}
                  </span>
                  <span className="font-semibold text-espresso">{rating.toFixed(1)}</span>
                  <span className="text-espresso/50">({service.reviews ?? 0} reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <ServiceGallery
            images={service.images ?? (service.image ? [service.image] : [])}
            name={service.name}
          />

          {/* Description */}
          <section aria-labelledby="about">
            <h2
              id="about"
              className="font-display text-2xl font-semibold tracking-tight text-espresso"
            >
              About this service
            </h2>
            <p className="mt-3 leading-7 text-espresso/80">
              {service.name} is a handpicked {service.category} experience from{" "}
              {vendor.name ?? "one of WedPlan's verified vendors"}, based in{" "}
              {service.location}. Every WedPlan listing is reviewed and approved
              before it goes live — so you can book with total peace of mind.
            </p>
            <p className="mt-3 leading-7 text-espresso/80">
              Expect clear, upfront pricing starting at{" "}
              <span className="font-semibold text-espresso">{formatBDT(service.priceFrom)}</span>,
              direct communication with the vendor once your request is in, and
              support from the WedPlan team every step of the way. Specific
              packages, add-ons and date availability are confirmed directly
              with the vendor after you submit a booking request.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Free, no-obligation booking request",
                "Direct confirmation with the vendor",
                "WedPlan support before and after the event",
                "Approved & active listing",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-200 px-4 py-3 text-xs font-medium text-espresso/80"
                >
                  <BadgeCheck className="size-4 shrink-0 text-garnet" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Vendor */}
          <section aria-labelledby="vendor">
            <h2
              id="vendor"
              className="font-display text-2xl font-semibold tracking-tight text-espresso"
            >
              Meet the vendor
            </h2>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-garnet text-lg font-bold text-garnet-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-base font-semibold text-espresso">
                  <span className="truncate">{vendor.name ?? "WedPlan Vendor"}</span>
                  {vendor.verified && (
                    <BadgeCheck
                      className="size-5 shrink-0 text-garnet"
                      aria-label="Verified vendor"
                    />
                  )}
                </p>
                <p className="mt-0.5 text-xs text-espresso/60">
                  {service.category} · {service.location}
                </p>
                <p className="mt-1 text-xs text-espresso/60">
                  Rating {rating.toFixed(1)} out of 5 · {service.reviews ?? 0} reviews
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Booking panel */}
        <aside aria-label="Book this service">
          <div className="sticky top-24 rounded-2xl border border-cream-300 bg-cream-200 p-6">
            <BookingPanel
              service={service}
              user={session.user}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
