import { io } from "next/cache";

// Data layer — reads categories from wed-plan-server (GET /categories).
// Categories are aggregated live from the database there (approved + active
// services only). Same contract as src/lib/services.js: dynamic per request,
// with graceful degradation if the server is unreachable.

const API_URL = process.env.API_URL ?? "http://localhost:5000";

export async function getCategories() {
  await io();
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`wed-plan-server responded with ${res.status} for /categories`);
    }
    return res.json();
  } catch (error) {
    console.warn(
      `[wed-plan] Could not reach wed-plan-server (${API_URL}) — categories section hidden.`,
      error
    );
    return [];
  }
}
