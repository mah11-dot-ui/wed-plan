"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Search, Trash2, X } from "lucide-react";

import { cn } from "cn";
import { useToast } from "@/components/toast-provider";
import { apiFetch } from "@/lib/api-client";

const styles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  approved: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AdminServicesTable({ services }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter(
      (s) =>
        (status === "all" || s.status === status) &&
        (!needle ||
          s.serviceName?.toLowerCase().includes(needle) ||
          s.category?.toLowerCase().includes(needle) ||
          s.vendorName?.toLowerCase().includes(needle))
    );
  }, [services, query, status]);

  const act = async (id, mode, nextStatus) => {
    setBusyId(`${id}-${mode}`);
    try {
      const response = await apiFetch(`/api/services/${id}`, {
        method: mode === "delete" ? "DELETE" : "PATCH",
        ...(mode === "delete"
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: nextStatus }),
            }),
      });
      const data = await response.json();
      if (!response.ok) error(data?.message ?? "Action failed.");
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
            placeholder="Search services, categories, vendors…"
            aria-label="Search services"
            className="h-10 w-full rounded-xl border border-cream-300 bg-background pl-10 pr-4 text-sm text-espresso outline-none focus:border-garnet"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="h-10 rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none focus:border-garnet"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <p className="text-xs text-espresso/55">{filtered.length} of {services.length} services</p>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-4 sm:flex-row sm:items-center">
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-garnet/5 text-xs text-garnet/50">No image</span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-espresso">{s.serviceName}</h3>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest", styles[s.status] ?? styles.pending)}>{s.status}</span>
              </div>
              <p className="mt-1 text-xs text-espresso/60">
                {s.category} · {s.vendorName} · ৳{Number(s.price ?? 0).toLocaleString("en-US")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {s.status !== "approved" && (
                <button
                  type="button"
                  disabled={!!busyId}
                  onClick={() => act(s.id, "patch", "approved")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-garnet px-4 text-xs font-semibold text-garnet-foreground hover:bg-garnet-deep disabled:opacity-60"
                >
                  {busyId === `${s.id}-patch` ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" aria-hidden="true" />}
                  Approve
                </button>
              )}
              {s.status !== "rejected" && (
                <button
                  type="button"
                  disabled={!!busyId}
                  onClick={() => act(s.id, "patch", "rejected")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-4 text-xs font-semibold text-destructive hover:bg-destructive/15 disabled:opacity-60"
                >
                  <X className="size-3.5" aria-hidden="true" />
                  Reject
                </button>
              )}
              <button
                type="button"
                disabled={!!busyId}
                onClick={() => act(s.id, "delete")}
                aria-label={`Delete ${s.serviceName}`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-destructive/30 bg-background text-destructive hover:bg-destructive/10 disabled:opacity-60"
              >
                {busyId === `${s.id}-delete` ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-10 text-center text-sm text-espresso/60">No services match your filters.</p>
        )}
      </div>
    </div>
  );
}
