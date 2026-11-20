"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShieldBan, ShieldCheck } from "lucide-react";

import { cn } from "cn";
import { useToast } from "@/components/toast-provider";
import { apiFetch } from "@/lib/api-client";

export default function AdminUsersTable({ users }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (role === "all" || u.role === role) &&
        (!needle ||
          u.name?.toLowerCase().includes(needle) ||
          u.email?.toLowerCase().includes(needle))
    );
  }, [users, query, role]);

  const toggleBlock = async (id, isBlocked) => {
    setBusyId(id);
    try {
      const response = await apiFetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      const data = await response.json();
      if (!response.ok) error(data?.message ?? "Could not update this user.");
      else {
        success(data.message);
        router.refresh();
      }
    } catch {
      error("Network error — please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-cream-300 bg-cream-200 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/45" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            aria-label="Search users"
            className="h-10 w-full rounded-xl border border-cream-300 bg-background pl-10 pr-4 text-sm text-espresso outline-none focus:border-garnet"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Filter by role"
          className="h-10 rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none focus:border-garnet"
        >
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
        <p className="text-xs text-espresso/55">{filtered.length} of {users.length} users</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cream-300">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-cream-200 text-[10px] font-bold uppercase tracking-widest text-espresso/55">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-300 bg-background">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium capitalize text-espresso">{u.name ?? "—"}</p>
                  <p className="text-xs text-espresso/55">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-garnet/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-garnet">
                    {u.role ?? "customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-espresso/60">{u.joined}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest", u.blocked ? "bg-destructive/10 text-destructive" : "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400")}>
                    {u.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex h-9 items-center rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === u.id || u.isSelf}
                      onClick={() => toggleBlock(u.id, u.blocked)}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-colors disabled:opacity-50",
                      u.blocked
                        ? "border-emerald-600/30 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400"
                        : "border-destructive/30 text-destructive hover:bg-destructive/10"
                    )}
                  >
                    {busyId === u.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : u.blocked ? <ShieldCheck className="size-3.5" aria-hidden="true" /> : <ShieldBan className="size-3.5" aria-hidden="true" />}
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-espresso/60">No users match your filters.</p>
        )}
      </div>
    </div>
  );
}
