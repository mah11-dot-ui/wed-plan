import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SectionHeading from "@/components/section-heading";
import ServiceCard from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { getFeaturedServices } from "@/lib/services";

// Dynamic section — runs per request (see src/lib/services.js).
export default async function FeaturedServices() {
  const services = await getFeaturedServices(6);

  return (
    <section
      aria-labelledby="featured-services"
      className="border-b border-cream-300 bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="Featured Services"
            title="Handpicked for your big day"
            description="Only approved, active vendors make the cut — every listing is reviewed and rated by real couples."
          />
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden h-10 rounded-full px-5 font-medium text-espresso hover:bg-garnet/5 hover:text-garnet sm:inline-flex"
            )}
          >
            View all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 rounded-full px-5 font-medium text-espresso hover:bg-garnet/5 hover:text-garnet"
            )}
          >
            View all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
