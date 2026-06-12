"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FooterProps {
  siteName?: string;
  categories?: { label: string; href: string }[];
}

const SITE_NAME_DEFAULT = "Sainto";

const categoryLinks = [
  { label: "Accessories", href: "/category/Accessories" },
  { label: "Beauté", href: "/category/beaute" },
  { label: "Clothé", href: "/category/clothe" },
  { label: "Tech", href: "/category/tech" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "/contact" },
];

// --- Animation Physics ---
// Buttery, slow ease-out for entrance animations
const slowEase = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: slowEase },
  },
};

// --- Components ---

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <motion.div variants={fadeUpItem} className="flex flex-col">
      <p className="mb-4 text-[13px] font-semibold tracking-wide text-white/90 uppercase antialiased">
        {title}
      </p>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-neutral-400 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function HomeFooter({ siteName, categories }: FooterProps) {
  const SITE_NAME = siteName || SITE_NAME_DEFAULT;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer className="relative mt-16 md:mt-24 overflow-hidden bg-[#f5f5f5]">
      <div className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {/* Restored the dynamic padding to allow the full watermark to show */}
        <div className="relative pb-[clamp(8rem,35vw,22rem)]">
          {/* Background Watermark */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: slowEase }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center"
            aria-hidden
          >
            <div className="relative w-full max-w-[72rem]">
              <Image
                src="/Lelogo.svg"
                alt=""
                width={1666}
                height={360}
                className="h-auto w-full select-none opacity-[0.85]"
                priority={false}
              />
              <div
                className="absolute inset-x-0 bottom-0 w-full h-[120%] bg-gradient-to-b from-transparent via-white/40 to-[#f5f5f5] backdrop-blur-2xl"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black)",
                }}
              />
            </div>
          </motion.div>

          {/* Main Dark Panel - Slimmer profile & Square on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: slowEase }}
            className="relative z-10 overflow-hidden rounded-[2rem] bg-[#050505] shadow-[0_16px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-white/[0.08] md:rounded-[2.5rem] flex flex-col justify-between max-md:aspect-square"
          >
            {/* Ambient internal top glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />

            {/* Inner Content Wrapper */}
            <div className="flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12"
              >
                {/* Brand Column */}
                <motion.div variants={fadeUpItem} className="max-w-xs shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
                    aria-label={SITE_NAME}
                  >
                    <Image
                      src="/Lelogo.svg"
                      alt=""
                      width={1666}
                      height={360}
                      className="h-10 w-auto invert max-w-auto object-contain brightness-0 invert"
                    />
                  </Link>
                  <p className="mt-5 text-[13px] leading-relaxed text-neutral-400 antialiased max-md:line-clamp-3">
                    Lowkey the future of fashion resale. We bring curated
                    fashion, archived heat, and real finds into one seamless
                    marketplace. - NGL
                  </p>
                </motion.div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-1">
                  <div className="hidden sm:block"></div>
                  <FooterLinkColumn title="Categories" links={categoryLinks} />
                  <FooterLinkColumn title="Company" links={companyLinks} />
                </div>
              </motion.div>

              {/* Bottom Legal Row */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.6, ease: slowEase }}
                className="relative z-30 mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between md:mt-10 md:pt-8"
              >
                <p className="text-[12px] text-neutral-500 antialiased">
                  © {year} {SITE_NAME}. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-5 text-[12px] text-neutral-500 antialiased">
                  <Link href="#" className="transition-colors hover:text-white">
                    Terms of Service
                  </Link>
                  <Link href="#" className="transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Soft glow at panel bottom */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-black via-black/40 to-transparent"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

function SimpleFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#f5f5f5] pb-24 pt-20">
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-200/50 via-white/0 to-white/0"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center justify-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: slowEase }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="font-sans text-[11px] font-medium tracking-[0.12em] text-neutral-400/90 antialiased transition-colors duration-500 hover:text-neutral-600 select-none">
            End of the line.
          </span>
          <span className="font-sans text-[9px] font-light tracking-[0.15em] text-neutral-300 antialiased select-none">
            "lé finds"
          </span>
        </motion.div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none h-24"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 10%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 10%, transparent 100%)",
        }}
      />
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
