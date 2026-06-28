"use client";

import { cn } from "lib/cn";
import type { Image as CommerceImage } from "lib/commerce/types";
import type { NavLink } from "lib/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BlackCardFooter } from "./black-card-footer";

const BRANDS: NavLink[] = [
  { label: "Moscot", href: "/search?q=Moscot" },
  { label: "Maison Margiela", href: "/search?q=Maison+Margiela" },
  { label: "Based", href: "/search?q=Based" },
  { label: "Goyard", href: "/search?q=Goyard" },
  { label: "Apple", href: "/search?q=Apple" },
  { label: "Logitech", href: "/search?q=Logitech" },
];

function NavColumn({
  title,
  items,
  activeHref,
  compact = false,
  seeMoreHref,
}: {
  title: string;
  items: NavLink[];
  activeHref?: string;
  compact?: boolean;
  seeMoreHref?: string;
}) {
  const displayItems = items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="min-w-0">
      <p
        className={`mb-1 text-neutral-200 ${compact ? "text-[10px]" : "mb-2 text-xs"}`}
      >
        {title}
      </p>
      <ul className={compact ? "space-y-1" : "space-y-1.5"}>
        {displayItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block truncate leading-snug transition-colors ${
                  compact ? "text-[11px]" : "text-[13px]"
                } ${
                  isActive
                    ? "font-medium text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {hasMore && seeMoreHref && (
          <li>
            <Link
              href={seeMoreHref}
              className={`block truncate leading-snug transition-colors ${
                compact ? "text-[11px]" : "text-[13px]"
              } text-neutral-200 hover:text-neutral-300`}
            >
              ... see more
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

function CardLogo({
  siteName,
  logoHref,
  logo,
  compact = false,
  mobileLogoOnly = false,
}: {
  siteName: string;
  logoHref: string;
  logo?: CommerceImage;
  compact?: boolean;
  /** Centered logo fill on mobile category bento (nav hidden) */
  mobileLogoOnly?: boolean;
}) {
  const linkClass = cn(
    "inline-block",
    compact && !mobileLogoOnly && "mb-2",
    !compact && !mobileLogoOnly && "mb-4",
    mobileLogoOnly &&
      "flex max-lg:mb-0 max-lg:h-full max-lg:w-full max-lg:items-start max-lg:justify-start lg:mb-4",
  );

  const logoClass = cn(
    "object-contain brightness-0 invert",
    mobileLogoOnly &&
      "max-lg:h-auto max-lg:max-h-[72%] max-lg:w-auto max-lg:max-w-[88%] max-lg:object-left",
    mobileLogoOnly &&
      "lg:h-[3.375rem] lg:w-auto lg:max-w-[19.5rem] lg:object-left",
    !mobileLogoOnly &&
      compact &&
      "mb-2 h-24 w-auto max-w-[22rem] object-left sm:mb-3 sm:h-16",
    !mobileLogoOnly &&
      !compact &&
      "mb-4 h-20 w-auto max-w-[24rem] object-left sm:h-[5.5rem] sm:max-w-[26rem]",
  );

  if (logo?.url) {
    return (
      <Link href={logoHref} className={linkClass} aria-label={siteName}>
        <Image
          src={logo.url}
          alt={logo.altText || siteName}
          width={logo.width || 800}
          height={logo.height || 200}
          className={logoClass}
          priority
          unoptimized={logo.url.endsWith(".svg")}
        />
      </Link>
    );
  }

  return (
    <Link href={logoHref} className={linkClass} aria-label={siteName}>
      <span
        className={cn(
          "block truncate text-white font-bold leading-tight",
          compact && "text-xl sm:text-2xl",
          !compact && "text-2xl sm:text-3xl",
          mobileLogoOnly && "max-lg:text-3xl lg:text-2xl",
        )}
      >
        {siteName}
      </span>
    </Link>
  );
}

export function BlackCard({
  siteName = "Sainto",
  logoHref = "/",
  logo,
  categories,
  activeCategoryHref,
  variant = "default",
  showNav = true,
  showFooter = true,
  description,
  categoriesSeeMoreHref = "/category",
  brandsSeeMoreHref = "/search",
}: {
  siteName?: string;
  logoHref?: string;
  logo?: CommerceImage;
  categories: NavLink[];
  activeCategoryHref?: string;
  /** Fills bento row-span-2 cell on mobile category grids */
  variant?: "default" | "bento";
  /** Whether to show navigation columns (Categories, Top brands) */
  showNav?: boolean;
  /** Whether to show the footer text */
  showFooter?: boolean;
  description?: string;
  /** Link for categories 'see more' */
  categoriesSeeMoreHref?: string;
  /** Link for brands 'see more' */
  brandsSeeMoreHref?: string;
}) {
  const isBento = variant === "bento";
  const [hovered, setHovered] = useState(false);

  return (
    <article className="flex w-full flex-col">
      <div
        className={cn(
          "relative flex aspect-square w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-black p-3 sm:p-4 sm:aspect-[4/3]",
          isBento && "max-lg:p-4",
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardLogo
          siteName={siteName}
          logoHref={logoHref}
          logo={logo}
          compact={isBento}
          mobileLogoOnly={false}
        />
        {showNav && (
          <div
            className={cn(
              "grid min-h-0 flex-1 grid-cols-2 gap-x-2 gap-y-0.5 overflow-hidden sm:gap-x-3",
            )}
          >
            <NavColumn
              title="Categories"
              items={categories}
              activeHref={activeCategoryHref}
              compact={isBento}
              seeMoreHref={categoriesSeeMoreHref}
            />
            <NavColumn
              title="Top brands"
              items={BRANDS}
              compact={isBento}
              seeMoreHref={brandsSeeMoreHref}
            />
          </div>
        )}
        {!showNav && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
            <Link
              href={logoHref}
              className="flex items-end gap-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              aria-label={`Explore ${siteName}`}
            >
              <span
                className={`text-xl font-medium transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-lg:text-sm ${
                  hovered ? "text-neutral-400" : "text-neutral-200"
                }`}
              >
                explore
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-6 w-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] max-lg:h-4 max-lg:w-4 ${
                  hovered
                    ? "translate-x-1 scale-110 text-neutral-400"
                    : "translate-x-0 scale-100 text-white"
                }`}
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
      {description && (
        <div className="mt-3 max-w-[80%] space-y-2 max-lg:hidden">
          <p className="text-xs text-neutral-400 line-clamp-2">{description}</p>
        </div>
      )}
      {showFooter && !isBento && <BlackCardFooter />}
    </article>
  );
}
