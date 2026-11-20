"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleClick = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={signingOut}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-70"
    >
      {signingOut ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Signing out…
        </>
      ) : (
        <>
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </>
      )}
    </button>
  );
}
