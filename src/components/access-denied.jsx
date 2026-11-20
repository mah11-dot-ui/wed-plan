import Link from "next/link";
import { ShieldX, OctagonX } from "lucide-react";

// Shared full-page states for blocked / unauthorized access to a route.
export default function AccessDenied({ kind, role }) {
  const isBlocked = kind === "blocked";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-background px-4 py-24 text-center">
      <span
        className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive"
        aria-hidden="true"
      >
        {isBlocked ? (
          <OctagonX className="size-8" strokeWidth={1.5} />
        ) : (
          <ShieldX className="size-8" strokeWidth={1.5} />
        )}
      </span>
      <h1 className="font-display text-3xl font-semibold text-espresso">
        {isBlocked ? "Your account is suspended" : "You don't have access"}
      </h1>
      <p className="max-w-sm text-sm leading-6 text-espresso/70">
        {isBlocked
          ? "Your WedPlan account has been suspended. If you believe this is a mistake, please contact support@wedplan.com."
          : role
            ? `This area is reserved for ${role} accounts.`
            : "You don't have permission to view this page."}
      </p>
      <Link href="/" className="font-medium text-garnet hover:underline">
        Back to home
      </Link>
    </main>
  );
}
