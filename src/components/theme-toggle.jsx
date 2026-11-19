"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

// Toggles .dark on <html> and persists the choice. The inline script in
// layout.js applies the stored theme before paint, so there is no flash.
export default function ThemeToggle({ className }) {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("wedplan-theme", isDark ? "dark" : "light");
    } catch {
      // private mode — theme just won't persist
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={cn(
        "rounded-full text-espresso hover:bg-garnet/5 hover:text-garnet",
        className
      )}
    >
      <Sun
        className="hidden size-5 dark:block"
        aria-hidden="true"
      />
      <Moon
        className="size-5 dark:hidden"
        aria-hidden="true"
      />
    </Button>
  );
}
