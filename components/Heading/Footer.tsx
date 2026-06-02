"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FooterProps {
  siteName?: string;
}

const SITE_NAME_DEFAULT = "Sainto";

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
      <p className="mb-4 text-sm font-semibold text-white">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomeFooter({ siteName }: FooterProps) {
  const SITE_NAME = siteName || SITE_NAME_DEFAULT;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer className="relative mt-16 md:mt-24">
      <div className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="relative pb-[clamp(6rem,30vw,20rem)]">
          {/* Watermark — bottom layer */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center"
            aria-hidden
          >
            <div className="relative w-full max-w-[72rem]">
              <Image
                src="/Lelogo.svg"
                alt=""
                width={1666}
                height={360}
                className="h-auto w-full select-none"
                priority={false}
              />
              <div
                className="absolute inset-x-0 bottom-0 w-full h-[100%] bg-gradient-to-b from-transparent via-white/100 to-white backdrop-blur-3xl"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black)",
                }}
              />
            </div>
          </div>

          {/* Panel — foreground */}
          <div className="relative z-10 overflow-hidden rounded-[2rem] bg-black shadow-[0_8px_40px_rgba(0,0,0,0.06)] md:rounded-[2.5rem]">
            <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                <div className="max-w-sm shrink-0 bg-black rounded-3xl p-2 sm:p-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2.5"
                    aria-label={SITE_NAME}
                  >
                    <Image
                      src="/Lelogo.svg"
                      alt=""
                      width={1666}
                      height={360}
                      className="h-10 w-auto invert-0 max-w-auto object-contain"
                    />
                  </Link>
                  <p className="mt-4 text-sm leading-6 text-neutral-400">
                    Lowkey the future of fashion resale. We brings curated
                    fashion, archived heat, and real finds into one seamless
                    marketplace.
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 p-2">
                  <div className="hidden sm:block"></div>
                  <FooterLinkColumn title="Resources" links={resourcesLinks} />
                  <FooterLinkColumn title="Company" links={companyLinks} />
                </div>
              </div>

              <div className="relative z-30 mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-12 md:pt-8">
                <p className="text-xs text-neutral-500">
                  © {year} {SITE_NAME}. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-6 text-xs text-neutral-500">
                  <Link
                    href="#"
                    className="underline underline-offset-2 transition-colors hover:text-neutral-300"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="underline underline-offset-2 transition-colors hover:text-neutral-300"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Soft glow at panel bottom */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-b from-transparent via-black/50 to-black backdrop-blur-[5px] md:h-24"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SimpleFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-white">
      <div className="flex flex-col items-center gap-2 pt-16 pb-24">
        <span className="text-[11px] font-medium tracking-[0.2em] text-gray-400 select-none">
          End of the line.
        </span>
        <span className="text-[9px] tracking-[0.45em] text-gray-300 select-none">
          F Yo B Ahh Doun
        </span>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 60%)",
          maskImage:
            "linear-gradient(to top, black 0%, black 30%, transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 30%, transparent 70%)",
        }}
      />

      <div className="absolute bottom-0 inset-x-0 h-6 bg-white pointer-events-none" />
    </footer>
  );
}

export default function Footer({ siteName }: FooterProps) {
  const pathname = usePathname();
  return pathname === "/" ? (
    <HomeFooter siteName={siteName} />
  ) : (
    <SimpleFooter />
  );
}
