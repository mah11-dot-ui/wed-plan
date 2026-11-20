import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/bookings — authenticated booking requests only.
// Customers and vendors may book; vendors cannot book their own service;
// admins cannot submit customer booking requests.
export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return Response.json(
      { message: "You must be signed in to request a booking." },
      { status: 401 }
    );
  }

  if (user.blocked) {
    return Response.json(
      { message: "Your account has been suspended." },
      { status: 403 }
    );
  }

  const role = user.role ?? "customer";

  if (role === "admin") {
    return Response.json(
      { message: "Admin accounts cannot submit customer booking requests." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const {
    serviceSlug,
    eventDate,
    eventLocation,
    guests,
    phone,
    message = "",
  } = body ?? {};

  const errors = {};
  if (!serviceSlug || typeof serviceSlug !== "string") {
    errors.serviceSlug = "A service is required.";
  }
  if (!eventDate || Number.isNaN(Date.parse(eventDate))) {
    errors.eventDate = "Please pick a valid event date.";
  } else {
    const when = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (when < today) errors.eventDate = "Your event date cannot be in the past.";
  }
  if (!Number.isInteger(Number(guests)) || Number(guests) < 1 || Number(guests) > 10000) {
    errors.guests = "Guests must be a whole number between 1 and 10,000.";
  }
  if (!eventLocation || String(eventLocation).trim().length < 2) {
    errors.eventLocation = "Enter the event location.";
  }
  if (!phone || !/^\+?[0-9 ()-]{6,20}$/.test(String(phone).trim())) {
    errors.phone = "Enter a valid phone number (6–20 digits).";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 }
    );
  }

  // Only approved and active services can be booked.
  // (Slugs are derived from serviceName — there is no stored slug field.)
  const slugify = (text) =>
    String(text ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const service = [...(await db.collection("services").find({ approved: true, active: true }).toArray())]
    .find((doc) => slugify(doc.serviceName) === serviceSlug);

  if (!service) {
    return Response.json(
      { message: "This service is not available for booking." },
      { status: 404 }
    );
  }

  // Vendors cannot book their own service (customers are never blocked here).
  const vendorEmail = service.vendorInfo?.email?.toLowerCase?.() ?? null;
  const userEmail = user.email?.toLowerCase?.() ?? null;
  if (role === "vendor" && vendorEmail && userEmail && vendorEmail === userEmail) {
    return Response.json(
      { message: "Vendors cannot book their own services." },
      { status: 403 }
    );
  }

  const doc = {
    serviceSlug,
    serviceName: service.serviceName,
    serviceImage: service.serviceImage ?? null,
    vendorName: service.vendorInfo?.name ?? "WedPlan Vendor",
    vendorEmail,
    vendorId: service.vendorId ?? null,
    priceFrom: service.price ?? null,
    customerId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    eventDate: new Date(eventDate),
    eventLocation: String(eventLocation).trim().slice(0, 200),
    guests: Number(guests),
    phone: String(phone).trim(),
    message: String(message).trim().slice(0, 500),
    status: "pending",
    createdAt: new Date(),
  };

  const result = await db.collection("bookings").insertOne(doc);

  return Response.json(
    {
      message:
        "Booking request sent! The WedPlan team will reach out shortly to confirm.",
      bookingId: result.insertedId.toString(),
    },
    { status: 201 }
  );
}
