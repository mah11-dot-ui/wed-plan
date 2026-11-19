// Skeleton placeholders for the dynamic sections — prerendered into the
// static shell while Featured Services / Categories stream in per request.

export function ServicesResultsFallback() {
  return (
    <div aria-busy="true" aria-label="Services are loading">
      {/* filter bar skeleton */}
      <div className="flex flex-col gap-3 rounded-2xl border border-cream-300 bg-cream-200 p-4 md:flex-row md:items-center">
        <div className="h-9 flex-1 animate-pulse rounded-full bg-cream-300" />
        <div className="h-9 w-full animate-pulse rounded-full bg-cream-300 md:w-60" />
        <div className="h-9 w-full animate-pulse rounded-full bg-cream-300 md:w-60" />
        <div className="h-9 w-full animate-pulse rounded-full bg-cream-300 md:w-40" />
      </div>
      <div className="mt-6">
        <div className="h-4 w-40 animate-pulse rounded-full bg-cream-300" />
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-cream-300"
          >
            <div className="aspect-[16/10] animate-pulse bg-cream-200" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-cream-200" />
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 animate-pulse rounded-full bg-cream-200" />
                <div className="h-4 w-20 animate-pulse rounded-full bg-cream-200" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-full bg-cream-200" />
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturedServicesFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Featured services are loading"
      className="border-b border-cream-300 bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="h-4 w-44 animate-pulse rounded-full bg-cream-300" />
        <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded-full bg-cream-300" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded-full bg-cream-200" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-cream-300"
            >
              <div className="aspect-[16/10] animate-pulse bg-cream-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 animate-pulse rounded-full bg-cream-200" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-cream-200" />
                  <div className="h-4 w-20 animate-pulse rounded-full bg-cream-200" />
                </div>
                <div className="h-10 w-full animate-pulse rounded-full bg-cream-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCategoriesFallback() {
  return (
    <section
      aria-busy="true"
      aria-label="Service categories are loading"
      className="border-b border-cream-300 bg-cream-200"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="h-4 w-40 animate-pulse rounded-full bg-cream-300" />
        <div className="mt-3 h-9 w-72 max-w-full animate-pulse rounded-full bg-cream-300" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-cream-300 bg-cream"
            >
              <div className="size-12 animate-pulse rounded-2xl bg-cream-300" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-cream-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
