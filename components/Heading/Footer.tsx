"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FooterProps {
  siteName?: string;
}

const SITE_NAME_DEFAULT = "Sainto";

const bottomLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy policy", href: "#" },
  { label: "Support", href: "#" },
  { label: "Cookie Settings", href: "#" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/sainto.store",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sainto.app/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@sainto.mn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/company/108702260/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// --- Animation Configs ---
const slowEase = [0.16, 1, 0.3, 1] as const;

const muiStaggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const muiFadeUpItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: slowEase },
  },
};

// --- Components ---

function HomeFooter({
  siteName,
  useWhiteBg,
}: FooterProps & { useWhiteBg?: boolean }) {
  const SITE_NAME = siteName || SITE_NAME_DEFAULT;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <>
      <footer
        className={`relative overflow-hidden selection:bg-neutral-200 border-t-1 border-gray-200 ${useWhiteBg ? "bg-white" : "bg-[#f5f5f5]"}`}
      >
        <div className="" />
        <motion.div
          variants={muiStaggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col"
        >
          {/* Inner Content Container */}
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-16 pt-4 md:pt-6 pb-5 md:pb-6">
            {/* Main Brand & Desktop Social Row */}
            <div className="flex items-center justify-between w-full mb-4 md:mb-8">
              {/* Left: Brand Logo */}
              <motion.div variants={muiFadeUpItem} className="flex-shrink-0">
                <Link
                  href="/"
                  className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded transition-transform duration-300 active:scale-95"
                  aria-label={SITE_NAME}
                >
                  <Image
                    src="/Lelogo.svg"
                    alt={SITE_NAME}
                    width={130}
                    height={45}
                    className="h-7 md:h-8 w-auto object-contain brightness-0"
                    priority
                  />
                </Link>
              </motion.div>

              {/* Center: Social Icons (Desktop Only) */}
              <motion.div
                variants={muiFadeUpItem}
                className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2"
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-5 h-5 text-neutral-500 transition-all duration-300 ease-out hover:text-black hover:-translate-y-[2px] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-sm"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </motion.div>

              {/* Right: Modern Styling Accents (Vertical Bars) */}
              <motion.div
                variants={muiFadeUpItem}
                className="flex gap-[3.5px] items-center opacity-80"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[1.5px] h-5 md:h-6 bg-black" />
                ))}
              </motion.div>
            </div>

            {/* Mobile Social List (Hidden on Desktop) */}
            <motion.div
              variants={muiFadeUpItem}
              className="flex flex-col w-full md:hidden mb-5"
            >
              <div className="w-full h-px bg-neutral-200/80 mb-1" />
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-[12px] border-b border-neutral-200/80 group active:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-4 text-neutral-900">
                    <div className="w-[20px] h-[20px] flex items-center justify-center opacity-80">
                      {social.icon}
                    </div>
                    <span className="text-[15px] font-medium tracking-tight">
                      {social.name}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              ))}
            </motion.div>

            {/* Bottom Row: Documentation Links & System Meta */}
            <motion.div
              variants={muiFadeUpItem}
              className="flex flex-col items-center justify-center gap-3 md:gap-3.5 text-center px-2 md:px-0"
            >
              {/* Horizontal Links Stack */}
              <ul className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-1 gap-y-2 text-[13px] md:text-[13.5px] text-neutral-600 md:text-neutral-500/90 font-medium tracking-tight">
                {bottomLinks.map((link, index) => (
                  <li key={link.label} className="flex items-center">
                    <Link
                      href={link.href}
                      className="transition-colors duration-300 hover:text-black"
                    >
                      {link.label}
                    </Link>
                    {/* Bullets only show on desktop */}
                    {index < bottomLinks.length - 1 && (
                      <span className="hidden md:inline mx-2.5 text-neutral-400 select-none text-[11px]">
                        •
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Copyright Frame */}
              <p className="text-[12px] md:text-[13px] text-neutral-500 md:text-neutral-400 font-medium md:font-normal tracking-tight select-none mt-1 md:mt-0">
                Copyright &copy; {SITE_NAME} by bytecode 2025-{year}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}

function SimpleFooter({ useWhiteBg }: { useWhiteBg?: boolean }) {
  return (
    <footer
      className={`relative w-full overflow-hidden pb-6 pt-8 ${useWhiteBg ? "bg-white" : "bg-[#f5f5f5]"}`}
    >
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
          <span className="font-sans text-[12px] tracking-[0.04em] text-neutral-400/90 antialiased transition-colors duration-500 hover:text-neutral-600 select-none">
            Thats all.
          </span>
          <span className="font-sans text-[12px] tracking-[0.04em] text-neutral-400/90 antialiased select-none">
            For now.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

export default function Footer({ siteName }: FooterProps) {
  const pathname = usePathname();

  const isCategoryPage = pathname?.startsWith("/category");
  const isSearchPage = pathname === "/search";
  const isAboutPage = pathname === "/about";
  const isBlogPage = pathname === "/blog";
  const isContactPage = pathname === "/contact";
  const isProductPage = pathname?.startsWith("/product/");

  // Pages with white background
  const useWhiteBg =
    isAboutPage || isBlogPage || isContactPage || isProductPage;

  return isCategoryPage || isSearchPage ? (
    <SimpleFooter useWhiteBg={useWhiteBg} />
  ) : (
    <HomeFooter siteName={siteName} useWhiteBg={useWhiteBg} />
  );
}
