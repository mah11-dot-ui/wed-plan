"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";

import { cn } from "cn";
import { useToast } from "@/components/toast-provider";

export default function AdminBlockButton({ userId, blocked, isSelf }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !blocked }),
      });
      const data = await response.json();
      if (!response.ok) error(data?.message ?? "Could not update this account.");
      else {
        success(data.message);
        router.refresh();
      }
    } catch {
      error("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy || isSelf}
      onClick={toggle}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        blocked
          ? "border border-emerald-600/30 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive hover:bg-destructive/15"
      )}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : blocked ? (
        <ShieldCheck className="size-4" aria-hidden="true" />
      ) : (
        <ShieldBan className="size-4" aria-hidden="true" />
      )}
      {isSelf ? "Your own account" : blocked ? "Unblock User" : "Block User"}
    </button>
  );
}
