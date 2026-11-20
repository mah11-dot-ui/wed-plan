export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="h-72 w-full shrink-0 animate-pulse rounded-2xl bg-cream-200 lg:w-60" />
        <div className="flex-1 space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-full bg-cream-300" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-cream-200" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-cream-200" />
        </div>
      </div>
    </div>
  );
}
