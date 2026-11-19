import {
  BadgePercent,
  HeartHandshake,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified & Approved Vendors",
    text: "Every vendor on WedPlan goes through identity and quality checks before going live. You only ever pick from the trusted few.",
  },
  {
    icon: BadgePercent,
    title: "Transparent, Upfront Pricing",
    text: "Starting prices are shown on every listing — compare honestly, negotiate confidently, and never face hidden fees at checkout.",
  },
  {
    icon: SearchCheck,
    title: "Compare in One Place",
    text: "Packages, portfolios and real reviews — side by side — so the shortlist writes itself and you always know why you chose.",
  },
  {
    icon: HeartHandshake,
    title: "Support Beyond the Booking",
    text: "From the first showroom to the last dance, our team stays one message away — before, during and after your big day.",
  },
];

export default function WhyChoose() {
  return (
    <section
      aria-labelledby="why-choose-wedplan"
      className="relative overflow-hidden border-b border-parchment/10 bg-ink text-parchment"
    >
      {/* ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-garnet/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          tone="dark"
          overline="Why Choose WedPlan?"
          title="Everything you need, nothing you don't"
          description="WedPlan was built for couples who want a beautiful wedding without the back-and-forth — transparent, trusted and refreshingly simple."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08} className="h-full">
              <div className="group flex h-full flex-col gap-4 rounded-2xl border border-parchment/10 bg-white/[0.05] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:bg-white/[0.08]">
                <span className="grid size-12 place-items-center rounded-xl bg-gold/10 text-gold transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="font-heading text-lg font-semibold leading-snug text-parchment">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-parchment/70">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
