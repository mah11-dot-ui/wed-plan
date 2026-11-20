import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

// Server-side password complexity validation for public email registration.
// Better Auth enforces min length; this wrapper adds uppercase/lowercase rules
// without trusting the client-side form checks.
export async function POST(request, context) {
  const pathname = request.nextUrl?.pathname ?? new URL(request.url).pathname;
  if (request.method === "POST" && pathname.includes("/sign-up/email")) {
    try {
      const body = await request.clone().json();
      const password = body?.password;
      if (
        typeof password !== "string" ||
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        return Response.json(
          {
            message:
              "Password must be at least 6 characters and include one uppercase and one lowercase letter.",
          },
          { status: 400 }
        );
      }
    } catch {
      return Response.json({ message: "Invalid request body." }, { status: 400 });
    }
  }

  return handlers.POST(request, context);
}

