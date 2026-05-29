import type { Image as CommerceImage } from "lib/commerce/types";
import { cn } from "lib/cn";
import type { NavLink } from "lib/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlackCardFooter } from "./black-card-footer";

const BRANDS: NavLink[] = [
  { label: "Apple", href: "/search?q=apple" },
  { label: "Ugmonk", href: "/search?q=ugmonk" },
  { label: "Hardgraft", href: "/search?q=hardgraft" },
  { label: "Teenage Engineering", href: "/search?q=teenage+engineering" },
  { label: "Grovemade", href: "/search?q=grovemade" },
  { label: "Logitech", href: "/search?q=logitech" },
];

function NavColumn({
  title,
  items,
  activeHref,
  compact = false,
}: {
  title: string;
  items: NavLink[];
  activeHref?: string;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`mb-1 text-neutral-500 ${compact ? "text-[10px]" : "mb-2 text-xs"}`}
      >
        {title}
      </p>
      <ul className={compact ? "space-y-1" : "space-y-1.5"}>
        {items.map((item) => {
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
                    : "text-neutral-200 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
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
      "flex max-lg:mb-0 max-lg:h-full max-lg:w-full max-lg:items-center max-lg:justify-center lg:mb-4",
  );

  const logoClass = cn(
    "object-contain brightness-0 invert",
    mobileLogoOnly &&
      "max-lg:mx-auto max-lg:h-auto max-lg:max-h-[72%] max-lg:w-auto max-lg:max-w-[88%] max-lg:object-center",
    mobileLogoOnly &&
      "lg:h-[3.375rem] lg:w-auto lg:max-w-[19.5rem] lg:object-left",
    !mobileLogoOnly &&
      compact &&
      "mb-2 h-8 w-auto max-w-[9rem] object-left sm:mb-3 sm:h-9",
    !mobileLogoOnly &&
      !compact &&
      "mb-4 h-12 w-auto max-w-[16.5rem] object-left sm:h-[3.375rem] sm:max-w-[19.5rem]",
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
      <Image
        src="/frame69.svg"
        alt={siteName}
        width={1666}
        height={360}
        className={logoClass}
        priority
      />
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
}: {
  siteName?: string;
  logoHref?: string;
  logo?: CommerceImage;
  categories: NavLink[];
  activeCategoryHref?: string;
  /** Fills bento row-span-2 cell on mobile category grids */
  variant?: "default" | "bento";
}) {
  const isBento = variant === "bento";

  return (
    <article className="flex w-full flex-col">
      <div
        className={cn(
          "relative flex aspect-[4/3] w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-black p-3 sm:p-4",
          isBento && "max-lg:p-4",
        )}
      >
        <CardLogo
          siteName={siteName}
          logoHref={logoHref}
          logo={logo}
          compact={isBento}
          mobileLogoOnly={isBento}
        />
        <div
          className={cn(
            "grid min-h-0 flex-1 grid-cols-2 gap-x-2 gap-y-0.5 overflow-hidden sm:gap-x-3",
            isBento && "hidden lg:grid",
          )}
        >
          <NavColumn
            title="Categories"
            items={categories}
            activeHref={activeCategoryHref}
            compact={isBento}
          />
          <NavColumn title="Top brands" items={BRANDS} compact={isBento} />
        </div>
      </div>
      {isBento ? (
        <div className="mt-2 hidden lg:block">
          <BlackCardFooter />
        </div>
      ) : (
        <BlackCardFooter />
      )}
    </article>
  );
}
