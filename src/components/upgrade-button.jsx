"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2 } from "lucide-react";

import { useToast } from "@/components/toast-provider";

export default function UpgradeButton() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const upgrade = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/subscription/upgrade", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.message ?? "Upgrade failed. Please try again.");
        toastError(data?.message ?? "Upgrade failed.");
        setBusy(false);
        return;
      }
      setMessage(data.message);
      success(data.message);
      router.refresh();
      setBusy(false);
    } catch {
      setMessage("Network error — please try again.");
      toastError("Network error — please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={upgrade}
        disabled={busy}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-garnet text-xs font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Upgrading…
          </>
        ) : (
          <>
            <Crown className="size-4" aria-hidden="true" />
            Upgrade to Premium
          </>
        )}
      </button>
      {message && <p role="status" className="text-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{message}</p>}
    </div>
  );
}
