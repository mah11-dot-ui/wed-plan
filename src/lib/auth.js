import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { db } from "@/lib/db";

// Google sign-in activates only when both credentials are configured.
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  // In production derive the URL from the request host when the configured
  // base URL points to an old deployment (or is missing). This keeps Google
  // OAuth callbacks in sync with whatever domain Vercel is serving.
  baseURL:
    process.env.NODE_ENV === "production" && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.CLIENT_URL,
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  database: mongodbAdapter(db),
  user: {
    additionalFields: {
      // "customer" | "vendor" | "admin"
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      // Suspended accounts keep their login but lose access to protected
      // features. Never settable from the sign-up form — assigned manually.
      blocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      // "free" | "premium" — never settable from public registration.
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          // Public registration can only ever create customers or vendors.
          // Admin is assigned securely (e.g. manually in the database),
          // never through the sign-up form — even with a crafted request.
          return {
            data: {
              ...user,
              role: user.role === "vendor" ? "vendor" : "customer",
            },
          };
        },
      },
    },
  },
  socialProviders,
});
