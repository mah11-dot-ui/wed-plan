import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/bookings/[id] — customer cancels their own pending request.
export async function PATCH(_request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  if (!user) {
    return Response.json({ message: "You must be signed in." }, { status: 401 });
  }
  if (user.blocked) {
    return Response.json({ message: "Your account has been suspended." }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Booking not found." }, { status: 404 });
  }

  // Ownership + pending-only are part of the query — nobody can cancel
  // another customer's booking or an already processed one.
  const result = await db.collection("bookings").updateOne(
    { _id: new ObjectId(id), customerId: user.id, status: "pending" },
    { $set: { status: "cancelled", cancelledAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return Response.json(
      { message: "Only your own pending bookings can be cancelled." },
      { status: 409 }
    );
  }

  return Response.json({ message: "Booking request cancelled." });
}
