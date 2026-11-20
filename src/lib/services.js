import { io } from "next/cache";

// ---------------------------------------------------------------------------
// Data layer — reads from wed-plan-server (Express + MongoDB) at
// process.env.API_URL (default http://localhost:5000).
//
// `io()` excludes these reads from the static prerender, so the two
// homepage sections render per request behind <Suspense> boundaries.
//
// If the server is unreachable (e.g. not started yet), the page still works:
// a console warning is logged and the local offline seed below is used.
// The responses from the server and the seed share the same shape.
// ---------------------------------------------------------------------------

const API_URL = process.env.API_URL ?? "http://localhost:5000";

const offlineSeed = [
  {
    slug: "royal-frame-photography",
    name: "Royal Wedding Photography & Video",
    category: "Photography & Videography",
    categorySlug: "photography",
    priceFrom: 45000,
    location: "Gulshan, Dhaka",
    rating: 4.9,
    reviews: 212,
    vendor: { name: "Royal Frame Studio", verified: true },
    approved: true,
    active: true,
    image: "/images/services/royal-photography.jpg",
  },
  {
    slug: "the-grand-palace-venue",
    name: "The Grand Palace — Banquet & Lawn",
    category: "Wedding Venues",
    categorySlug: "venues",
    priceFrom: 250000,
    location: "Banani, Dhaka",
    rating: 4.8,
    reviews: 96,
    vendor: { name: "The Grand Palace Banquet", verified: true },
    approved: true,
    active: true,
    image: "/images/services/grand-palace-hall.jpg",
  },
  {
    slug: "bloom-blossom-florals",
    name: "Signature Floral & Décor Package",
    category: "Decoration & Florist",
    categorySlug: "decoration",
    priceFrom: 120000,
    location: "Dhanmondi, Dhaka",
    rating: 4.9,
    reviews: 148,
    vendor: { name: "Bloom & Blossom Florals", verified: true },
    approved: true,
    active: true,
    image: "/images/services/bloom-blossom-decor.jpg",
  },
  {
    slug: "spice-route-catering",
    name: "Royal Feast Wedding Buffet — 100 Guests",
    category: "Catering Services",
    categorySlug: "catering",
    priceFrom: 85000,
    location: "Uttara, Dhaka",
    rating: 4.7,
    reviews: 320,
    vendor: { name: "Spice Route Catering", verified: true },
    approved: true,
    active: true,
    image: "/images/services/spice-route-catering.jpg",
  },
  {
    slug: "glam-canvas-by-rafiya",
    name: "Bridal Makeup & Full-Day Styling",
    category: "Makeup & Styling",
    categorySlug: "makeup",
    priceFrom: 25000,
    location: "Banani, Dhaka",
    rating: 5.0,
    reviews: 187,
    vendor: { name: "Glam Canvas by Rafiya", verified: true },
    approved: true,
    active: true,
    image: "/images/services/glam-canvas-makeup.jpg",
  },
  {
    slug: "house-of-noor-bridal-wear",
    name: "Handwoven Bridal Lehenga & Sherwani",
    category: "Wedding Fashion",
    categorySlug: "fashion",
    priceFrom: 180000,
    location: "Mirpur, Dhaka",
    rating: 4.8,
    reviews: 74,
    vendor: { name: "House of Noor", verified: true },
    approved: true,
    active: true,
    image: "/images/services/house-of-noor-bridal.jpg",
  },
];

export function formatBDT(amount) {
  return `৳${Number(amount).toLocaleString("en-US")}`;
}

async function serverFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`wed-plan-server responded with ${res.status} for ${path}`);
  }
  return res.json();
}

export async function getFeaturedServices(limit = 6) {
  await io();
  try {
    return await serverFetch(`/services/featured?limit=${limit}`);
  } catch (error) {
    console.warn(
      `[wed-plan] Could not reach wed-plan-server (${API_URL}) — using offline seed.`,
      error
    );
    return offlineSeed.slice(0, limit);
  }
}

export async function getServices({
  search = "",
  category = "all",
  location = "all",
  sort = "",
} = {}) {
  await io();
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);
  if (location && location !== "all") params.set("location", location);
  if (sort) params.set("sort", sort);
  const query = params.toString();

  try {
    return await serverFetch(`/services${query ? `?${query}` : ""}`);
  } catch (error) {
    console.warn(
      `[wed-plan] Could not reach wed-plan-server (${API_URL}) — using offline seed.`,
      error
    );
    const needle = search.trim().toLowerCase();
    const filtered = offlineSeed.filter(
      (service) =>
        (!needle || service.name.toLowerCase().includes(needle)) &&
        (category === "all" || service.categorySlug === category) &&
        (location === "all" || service.location === location)
    );
    if (sort === "price_asc") filtered.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price_desc") filtered.sort((a, b) => b.priceFrom - a.priceFrom);
    return filtered;
  }
}

export async function getServiceBySlug(slug) {
  await io();
  try {
    return await serverFetch(`/services/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (String(error?.message ?? "").includes("404")) {
      return null; // invalid (or unapproved/inactive) service id
    }
    console.warn(
      `[wed-plan] Could not reach wed-plan-server (${API_URL}) — looking up offline seed.`,
      error
    );
    return offlineSeed.find((service) => service.slug === slug) ?? null;
  }
}

export async function getServiceLocations() {
  await io();
  try {
    return await serverFetch(`/services/locations`);
  } catch (error) {
    console.warn(
      `[wed-plan] Could not reach wed-plan-server (${API_URL}) — deriving locations from offline seed.`,
      error
    );
    return [...new Set(offlineSeed.map((service) => service.location))].sort();
  }
}
