"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "lib/cn";
import type { NavLink } from "lib/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const linkClass =
  "text-sm font-medium text-neutral-800 transition-opacity hover:opacity-70";

export default function Menu({ categories }: { categories: NavLink[] }) {
  return (
    <NavigationMenu.Root className="relative z-10 hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link
              href="/"
              className={cn(
                linkClass,
                "rounded-full px-3 py-1.5 text-neutral-900/70",
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
              "group inline-flex items-center gap-0.5 rounded-full bg-transparent px-3 py-1.5 outline-none  text-neutral-900/70",
            )}
          >
            Categories
            <ChevronDown
              className="h-4 w-4 opacity-80 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-full pt-3">
            <div className="island-surface min-w-[200px] rounded-2xl p-2">
              <ul className="space-y-0.5">
                {categories.map((item) => (
                  <li key={item.href}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-[13px] text-neutral-800 transition-colors hover:bg-black/5"
                      >
                        {item.label}
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
