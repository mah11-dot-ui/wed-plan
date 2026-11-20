"use client";

import { useState } from "react";
import { Crown, Loader2 } from "lucide-react";

import { useToast } from "@/components/toast-provider";
import { apiFetch } from "@/lib/api-client";

export default function UpgradeButton() {
  const { success, error: toastError } = useToast();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const upgrade = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await apiFetch("/api/subscription/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.message ?? "Upgrade failed. Please try again.");
        toastError(data?.message ?? "Upgrade failed.");
        setBusy(false);
        return;
      }
      success("Opening secure Stripe checkout…");
      window.location.href = data.url;
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
            Opening checkout…
          </>
        ) : (
          <>
            <Crown className="size-4" aria-hidden="true" />
            Upgrade to Premium
          </>
        )}
      </button>
      {message && (
        <p role="status" className="text-center text-[11px] font-medium text-espresso/70">
          {message}
        </p>
      )}
    </div>
  );
}
