import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Server-side session helpers for RSC pages and route handlers.
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}
