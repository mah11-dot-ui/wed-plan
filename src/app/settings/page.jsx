import AccessDenied from "@/components/access-denied";
import ProfileSettingsForm from "@/components/profile-settings-form";
import SignOutButton from "@/components/sign-out-button";
import { BadgeCheck, Mail, User } from "lucide-react";

import { requireAuth } from "@/lib/require-auth";

export const metadata = {
  title: "Profile Settings — WedPlan",
};

export const instant = false;

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function SettingsPage() {
  const { blocked, user } = await requireAuth("/settings");

  if (blocked) return <AccessDenied kind="blocked" />;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="flex flex-1 flex-col bg-background">
      <section
        aria-labelledby="settings-title"
        className="border-b border-cream-300 bg-cream-200"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet">
            Account
          </p>
          <h1
            id="settings-title"
            className="mt-2 font-display text-4xl font-semibold tracking-tight text-espresso"
          >
            Profile settings
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-espresso/70">
            Your public details on WedPlan. Email changes aren&apos;t supported
            yet.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-cream-300 bg-cream-200 p-6 sm:p-8">
          {/* Identity row */}
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? "Your profile"}
                className="size-16 rounded-2xl object-cover"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-2xl bg-garnet text-lg font-bold text-garnet-foreground">
                {initials(user.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-lg font-semibold leading-tight text-espresso">
                <span className="truncate">{user.name}</span>
                {user.role !== "customer" && (
                  <BadgeCheck className="size-5 shrink-0 text-garnet" aria-hidden="true" />
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-espresso/60">
                <Mail className="size-3.5" aria-hidden="true" />
                {user.email}
              </p>
              <span className="mt-2 inline-flex items-center rounded-full bg-garnet/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-garnet">
                {user.role ?? "customer"} account
              </span>
            </div>
          </div>

          <div className="my-6 h-px bg-cream-300" aria-hidden="true" />

          {/* Editable name */}
          <ProfileSettingsForm user={user} />

          <div className="my-6 h-px bg-cream-300" aria-hidden="true" />

          {/* Read-only details */}
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-cream-300 bg-background p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-espresso/55">
                <Mail className="size-3.5" aria-hidden="true" />
                Email
              </dt>
              <dd className="mt-1.5 break-all text-sm font-medium text-espresso">
                {user.email}
              </dd>
            </div>
            <div className="rounded-xl border border-cream-300 bg-background p-4">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-espresso/55">
                <User className="size-3.5" aria-hidden="true" />
                Role
              </dt>
              <dd className="mt-1.5 text-sm font-medium capitalize text-espresso">
                {user.role ?? "customer"}
              </dd>
            </div>
          </dl>

          {memberSince && (
            <p className="mt-4 text-xs text-espresso/50">
              Member since {memberSince}
            </p>
          )}

          <div className="mt-8">
            <SignOutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
