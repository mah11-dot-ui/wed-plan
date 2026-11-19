import Link from "next/link";

import { Button } from "@/components/ui/button";
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
            <Button
              key={href}
              variant="ghost"
              className="h-10 rounded-full px-5 text-[15px] font-medium text-espresso hover:bg-garnet/5 hover:text-garnet"
              render={<Link href={href} />}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden h-10 rounded-full px-5 font-medium text-espresso hover:bg-garnet/5 hover:text-garnet sm:inline-flex"
            render={<Link href="/sign-in" />}
          >
            Sign In
          </Button>
          <Button
            className="h-9 rounded-full bg-garnet px-4 font-medium text-garnet-foreground hover:bg-garnet-deep sm:h-10 sm:px-6"
            render={<Link href="/sign-up" />}
          >
            Sign Up
          </Button>
          <ThemeToggle className="size-10" />
        </div>
      </nav>
    </header>
  );
}
