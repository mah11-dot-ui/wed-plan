import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

// GET form — filtering is server-rendered from URL search params,
// so filters work without client JS and links are shareable.
export default function ServicesFilters({
  search = "",
  category = "all",
  location = "all",
  sort = "",
  categories = [],
  locations = [],
}) {
  return (
    <form
      action="/services"
      method="get"
      className="flex flex-col gap-3 rounded-2xl border border-cream-300 bg-cream-200 p-4 md:flex-row md:items-center"
      aria-label="Filter services"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/45"
          aria-hidden="true"
        />
        <Input
          id="search"
          name="search"
          type="text"
          defaultValue={search}
          placeholder="Search services by name…"
          aria-label="Search services by name"
          autoComplete="off"
          className="h-9 rounded-full border-cream-300 bg-background pl-9 pr-4"
        />
      </div>

      <NativeSelect
        id="category"
        name="category"
        defaultValue={category}
        aria-label="Filter by category"
        className="w-full md:w-60"
      >
        <NativeSelectOption value="all">All categories</NativeSelectOption>
        {categories.map((item) => (
          <NativeSelectOption key={item.slug} value={item.slug}>
            {item.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        id="location"
        name="location"
        defaultValue={location}
        aria-label="Filter by location"
        className="w-full md:w-60"
      >
        <NativeSelectOption value="all">All locations</NativeSelectOption>
        {locations.map((item) => (
          <NativeSelectOption key={item} value={item}>
            {item}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        id="sort"
        name="sort"
        defaultValue={sort}
        aria-label="Sort services"
        className="w-full md:w-52"
      >
        <NativeSelectOption value="">Recommended</NativeSelectOption>
        <NativeSelectOption value="price_asc">Price: Low to High</NativeSelectOption>
        <NativeSelectOption value="price_desc">Price: High to Low</NativeSelectOption>
      </NativeSelect>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="h-9 rounded-full bg-garnet px-5 font-medium text-garnet-foreground hover:bg-garnet-deep"
        >
          <Search className="size-4" aria-hidden="true" />
          Search
        </Button>
        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 rounded-full px-4 text-espresso/70 hover:bg-garnet/5 hover:text-garnet"
          )}
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
