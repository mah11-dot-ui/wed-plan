import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AccessDenied from "@/components/access-denied";
import ServiceForm from "@/components/service-form";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Add Service — WedPlan Vendor",
};

export const instant = false;

export default async function AddServicePage() {
  const { blocked, forbidden } = await requireRole("vendor", "/vendor/services/new");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/vendor/services"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso/60 transition-colors hover:text-garnet"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          My Services
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Vendor Studio
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          Add a new <span className="italic text-garnet">service</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Fill in the details below. Your listing stays pending until an admin
          approves it.
        </p>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-200 p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
