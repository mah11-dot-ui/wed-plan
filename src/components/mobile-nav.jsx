"use client";

import Link from "next/link";
import { Heart, Menu } from "lucide-react";

import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

export default function MobileNav() {
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
        </nav>

        <Separator className="bg-cream-300" />

        <SheetFooter className="gap-2 p-4">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
