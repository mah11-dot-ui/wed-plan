import AccessDenied from "@/components/access-denied";
import AdminUsersTable from "@/components/admin-users-table";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/require-auth";

export const metadata = {
  title: "Manage Users — WedPlan Admin",
};

export const instant = false;

export default async function AdminUsersPage() {
  const { blocked, forbidden, user } = await requireRole("admin", "/admin/users");

  if (blocked) return <AccessDenied kind="blocked" />;
  if (forbidden) return <AccessDenied kind="forbidden" role="admin" />;

  const docs = await db.collection("user").find({}).sort({ createdAt: -1 }).toArray();

  const users = docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name ?? "—",
    email: doc.email ?? "—",
    role: doc.role ?? "customer",
    blocked: Boolean(doc.blocked || doc.isBlocked),
    isSelf: doc._id.toString() === user.id,
    joined: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "—",
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
          Admin · User Management
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-espresso">
          Manage <span className="italic text-garnet">users</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-espresso/70">
          Search, filter and block accounts. Blocked users immediately lose
          access to all protected platform features.
        </p>
      </header>
      <AdminUsersTable users={users} />
    </div>
  );
}
