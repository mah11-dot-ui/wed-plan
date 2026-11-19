import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

// Feather-style (MIT) brand glyphs — stroke-based, consistent with lucide
const brandIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const FacebookIcon = (props) => (
  <svg {...brandIconProps} {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg {...brandIconProps} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg {...brandIconProps} {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg {...brandIconProps} {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg {...brandIconProps} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8z" />
    <rect x="2" y="9" width="4" height="12" />
  </svg>
);

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

const accountLinks = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQs" },
];

const socialLinks = [
  { href: "https://www.facebook.com/wedplan", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.instagram.com/wedplan", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.twitter.com/wedplan", label: "Twitter", icon: TwitterIcon },
  { href: "https://www.youtube.com/@wedplan", label: "YouTube", icon: YoutubeIcon },
  { href: "https://www.linkedin.com/company/wedplan", label: "LinkedIn", icon: LinkedinIcon },
];

const contactItems = [
  {
    icon: Mail,
    label: "hello@wedplan.com",
    href: "mailto:hello@wedplan.com",
    ariaLabel: "Email WedPlan",
  },
  {
    icon: Phone,
    label: "+880 1700-000000",
    href: "tel:+8801700000000",
    ariaLabel: "Call WedPlan",
  },
  {
    icon: MapPin,
    label: "House 12, Road 8, Gulshan-1, Dhaka 1212",
    href: null,
    ariaLabel: null,
  },
  {
    icon: Clock,
    label: "Sat – Thu, 9:00 AM – 6:00 PM",
    href: null,
    ariaLabel: null,
  },
];

function FooterHeading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/60">
      {children}
    </h3>
  );
}

// Static-prerendered pages can't call new Date() at render time — bump this
// each January.
const CURRENT_YEAR = 2026;

export default function Footer() {
  const year = CURRENT_YEAR;

  return (
    <footer className="border-t border-cream-300 bg-cream text-espresso">
      {/* antique-gold to dusty-rose hairline — mirrors the navbar */}
      <div
        aria-hidden="true"
        className="h-[3px] bg-linear-to-r from-blush via-gold to-blush"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-12 lg:gap-8">
          {/* Logo + short description + socials */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-6 text-espresso/75">
              WedPlan is your all-in-one wedding planning companion — discover
              trusted local vendors for venues, décor, photography, catering
              and more, and bring your dream day to life without the stress.
            </p>
            <ul className="flex items-center gap-1.5" aria-label="Social media">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-espresso/70 hover:bg-garnet/5 hover:text-garnet"
                    render={
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`WedPlan on ${label}`}
                      />
                    }
                  >
                    <Icon aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Important navigation links */}
          <nav
            className="flex flex-col gap-3 lg:col-span-2"
            aria-label="Explore WedPlan"
          >
            <FooterHeading>Explore</FooterHeading>
            <ul className="flex flex-col gap-2 text-sm">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-espresso/75 transition-colors hover:text-garnet"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="flex flex-col gap-3 lg:col-span-2"
            aria-label="Your account"
          >
            <FooterHeading>Account</FooterHeading>
            <ul className="flex flex-col gap-2 text-sm">
              {accountLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-espresso/75 transition-colors hover:text-garnet"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="flex flex-col gap-3 lg:col-span-2"
            aria-label="Company"
          >
            <FooterHeading>Company</FooterHeading>
            <ul className="flex flex-col gap-2 text-sm">
              {companyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-espresso/75 transition-colors hover:text-garnet"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact information */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-2">
            <FooterHeading>Contact</FooterHeading>
            <ul className="flex flex-col gap-2.5 text-sm">
              {contactItems.map(({ icon: Icon, label, href, ariaLabel }) => (
                <li key={label} className="flex items-start gap-2">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-garnet/70"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {href ? (
                    <a
                      href={href}
                      aria-label={ariaLabel}
                      className="text-espresso/75 transition-colors hover:text-garnet"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-espresso/75">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream-300 py-5 text-xs text-espresso/60 sm:flex-row">
          <p>© {year} WedPlan. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-garnet"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-garnet"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
