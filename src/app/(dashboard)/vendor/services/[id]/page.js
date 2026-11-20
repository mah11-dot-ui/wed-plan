import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, XCircle } from "lucide-react";
import { ObjectId } from "mongodb";

import AccessDenied from "@/components/access-denied";
import ServiceForm from "@/components/service-form";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Service Details — WedPlan Vendor",
};

export const instant = false;

export default async function EditServicePage({ params }) {
  const { blocked, forbidden, user } = await requireRole("vendor", "/vendor/services/[id]");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="vendor" />;

  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const doc = await db.collection("services").findOne({
    _id: new ObjectId(id),
    vendorId: user.id, // ownership — another vendor's service is invisible
  });
  if (!doc) notFound();

  const status = doc.status ?? (doc.approved ? "approved" : "pending");

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
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-espresso">
          Edit <span className="italic text-garnet">service</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-5">
        <span
          className={`grid size-11 place-items-center rounded-xl ${status === "approved" ? "bg-emerald-600/10 text-emerald-600" : status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}
        >
          {status === "approved" ? (
            <BadgeCheck className="size-5" aria-hidden="true" />
          ) : status === "rejected" ? (
            <XCircle className="size-5" aria-hidden="true" />
          ) : (
            <BadgeCheck className="size-5" aria-hidden="true" />
          )}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-espresso/55">
            Approval status
          </p>
          <p className="mt-1 font-heading text-base font-semibold capitalize text-espresso">
            {status}
          </p>
          <p className="mt-0.5 text-[11px] text-espresso/55">
            {status === "pending"
              ? "Waiting for admin approval."
              : status === "rejected"
                ? "Not visible to customers. Edit and resubmit to request approval again."
                : "Live on WedPlan. Editing resets the service to pending."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-cream-300 bg-cream-200 p-6">
        <ServiceForm
          serviceId={doc._id.toString()}
          initial={{
            serviceName: doc.serviceName,
            categorySlug: doc.categorySlug ?? "photography",
            description: doc.description,
            price: doc.price,
            location: doc.location,
            serviceImage: doc.serviceImage,
          }}
        />
      </div>
    </div>
  );
}
