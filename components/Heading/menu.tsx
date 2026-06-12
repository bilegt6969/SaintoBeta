"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "lib/cn";
import type { NavLink } from "lib/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

// 1. The Ultra-Smooth Curve (Expo Out)
// Starts incredibly fast, then glides to a long, luxurious stop.
const smoothCurve =
  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

const linkClass = cn("text-sm font-medium hover:bg-black/5", smoothCurve);

export default function Menu({
  categories,
  onOpenChange,
}: {
  categories: NavLink[];
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <NavigationMenu.Root
      onValueChange={(value) => onOpenChange?.(value !== "")}
      className="relative z-10 hidden lg:block"
    >
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link
              href="/"
              className={cn(
                linkClass,
                "rounded-full px-4 py-2 text-neutral-600 hover:text-neutral-900",
              )}
            >
              Home
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              linkClass,
              "group inline-flex items-center gap-1.5 rounded-full bg-transparent px-4 py-2 outline-none text-neutral-600 data-[state=open]:bg-black/5 data-[state=open]:text-neutral-900 hover:text-neutral-900",
            )}
          >
            Categories
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 opacity-60",
                smoothCurve,
                "group-data-[state=open]:rotate-180 group-data-[state=open]:opacity-100",
              )}
              aria-hidden
            />
          </NavigationMenu.Trigger>

          {/* ULTRA-SMOOTH DROPDOWN ENTRANCE
            - origin-top: Makes it feel like it's dropping down from the button, rather than appearing from the center.
            - zoom-out-[0.98]: A much softer shrink. Shrinking to 95% is too aggressive for high-end UI.
            - slide-in-from-top-1: A very subtle vertical drift.
          */}
          <NavigationMenu.Content
            className={cn(
              "absolute left-1/2 top-full mt-2.5 -translate-x-1/2",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-100",
              "data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-2",
              "origin-top",
              "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            )}
          >
            {/* THE NEW GLASS PANEL UI 
              - backdrop-blur-[48px]: Extreme blur to completely melt the background elements.
              - bg-white/70: Slightly more transparent to let the deep blur show through.
              - saturate-[1.8]: Makes whatever is behind the glass look vibrant.
            */}
            <div className="w-[260px] overflow-hidden rounded-3xl bg-white/70 p-2.5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.04] backdrop-blur-[48px] saturate-[1.8]">
              {/* Added a subtle section header to give the list structure */}
              <div className="px-3 pb-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Collections
                </p>
              </div>

              <ul className="flex flex-col space-y-0.5">
                {categories.map((item) => (
                  <li key={item.href}>
                    <NavigationMenu.Link asChild>
                      {/* Upgraded hover state: 
                        Instead of just changing background color, it physically elevates into a white pill 
                        with a subtle shadow, making it feel highly tactile.
                      */}
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center justify-between rounded-2xl px-3 py-2.5 text-[14px] font-medium text-neutral-600 hover:bg-white hover:text-neutral-950 hover:shadow-sm hover:ring-1 hover:ring-black/5",
                          smoothCurve,
                        )}
                      >
                        <span>{item.label}</span>

                        {/* Upgraded Chevron: 
                          Slides into a perfect circular container, mimicking Apple's exact UI patterns.
                        */}
                        <div
                          className={cn(
                            "flex h-6 w-6 -translate-x-3 items-center justify-center rounded-full bg-neutral-100 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                            smoothCurve,
                          )}
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-neutral-900" />
                        </div>
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
