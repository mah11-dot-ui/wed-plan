// Where each role lands after auth (used by sign-in / sign-up redirects
// and the navbar profile dropdown).
export const ROLE_DESTINATIONS = {
  customer: "/dashboard",
  vendor: "/vendor",
  admin: "/admin",
};

export function roleDestination(role) {
  return ROLE_DESTINATIONS[role] ?? "/";
}
