"use client";

import CartModal from "components/cart/modal";
import Wrapper from "components/global/wrapper";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "hooks/use-media-query";
import { cn } from "lib/cn";
import type { NavLink } from "lib/navigation";
import { Menu as MenuIcon, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Menu from "./menu";
import MobileMenu from "./mobile-menu";
import { NavbarSearchModal } from "./NavbarSearchModal";
import { SignInButton } from "./sign-in-button";

const smoothEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function Navbar({
  siteName,
  categories,
}: {
  siteName: string;
  categories: NavLink[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Added scroll state

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMdScreen = useMediaQuery("(min-width: 768px)");
  const isMobile = !isLargeScreen;

  // Mount timer
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLargeScreen && isOpen) setIsOpen(false);
  }, [isLargeScreen, isOpen]);

  useEffect(() => {
    const isMobileMenuOpen = isOpen && isMobile;
    const isMobileSearchOpen = isSearchOpen && !isMdScreen;
    const shouldLockScroll = isMobileMenuOpen || isMobileSearchOpen;
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile, isSearchOpen, isMdScreen]);

  const navbarVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 28,
        mass: 0.8,
        opacity: { duration: 0.4, ease: smoothEase },
      },
    },
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[99] h-[88px]" />

      {/* Top scroll blur (mobile + desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-32 bg-white/20 backdrop-blur-md"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.header
            variants={navbarVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-x-0 top-3 z-[100] flex justify-center px-3 max-lg:top-[max(0.75rem,env(safe-area-inset-top))] lg:top-4"
          >
            <Wrapper
              className={cn(
                "island-surface flex h-12 w-fit max-w-[calc(100vw-1.5rem)] items-center justify-between gap-2.5 rounded-full px-1.5 sm:gap-4 sm:px-2",
              )}
            >
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Link
                  href="/"
                  prefetch
                  className="island-inset flex h-8.5 shrink-0 items-center rounded-full bg-white px-3 transition-opacity hover:opacity-80 sm:px-2.5"
                  aria-label={siteName}
                >
                  <Image
                    src="/logo.svg"
                    alt={siteName}
                    width={1666}
                    height={360}
                    className="h-4 w-auto max-w-[5.5rem] object-contain object-left brightness-50 sm:h-[1rem] sm:max-w-[6rem]"
                    priority
                  />
                </Link>
                <Menu categories={categories} />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className="island-inset flex h-9 items-center gap-1.5 rounded-full bg-neutral-100 px-3 text-[13px] font-medium text-neutral-800 transition-opacity hover:opacity-80 sm:px-3.5 sm:text-sm"
                  aria-label={isSearchOpen ? "Close search" : "Search"}
                  aria-expanded={isSearchOpen}
                >
                  <Search className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="hidden min-[420px]:inline">Search</span>
                </button>

                <div className="text-neutral-800 [&_button]:text-neutral-800">
                  <CartModal cartButtonVariant="island" />
                </div>

                <SignInButton className="hidden lg:inline-flex" />

                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-colors hover:bg-black/5 lg:hidden"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <MenuIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!isLargeScreen && (
                <MobileMenu
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  categories={categories}
                />
              )}
            </Wrapper>
          </motion.header>
        )}
      </AnimatePresence>

      <NavbarSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpen={() => setIsSearchOpen(true)}
      />
    </div>
  );
}
