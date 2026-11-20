"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Power, Trash2 } from "lucide-react";

import { cn } from "cn";
import { useToast } from "@/components/toast-provider";
import { apiFetch } from "@/lib/api-client";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  approved: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
};

export default function VendorServiceList({ services }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState("");

  const act = async (id, action) => {
    setError("");
    setBusyId(`${id}-${action}`);
    try {
      const response = await apiFetch(`/api/services/${id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        ...(action === "delete"
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "toggle" }),
            }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message ?? "Something went wrong.");
        toastError(data?.message ?? "Action failed.");
      } else {
        success(data?.message ?? "Service updated.");
        setConfirmId(null);
        router.refresh();
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {services.map((service) => {
        const status = service.status ?? (service.approved ? "approved" : "pending");
        const isBusy = busyId?.startsWith(service.id);
        return (
          <div
            key={service.id}
            className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-200 p-4 sm:flex-row sm:items-center"
          >
            {/* thumbnail */}
            {service.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.image} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-garnet/5 text-xs text-garnet/50">
                No image
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-base font-semibold text-espresso">
                  {service.serviceName}
                </h3>
                <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest", statusStyles[status] ?? statusStyles.pending)}>
                  {status}
                </span>
                <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest", service.active ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400" : "bg-cream-300 text-espresso/60")}>
                  {service.active ? "Available" : "Paused"}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-espresso/60">
                {service.category} · {service.location} · ৳{Number(service.price).toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-[11px] text-espresso/45">
                {status === "pending"
                  ? "Awaiting admin approval"
                  : status === "rejected"
                    ? "Rejected — not visible to customers"
                    : "Live on WedPlan"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/vendor/services/${service.id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
              >
                <Pencil className="size-3.5" aria-hidden="true" />
                View / Edit
              </Link>
              <button
                type="button"
                disabled={!!isBusy}
                onClick={() => act(service.id, "toggle")}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet disabled:opacity-50"
              >
                {busyId === `${service.id}-toggle` ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Power className="size-3.5" aria-hidden="true" />
                )}
                {service.active ? "Pause" : "Publish"}
              </button>
              <button
                type="button"
                disabled={!!isBusy}
                onClick={() => {
                  if (confirmId === service.id) act(service.id, "delete");
                  else setConfirmId(service.id);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-4 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-50"
                aria-label={confirmId === service.id ? `Confirm delete ${service.serviceName}` : `Delete ${service.serviceName}`}
              >
                {busyId === `${service.id}-delete` ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
                {confirmId === service.id ? "Confirm" : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
