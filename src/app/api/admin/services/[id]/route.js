import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/admin/services/[id] — approve, reject or change published
// status. Only an admin can do this; customers never see unapproved services.
export async function PATCH(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const admin = session?.user ?? null;

  if (!admin || admin.role !== "admin" || admin.blocked) {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Service not found." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const status = body?.status;
  if (!["approved", "rejected", "pending"].includes(status)) {
    return Response.json({ message: "Invalid status." }, { status: 400 });
  }

  const result = await db.collection("services").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        approved: status === "approved",
        active: status === "approved",
        reviewedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return Response.json({ message: "Service not found." }, { status: 404 });
  }

  return Response.json({ message: `Service marked ${status}.` });
}

// DELETE /api/admin/services/[id] — remove inappropriate listings.
export async function DELETE(_request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const admin = session?.user ?? null;

  if (!admin || admin.role !== "admin" || admin.blocked) {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "Service not found." }, { status: 404 });
  }

  await db.collection("services").deleteOne({ _id: new ObjectId(id) });
  return Response.json({ message: "Service deleted." });
}
