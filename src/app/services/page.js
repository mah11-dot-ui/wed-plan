import { connection } from "next/server";

import ServicesCatalogue from "@/components/service-catalogue";

export const metadata = {
  title: "Browse Wedding Services — WedPlan",
  description:
    "Explore approved wedding services on WedPlan — photographers, venues, decorators, caterers, makeup artists and more. Filter by category and location, free to browse.",
};

// Blocking route — rendered fresh at request time, always shows current data.
export const instant = false;

export default async function ServicesPage({ searchParams }) {
  await connection();

  return (
    <main className="flex flex-1 flex-col bg-background">
      <section
        aria-labelledby="browse-services"
        className="border-b border-cream-300 bg-cream-200"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
            Browse Services
          </p>
          <h1
            id="browse-services"
            className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl"
          >
            Find your perfect{" "}
            <span className="italic text-garnet">wedding team</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-espresso/70">
            Every listing here is approved and active. Search by name, filter
            by category or location — no account needed.
          </p>
        </div>
      </section>

      <section
        aria-label="Services catalogue"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        <ServicesCatalogue searchParams={searchParams} />
      </section>
    </main>
  );
}
