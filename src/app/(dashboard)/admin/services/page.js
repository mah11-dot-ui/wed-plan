import AccessDenied from "@/components/access-denied";
import AdminServicesTable from "@/components/admin-services-table";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Manage Services — WedPlan Admin",
};

export const instant = false;

export default async function AdminServicesPage() {
  const { blocked, forbidden } = await requireRole("admin", "/admin/services");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="admin" />;

  const docs = await db.collection("services").find({}).sort({ createdAt: -1 }).toArray();

  const services = docs.map((doc) => ({
    id: doc._id.toString(),
    serviceName: doc.serviceName ?? "Untitled service",
    category: doc.category ?? "—",
    price: doc.price ?? 0,
    vendorName: doc.vendorInfo?.name ?? "WedPlan vendor",
    image: doc.serviceImage ?? doc.image ?? null,
    status: doc.status ?? (doc.approved ? "approved" : "pending"),
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Admin · Service Moderation
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          Manage <span className="italic text-garnet">services</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Approve or reject submitted listings. Only approved, active services
          appear on the public Browse Services page.
        </p>
      </header>
      <AdminServicesTable services={services} />
    </div>
  );
}
