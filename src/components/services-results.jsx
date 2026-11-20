import Link from "next/link";
import { SearchX } from "lucide-react";

import ServiceCard from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { getServices } from "@/lib/services";

export default async function ServicesResults({
  search = "",
  category = "all",
  location = "all",
  sort = "",
}) {
  const services = await getServices({ search, category, location, sort });

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-cream-300 px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-garnet/5 text-garnet">
          <SearchX className="size-7" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-xl font-semibold text-espresso">
          No services match those filters
        </h2>
        <p className="max-w-sm text-sm leading-6 text-espresso/70">
          Try a broader search, a different category or location — or clear
          the filters to see everything available.
        </p>
        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 rounded-full border-cream-300 text-espresso hover:border-garnet/40 hover:bg-garnet/5 hover:text-garnet"
          )}
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  const activeFilters = [
    search ? `“${search}”` : null,
    category !== "all" ? category.replace(/-/g, " ") : null,
    location !== "all" ? location : null,
  ].filter(Boolean);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-espresso/70" aria-live="polite">
          <span className="font-semibold text-espresso">
            {services.length}
          </span>{" "}
          {services.length === 1 ? "service" : "services"} found
          {activeFilters.length > 0 && (
            <>
              {" "}
              for{" "}
              <span className="font-medium text-espresso">
                {activeFilters.join(" · ")}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard
            key={`${service.slug ?? service.name}-${index}`}
            service={service}
          />
        ))}
      </div>
    </>
  );
}
