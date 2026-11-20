import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/vendor/bookings/[id] — accept or reject a pending request.
export async function PATCH(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;

  if (!user || user.role !== "vendor" || user.blocked) {
    return Response.json(
      { message: "Only active vendor accounts can manage bookings." },
      { status: 403 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Booking not found." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const status = body?.status;
  if (status !== "accepted" && status !== "rejected") {
    return Response.json({ message: "Invalid booking status." }, { status: 400 });
  }

  // Ownership + "pending only" are part of the query — a processed request
  // or another vendor's request can never match.
  const result = await db.collection("bookings").updateOne(
    {
      _id: new ObjectId(id),
      status: "pending",
      $or: [
        { vendorId: user.id },
        { vendorEmail: user.email?.toLowerCase?.() ?? user.email },
      ],
    },
    { $set: { status, processedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return Response.json(
      { message: "This booking is no longer pending or doesn't belong to you." },
      { status: 409 }
    );
  }

  return Response.json({ message: `Booking ${status}.` });
}
