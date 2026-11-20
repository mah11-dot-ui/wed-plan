import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import { auth } from "@/lib/auth";

// Exchanges a verified Better Auth session for a short-lived JWT that the
// Express backend can verify independently. Server-only: the secret is never
// exposed to the browser.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || user.blocked) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role ?? "customer",
      email: user.email,
      name: user.name,
      plan: user.plan ?? "free",
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "10m" }
  );

  return Response.json({ token });
}
