import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import Logo from "@/components/logo";
import MobileNav from "@/components/mobile-nav";
import ThemeToggle from "@/components/theme-toggle";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
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
          <ThemeToggle className="size-10" />
        </div>
      </nav>
    </header>
  );
}
