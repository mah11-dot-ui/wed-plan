import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/admin/users/[id] — block or unblock a user (admin only).
export async function PATCH(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const admin = session?.user ?? null;

  if (!admin || admin.role !== "admin" || admin.blocked) {
    return Response.json({ message: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }
  if (id === admin.id) {
    return Response.json({ message: "You can't block your own account." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const isBlocked = Boolean(body?.isBlocked);
  const result = await db.collection("user").updateOne(
    { _id: new ObjectId(id) },
    { $set: { blocked: isBlocked, isBlocked, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  return Response.json({
    message: isBlocked ? "User blocked." : "User unblocked.",
  });
}
