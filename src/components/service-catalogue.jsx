import ServicesFilters from "@/components/services-filters";
import ServicesResults from "@/components/services-results";
import { getServiceLocations } from "@/lib/services";
import { getCategories } from "@/lib/categories";

function firstParam(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

// Async server island — all request-time data for /services (search params,
// categories, locations, results) is read inside the <Suspense> boundary
// in page.js so the static band can prerender into the shell.
export default async function ServicesCatalogue({ searchParams }) {
  const params = await searchParams;
  const search = firstParam(params?.search)?.trim() ?? "";
  const category = firstParam(params?.category) ?? "all";
  const location = firstParam(params?.location) ?? "all";

  const [categories, locations] = await Promise.all([
    getCategories(),
    getServiceLocations(),
  ]);

  return (
    <>
      <ServicesFilters
        search={search}
        category={category}
        location={location}
        categories={categories}
        locations={locations}
      />
      <div className="mt-6">
        <ServicesResults
          search={search}
          category={category}
          location={location}
        />
      </div>
    </>
  );
}
