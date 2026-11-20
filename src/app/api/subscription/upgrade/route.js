import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/subscription/upgrade — demo upgrade to Premium.
// No payment gateway is configured; admin can also set plan directly in DB.
// Role + blocked checks are server-side, like every protected action.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  if (!user || user.role !== "vendor" || user.blocked) {
    return Response.json(
      { message: "Only active vendor accounts can upgrade." },
      { status: 403 }
    );
  }

  if (!ObjectId.isValid(user.id)) {
    return Response.json({ message: "Invalid account." }, { status: 400 });
  }

  await db.collection("user").updateOne(
    { _id: new ObjectId(user.id) },
    { $set: { plan: "premium", updatedAt: new Date() } }
  );

  return Response.json({ message: "Welcome to Premium! Unlimited services unlocked." });
}
