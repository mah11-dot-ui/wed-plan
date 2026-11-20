import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function vendorSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  if (!user || user.role !== "vendor" || user.blocked) return null;
  return user;
}

// POST /api/vendor/services — vendor creates a service (status: pending).
export async function POST(request) {
  const user = await vendorSession();
  if (!user) {
    return Response.json(
      { message: "Only active vendor accounts can add services." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { serviceName, category, categorySlug, description, price, location, serviceImage } =
    body ?? {};

  const errors = {};
  if (!serviceName || String(serviceName).trim().length < 3) {
    errors.serviceName = "Service name must be at least 3 characters.";
  }
  if (!category || String(category).trim().length < 2) {
    errors.category = "Choose a category.";
  }
  if (!description || String(description).trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }
  if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) {
    errors.price = "Enter a price greater than zero.";
  }
  if (!location || String(location).trim().length < 2) {
    errors.location = "Enter a location.";
  }
  if (!serviceImage || !/^https?:\/\//.test(String(serviceImage))) {
    errors.serviceImage = "Upload a service image before saving.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 }
    );
  }

  // Free plan: at most 3 active services.
  const activeCount = await db.collection("services").countDocuments({
    vendorId: user.id,
    active: true,
  });
  if ((user.plan ?? "free") !== "premium" && activeCount >= 3) {
    return Response.json(
      {
        message:
          "Free plan limit reached — you can have at most 3 active services. Upgrade to Premium for unlimited listings.",
      },
      { status: 403 }
    );
  }

  const now = new Date();
  const doc = {
    vendorId: user.id,
    vendorEmail: user.email,
    vendorInfo: {
      name: user.name,
      email: user.email,
      verified: false,
      rating: 0,
    },
    serviceName: String(serviceName).trim(),
    category: String(category).trim(),
    categorySlug: String(categorySlug ?? "").trim(),
    description: String(description).trim(),
    price: Number(price),
    location: String(location).trim(),
    serviceImage: String(serviceImage).trim(),
    status: "pending",
    approved: false,
    active: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("services").insertOne(doc);

  return Response.json(
    {
      message: "Service submitted! It will appear once an admin approves it.",
      id: result.insertedId.toString(),
    },
    { status: 201 }
  );
}
