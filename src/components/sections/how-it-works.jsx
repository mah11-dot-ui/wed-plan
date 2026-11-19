import Link from "next/link";
import { ArrowRight, ClipboardList, PartyPopper, SlidersHorizontal } from "lucide-react";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell Us Your Vision",
    text: "Wedding date, city, guest count, budget — share the essentials and get a tailored shortlist in under two minutes.",
  },
  {
    icon: SlidersHorizontal,
    title: "Compare & Choose",
    text: "Browse approved portfolios, compare package prices and read verified reviews — all side by side, all in one place.",
  },
  {
    icon: PartyPopper,
    title: "Book & Celebrate",
    text: "Lock in your dream team with one tap, then relax — we handle the reminders while you enjoy every moment.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-wedplan-works" className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          align="center"
          overline="How WedPlan Works"
          title="Three steps to your big day"
          description="No endless phone calls, no guesswork — from first search to final send-off, we've got the details covered."
        />

        <ol className="relative mt-14 grid gap-y-12 md:grid-cols-3 md:gap-10">
          {/* dashed connector */}
          <li
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-garnet/20 md:block"
          />
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="relative flex flex-col items-center text-center"
            >
              <Reveal delay={index * 0.12} className="flex flex-col items-center">
                <span className="relative z-10 grid size-16 place-items-center rounded-2xl bg-garnet text-garnet-foreground shadow-lg shadow-garnet/25">
                  <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-garnet">
                  Step {index + 1}
                </span>
                <h3 className="mt-1.5 font-heading text-xl font-semibold text-espresso">
                  {title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-espresso/70">
                  {text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            className="group h-12 rounded-full bg-garnet px-7 text-[15px] font-semibold text-garnet-foreground hover:bg-garnet-deep"
            render={<Link href="/sign-up" />}
          >
            Start Planning — It&apos;s Free
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </section>
  );
}
