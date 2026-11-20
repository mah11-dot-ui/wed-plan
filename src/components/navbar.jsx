"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { signOut, useSession } from "@/lib/auth-client";
import { roleDestination } from "@/lib/roles";
import Logo from "@/components/logo";
import MobileNav from "@/components/mobile-nav";
import ThemeToggle from "@/components/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function Navbar() {
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream-300 bg-cream text-espresso">
      {/* dusty-rose to antique-gold hairline */}
      <div
        aria-hidden="true"
        className="h-[3px] bg-linear-to-r from-blush via-gold to-blush"
      />

      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <div className="flex items-center gap-0.5 sm:gap-1">
          <MobileNav />
          <Logo />
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {exploreLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-10 rounded-full px-5 text-[15px] font-medium text-espresso hover:bg-garnet/5 hover:text-garnet"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <span
              aria-hidden="true"
              className="size-10 animate-pulse rounded-full bg-cream-300"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full border border-cream-300 bg-background py-1 pl-1 pr-2 transition-colors hover:border-garnet/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garnet/40"
                aria-label="Open profile menu"
              >
                <Avatar size="sm" className="size-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? "Your profile"} />
                  ) : null}
                  <AvatarFallback className="bg-garnet text-[11px] font-bold text-garnet-foreground">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-medium text-espresso md:inline">
                  {user.name}
                </span>
                <ChevronDown
                  className="size-4 text-espresso/50"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-64 rounded-2xl border border-cream-300 bg-cream p-1.5 shadow-xl"
              >
                <div className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left">
                  <Avatar size="md" className="size-10 shrink-0">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name ?? "Your profile"} />
                    ) : null}
                    <AvatarFallback className="bg-garnet text-xs font-bold text-garnet-foreground">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-espresso">
                      {user.name}
                    </span>
                    <span className="block truncate text-[11px] font-normal text-espresso/60">
                      {user.email}
                    </span>
                    <span className="mt-1 inline-flex items-center rounded-full bg-garnet/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-garnet">
                      {role}
                    </span>
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-cream-300" />
                <DropdownMenuItem
                  render={<Link href={dashboardHref} />}
                  className="h-10 rounded-xl px-3 text-espresso focus:bg-garnet/5 focus:text-garnet"
                >
                  <LayoutDashboard className="size-4 text-garnet/70" aria-hidden="true" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href="/settings" />}
                  className="h-10 rounded-xl px-3 text-espresso focus:bg-garnet/5 focus:text-garnet"
                >
                  <Settings className="size-4 text-garnet/70" aria-hidden="true" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cream-300" />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="h-10 cursor-pointer rounded-xl px-3"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden h-10 rounded-full px-5 font-medium text-espresso hover:bg-garnet/5 hover:text-garnet sm:inline-flex"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-9 rounded-full bg-garnet px-4 font-medium text-garnet-foreground hover:bg-garnet-deep sm:h-10 sm:px-6"
                )}
              >
                Sign Up
              </Link>
            </>
          )}
          <ThemeToggle className="size-10" />
        </div>
      </nav>
    </header>
  );
}
