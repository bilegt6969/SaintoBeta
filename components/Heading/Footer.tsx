"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FooterProps {
  siteName?: string;
}

const SITE_NAME_DEFAULT = "Sainto";

const productLinks = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Integrations", href: "#" },
  { label: "Changelog", href: "#" },
];

const resourcesLinks = [
  { label: "Documentation", href: "#" },
  { label: "API", href: "#" },
  { label: "Help Center", href: "#" },
  { label: "Community", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-neutral-900">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ siteName }: FooterProps) {
  const SITE_NAME = siteName || SITE_NAME_DEFAULT;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer className="relative mt-16 md:mt-24">
      <div className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/*
          Reserve space below the panel so the watermark sits in front of the
          page background — increased padding to show full height.
        */}
        <div className="relative pb-[clamp(12rem,30vw,20rem)]">
          {/* frame69 — bottom layer, anchored to footer bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center"
            aria-hidden
          >
            <Image
              src="/frame69.svg"
              alt=""
              width={1666}
              height={360}
              className="h-auto w-full max-w-[72rem] select-none"
              priority={false}
            />
          </div>

          {/* Panel — foreground; only overlaps the top of the wordmark */}
          <div className="relative z-10 overflow-hidden rounded-[2rem] bg-gradient-to-b from-neutral-100 to-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] md:rounded-[2.5rem]">
            <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                <div className="max-w-sm shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2.5"
                    aria-label={SITE_NAME}
                  >
                    <Image
                      src="/logo.svg"
                      alt=""
                      width={1666}
                      height={360}
                      className="h-5 w-auto max-w-[4.5rem] object-contain brightness-0"
                    />
                    <span className="text-lg font-semibold tracking-tight text-neutral-500">
                      - First Marketplace of Mongolia
                    </span>
                  </Link>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                    {SITE_NAME} helps teams transform complex data into clear,
                    engaging stories — everything you need in one place.
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
                  <FooterLinkColumn title="Product" links={productLinks} />
                  <FooterLinkColumn title="Resources" links={resourcesLinks} />
                  <FooterLinkColumn title="Company" links={companyLinks} />
                </div>
              </div>

              <div className="relative z-30 mt-10 flex flex-col gap-4 border-t border-neutral-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-12 md:pt-8">
                <p className="text-xs text-neutral-400">
                  © {year} {SITE_NAME}. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-6 text-xs text-neutral-400">
                  <Link
                    href="#"
                    className="underline underline-offset-2 transition-colors hover:text-neutral-600"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="underline underline-offset-2 transition-colors hover:text-neutral-600"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Soft glow where panel meets the wordmark (top of SVG only) */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-b from-transparent via-white/50 to-white backdrop-blur-[5px] md:h-24"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
