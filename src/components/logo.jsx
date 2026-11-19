import Link from "next/link";
import { Heart } from "lucide-react";

import { cn } from "cn";

export default function Logo({ className }) {
  return (
    <Link
      href="/"
      aria-label="WedPlan — home"
      className={cn(
        "group flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3",
        className
      )}
    >
      <span className="grid size-9 place-items-center rounded-full bg-garnet shadow-sm transition-transform duration-300 group-hover:-rotate-6 sm:size-10">
        <Heart
          className="size-4 fill-gold text-gold sm:size-[18px]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
      <span className="font-display text-[26px] italic leading-none tracking-tight text-espresso sm:text-[30px]">
        Wed<span className="font-semibold text-garnet">Plan</span>
      </span>
    </Link>
  );
}
