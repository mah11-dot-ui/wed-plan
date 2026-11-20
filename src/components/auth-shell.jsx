import { Check, Heart } from "lucide-react";

// Shared split-screen layout for the auth pages — brand panel on the left,
// form on the right.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="flex flex-1 bg-background">
      {/* Brand panel */}
      <aside
        aria-hidden="true"
        className="relative hidden w-[42%] overflow-hidden bg-ink text-parchment lg:flex lg:flex-col lg:justify-between lg:p-12 xl:w-[46%]"
      >
        {/* ambient glows */}
        <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-garnet/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-garnet">
              <Heart className="size-5 fill-gold text-gold" aria-hidden="true" />
            </span>
            <span className="font-display text-3xl italic tracking-tight">
              Wed<span className="font-semibold not-italic text-gold">Plan</span>
            </span>
          </div>
          <h2 className="mt-14 font-display text-4xl font-semibold leading-[1.12] tracking-tight">
            Every love story deserves{" "}
            <span className="italic text-gold">a perfect day.</span>
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-parchment/70">
            Join thousands of couples planning vendors, venues and everything
            in between — beautifully, in one place.
          </p>
        </div>

        <ul className="relative space-y-4 text-sm text-parchment/80">
          {[
            "Only approved, vetted vendors",
            "Transparent pricing, no hidden fees",
            "From first search to last dance",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="grid size-5 place-items-center rounded-full bg-gold/15">
                <Check className="size-3 text-gold" strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl italic tracking-tight text-espresso">
              Wed<span className="font-semibold not-italic text-garnet">Plan</span>
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-espresso">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-espresso/70">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-8 text-center text-sm text-espresso/70">{footer}</p>
          )}
        </div>
      </section>
    </main>
  );
}
