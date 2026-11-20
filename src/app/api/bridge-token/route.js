import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Exchanges a verified Better Auth session for a short-lived JWT that the
// Express backend can verify independently. Server-only: the secret is never
// exposed to the browser.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user || user.blocked) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  // Premium expired? Revoke it before issuing the token — expiry is
  // enforced server-side, never inferred from the frontend.
  let plan = user.plan ?? "free";
  const account = await db.collection("user").findOne({ _id: new ObjectId(user.id) });
  if (
    account?.subscriptionExpiresAt &&
    new Date(account.subscriptionExpiresAt).getTime() < Date.now() &&
    plan === "premium"
  ) {
    await db.collection("user").updateOne(
      { _id: account._id },
      { $set: { plan: "free", subscriptionPlan: "free" } }
    );
    plan = "free";
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role ?? "customer",
      email: user.email,
      name: user.name,
      plan,
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "10m" }
  );

  return Response.json({ token });
}
