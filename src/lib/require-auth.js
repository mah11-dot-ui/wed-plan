import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// Server-side protection for dashboard routes.
//
// Returns one of:
//   { blocked: false, forbidden: false, user }  — access granted
//   { blocked: true,  forbidden: false, user }  — suspended account
//   { blocked: false, forbidden: true,  user }  — wrong role
// Redirects to /sign-in when there is no session at all.
export async function requireRole(role, path) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(path)}`);
  }

  if (user.blocked) {
    return { blocked: true, forbidden: false, user };
  }

  if (user.role !== role) {
    return { blocked: false, forbidden: true, user };
  }

  return { blocked: false, forbidden: false, user };
}

// Any signed-in, non-blocked user (for pages like Profile Settings).
export async function requireAuth(path) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(path)}`);
  }

  if (user.blocked) {
    return { blocked: true, forbidden: false, user };
  }

  return { blocked: false, forbidden: false, user };
}
