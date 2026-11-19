import Link from "next/link";
import {
  Building2,
  Camera,
  Flower2,
  Gem,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import SectionHeading from "@/components/section-heading";
import { getCategories } from "@/lib/categories";

const categoryIcons = {
  photography: Camera,
  venues: Building2,
  decoration: Flower2,
  catering: UtensilsCrossed,
  makeup: Sparkles,
  fashion: Gem,
};

// Dynamic section — runs per request (see src/lib/categories.js).
export default async function ServiceCategories() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="service-categories"
      className="border-b border-cream-300 bg-cream-200"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          overline="Browse by Category"
          title="Every detail, one roof"
          description="Explore approved vendors across every category of your celebration — tap a category to start comparing."
        />

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Sparkles;
            return (
              <li key={category.slug}>
                <Link
                    href={`/services?category=${category.slug}`}
                    aria-label={`Explore ${category.name}`}
                    className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-cream-300 bg-cream px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-garnet/30 hover:shadow-lg hover:shadow-garnet/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garnet/40"
                  >
                    <span className="grid size-14 place-items-center rounded-2xl bg-garnet/5 text-garnet transition-all duration-300 group-hover:bg-garnet group-hover:text-garnet-foreground">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-tight text-espresso transition-colors duration-300 group-hover:text-garnet">
                      {category.name}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wide text-espresso/50">
                      {category.vendors}
                    </span>
                  </Link>
                </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
