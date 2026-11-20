import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function vendorSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  if (!user || user.role !== "vendor" || user.blocked) return null;
  return user;
}

async function ownedService(id, user) {
  if (!ObjectId.isValid(id)) return null;
  return db.collection("services").findOne({
    _id: new ObjectId(id),
    vendorId: user.id,
  });
}

// PATCH /api/vendor/services/[id] — edit fields or toggle availability.
export async function PATCH(request, { params }) {
  const user = await vendorSession();
  if (!user) return Response.json({ message: "Vendor access required." }, { status: 403 });

  const { id } = await params;
  const service = await ownedService(id, user);
  if (!service) return Response.json({ message: "Service not found." }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const update = { updatedAt: new Date() };

  if (body.action === "toggle") {
    const nextActive = !service.active;
    if (nextActive && (user.plan ?? "free") !== "premium") {
      const count = await db.collection("services").countDocuments({
        vendorId: user.id,
        active: true,
      });
      if (count >= 3) {
        return Response.json(
          {
            message:
              "Free plan allows at most 3 active services. Upgrade to Premium to publish more.",
          },
          { status: 403 }
        );
      }
    }
    update.active = nextActive;
  } else {
    const { serviceName, category, categorySlug, description, price, location, serviceImage } =
      body ?? {};
    const errors = {};
    if (serviceName !== undefined && String(serviceName).trim().length < 3) {
      errors.serviceName = "Service name must be at least 3 characters.";
    }
    if (category !== undefined && String(category).trim().length < 2) {
      errors.category = "Choose a category.";
    }
    if (description !== undefined && String(description).trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }
    if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) <= 0)) {
      errors.price = "Enter a price greater than zero.";
    }
    if (location !== undefined && String(location).trim().length < 2) {
      errors.location = "Enter a location.";
    }
    if (serviceImage !== undefined && !/^https?:\/\//.test(String(serviceImage))) {
      errors.serviceImage = "Enter a valid image URL.";
    }
    if (Object.keys(errors).length > 0) {
      return Response.json(
        { message: "Please fix the highlighted fields.", errors },
        { status: 400 }
      );
    }

    const fields = { serviceName, category, categorySlug, description, price, location, serviceImage };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        update[key] = key === "price" ? Number(value) : String(value).trim();
      }
    }
    // Edits go back for approval — never leave a changed service live.
    update.status = "pending";
    update.approved = false;
    update.active = false;
  }

  await db.collection("services").updateOne({ _id: service._id }, { $set: update });

  return Response.json({ message: "Service updated." });
}

// DELETE /api/vendor/services/[id] — vendor deletes only their own service.
export async function DELETE(_request, { params }) {
  const user = await vendorSession();
  if (!user) return Response.json({ message: "Vendor access required." }, { status: 403 });

  const { id } = await params;
  const service = await ownedService(id, user);
  if (!service) return Response.json({ message: "Service not found." }, { status: 404 });

  await db.collection("services").deleteOne({ _id: service._id });
  return Response.json({ message: "Service deleted." });
}
