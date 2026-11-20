"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";

import { cn } from "cn";
import { useSession, signOut } from "@/lib/auth-client";
import { roleDestination } from "@/lib/roles";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MobileNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;
  const role = user?.role ?? "customer";
  const dashboardHref = roleDestination(role);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Open navigation menu"
            className="text-espresso hover:bg-garnet/5 hover:text-garnet lg:hidden"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-80 border-r-cream-300 bg-cream p-0 text-espresso"
      >
        <SheetHeader className="flex-row items-center gap-3 border-b border-cream-300 p-5">
          <span className="grid size-10 place-items-center rounded-full bg-garnet">
            <Heart
              className="size-4 fill-gold text-gold"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <SheetTitle className="font-display text-2xl italic tracking-tight text-espresso">
            Wed<span className="font-semibold not-italic text-garnet">Plan</span>
          </SheetTitle>
        </SheetHeader>

        {user && (
          <div className="flex items-center gap-3 border-b border-cream-300 p-4">
            <Avatar className="size-12">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name ?? "Your profile"} />
              ) : null}
              <AvatarFallback className="bg-garnet text-sm font-bold text-garnet-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-espresso">
                {user.name}
              </span>
              <span className="block truncate text-[11px] text-espresso/60">
                {user.email}
              </span>
              <span className="mt-1 inline-flex rounded-full bg-garnet/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-garnet">
                {role}
              </span>
            </span>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
          {exploreLinks.map(({ href, label }) => (
            <SheetClose
              key={href}
              render={
                <Link
                  href={href}
                  className="flex h-12 items-center rounded-xl px-4 text-base font-medium text-espresso transition-colors hover:bg-garnet/5 hover:text-garnet"
                />
              }
            >
              {label}
            </SheetClose>
          ))}
          {!isPending && user && (
            <>
              <SheetClose
                render={
                  <Link
                    href={dashboardHref}
                    className="flex h-12 items-center rounded-xl px-4 text-base font-medium text-espresso transition-colors hover:bg-garnet/5 hover:text-garnet"
                  />
                }
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="size-4 text-garnet/70" aria-hidden="true" />
                  Dashboard
                </span>
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/settings"
                    className="flex h-12 items-center rounded-xl px-4 text-base font-medium text-espresso transition-colors hover:bg-garnet/5 hover:text-garnet"
                  />
                }
              >
                <span className="flex items-center gap-2">
                  <Settings className="size-4 text-garnet/70" aria-hidden="true" />
                  Profile Settings
                </span>
              </SheetClose>
            </>
          )}
        </nav>

        <Separator className="bg-cream-300" />

        <SheetFooter className="gap-2 p-4">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          ) : (
            <>
              <SheetClose
                render={
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full rounded-full border-cream-300 bg-transparent text-espresso hover:text-garnet"
                    )}
                  />
                }
              >
                Sign In
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-11 w-full rounded-full bg-garnet text-garnet-foreground hover:bg-garnet-deep"
                    )}
                  />
                }
              >
                Sign Up
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
