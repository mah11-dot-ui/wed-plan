import Link from "next/link";
import { PlusCircle } from "lucide-react";

import AccessDenied from "@/components/access-denied";
import VendorServiceList from "@/components/vendor-service-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "My Services — WedPlan Vendor",
};

export const instant = false;

export default async function MyServicesPage() {
  const { blocked, forbidden, user } = await requireRole("vendor", "/vendor/services");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  const docs = await db
    .collection("services")
    .find({ vendorId: user.id })
    .sort({ createdAt: -1 })
    .toArray();

  const services = docs.map((doc) => ({
    id: doc._id.toString(),
    serviceName: doc.serviceName,
    category: doc.category,
    location: doc.location,
    price: doc.price,
    status: doc.status ?? (doc.approved ? "approved" : "pending"),
    active: Boolean(doc.active),
    image: doc.serviceImage ?? doc.image ?? null,
  }));

  const activeCount = services.filter((s) => s.active).length;
  const isPremium = (user.plan ?? "free") === "premium";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
            Vendor Studio
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
            My <span className="italic text-garnet">services</span>
          </h1>
          <p className="mt-1 text-xs text-espresso/60">
            {activeCount} active {isPremium ? "(unlimited with Premium)" : "of 3 on the Free plan"}
          </p>
        </div>
        <Link
          href="/vendor/services/new"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 rounded-full bg-garnet px-6 font-semibold text-garnet-foreground hover:bg-garnet-deep"
          )}
        >
          <PlusCircle className="size-4" aria-hidden="true" />
          Add Service
        </Link>
      </header>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 px-6 py-16 text-center">
          <h2 className="font-heading text-lg font-semibold text-espresso">
            No services yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-espresso/70">
            Add your first listing — it will be reviewed by an admin before
            couples can see it.
          </p>
        </div>
      ) : (
        <VendorServiceList services={services} />
      )}
    </div>
  );
}
