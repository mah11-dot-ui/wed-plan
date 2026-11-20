"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  CalendarCheck,
  Crown,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Store,
  Users,
} from "lucide-react";

import { cn } from "cn";

const NAV = {
  customer: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/services", label: "Browse Services", icon: Store },
  ],
  vendor: [
    { href: "/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/vendor/services", label: "My Services", icon: Store },
    { href: "/vendor/services/new", label: "Add Service", icon: PlusCircle },
    { href: "/vendor/bookings", label: "Booking Requests", icon: CalendarCheck },
    { href: "/vendor/subscription", label: "Subscription", icon: Crown },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/services", label: "Manage Services", icon: Store },
    { href: "/admin/transactions", label: "Transactions", icon: CalendarCheck },
  ],
};

export default function DashboardSidebar({ role, plan }) {
  const pathname = usePathname();
  const items = [...(NAV[role] ?? NAV.customer), { href: "/settings", label: "Profile Settings", icon: Settings }];

  return (
    <aside className="w-full shrink-0 lg:w-60" aria-label="Dashboard navigation">
      <div className="lg:sticky lg:top-24 rounded-2xl border border-cream-300 bg-cream-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="grid size-10 place-items-center rounded-xl bg-garnet text-garnet-foreground">
            {role === "admin" ? (
              <BadgeCheck className="size-5" aria-hidden="true" />
            ) : role === "vendor" ? (
              <Store className="size-5" aria-hidden="true" />
            ) : (
              <Users className="size-5" aria-hidden="true" />
            )}
          </span>
          <span>
            <span className="block text-sm font-semibold capitalize text-espresso">
              {role ?? "customer"}
            </span>
            {role === "vendor" ? (
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-garnet/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-garnet">
                <Crown className="size-2.5" aria-hidden="true" />
                {plan === "premium" ? "Premium plan" : "Free plan"}
              </span>
            ) : (
              <span className="block text-[10px] text-espresso/50">WedPlan account</span>
            )}
          </span>
        </div>

        <div className="my-2 h-px bg-cream-300" aria-hidden="true" />

        <nav>
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href} className="flex-1 lg:flex-none">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-medium transition-colors lg:text-sm",
                      active
                        ? "bg-garnet text-garnet-foreground"
                        : "text-espresso/70 hover:bg-garnet/5 hover:text-garnet"
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
