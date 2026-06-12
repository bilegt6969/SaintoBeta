"use client";

import { cn } from "lib/cn";
import type { Image as CommerceImage } from "lib/commerce/types";
import Image from "next/image";
import Link from "next/link";

function CategoryLogo({
  logo,
  title,
  compact,
  priority,
}: {
  logo?: CommerceImage;
  title: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const logoClass = cn(
    "h-[3.6rem] w-auto max-w-full invert-50 brightness-110 contrast-125 saturate-50 object-contain object-left sm:h-[4.2rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:brightness-90 group-hover:contrast-150 group-hover:saturate-30",
    compact && "max-lg:h-[3rem]",
  );

  if (logo?.url) {
    return (
      <Image
        src={logo.url}
        alt={logo.altText || title}
        width={logo.width || 400}
        height={logo.height || 80}
        className={logoClass}
        priority={priority}
        unoptimized={logo.url.endsWith(".svg")}
      />
    );
  }

  return (
    <span
      className={cn(
        "block truncate text-[2.1rem] font-bold leading-tight text-neutral-900 sm:text-[2.4rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:brightness-90 group-hover:contrast-150 group-hover:saturate-30",
        compact && "max-lg:text-[1.8rem]",
      )}
    >
      {title}
    </span>
  );
}

function AnimatedChevron({ compact }: { compact?: boolean }) {
  return (
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
      className={cn(
        " h-6 w-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-neutral-400 group-hover:translate-x-2 group-hover:scale-110",
        compact && "max-lg:h-5 max-lg:w-5",
      )}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function HomeCategoryCard({
  title,
  href,
  logo,
  priority,
  density = "default",
}: {
  title: string;
  href: string;
  logo?: CommerceImage;
  priority?: boolean;
  density?: "default" | "compact" | "bento";
}) {
  const isCompact = density === "compact";
  const isBento = density === "bento";

  return (
    <article className="group h-full min-w-0">
      <Link href={href} prefetch className="block h-full min-w-0">
        <div
          className={cn(
            "category-bento-product-image relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white p-4 sm:p-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bg-neutral-200",
            isCompact && "max-lg:rounded-xl max-lg:p-3",
            isBento && "rounded-xl p-3",
          )}
        >
          <div className="flex h-full min-h-[140px] w-full flex-col">
            {/* Top Section: Explore Label + Chevron */}
            <div className="flex items-center justify-start gap-2">
              <span
                className={cn(
                  "text-[1.2rem] font-medium leading-none invert-70 brightness-110 contrast-125 saturate-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-neutral-400",
                  (isCompact || isBento) && "max-lg:text-xs",
                )}
              >
                Explore
              </span>
              <AnimatedChevron compact={isCompact || isBento} />
            </div>

            {/* Bottom: Logo pinned to bottom left */}
            <div className="mt-auto flex w-full items-end justify-between">
              <CategoryLogo
                logo={logo}
                title={title}
                compact={isCompact || isBento}
                priority={priority}
              />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
