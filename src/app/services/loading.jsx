export default function ServicesLoading() {
  return (
    <main aria-busy="true" aria-label="Loading services" className="flex flex-1 flex-col bg-background">
      <div className="border-b border-cream-300 bg-cream-200 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-4 w-36 animate-pulse rounded-full bg-cream-300" />
          <div className="mt-4 h-12 w-80 max-w-full animate-pulse rounded-full bg-cream-300" />
          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-full bg-cream-200" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-14 animate-pulse rounded-2xl bg-cream-200" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-cream-300">
              <div className="aspect-[16/10] animate-pulse bg-cream-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 animate-pulse rounded-full bg-cream-200" />
                <div className="h-10 w-full animate-pulse rounded-full bg-cream-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
