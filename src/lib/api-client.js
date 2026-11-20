// Client helper: obtains a short-lived JWT from the Next.js bridge and calls
// the JWT-protected Express API with it.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

let cached = null;

async function getToken() {
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const response = await fetch("/api/bridge-token", { method: "POST" });
  if (!response.ok) throw new Error("Please sign in to continue.");

  const { token } = await response.json();
  const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
  const payload = JSON.parse(atob(padded));
  cached = { token, expiresAt: payload.exp * 1000 - 30_000 };
  return token;
}

export async function apiFetch(path, options = {}) {
  const token = await getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(`${API_URL}${path}`, { ...options, headers });
}
