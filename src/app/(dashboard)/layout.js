import { headers } from "next/headers";

import DashboardSidebar from "@/components/dashboard-sidebar";
import { auth } from "@/lib/auth";

// Shared dashboard shell — role-aware sidebar + main content area.
// Individual pages still perform strict, server-side role checks.
export const instant = false;

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  const role = user?.role ?? "customer";
  const plan = user?.plan ?? "free";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      {user && <DashboardSidebar role={role} plan={plan} />}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
