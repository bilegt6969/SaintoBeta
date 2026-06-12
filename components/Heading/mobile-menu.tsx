"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "lib/cn";
import type { NavLink } from "lib/navigation";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SignInButton } from "./sign-in-button";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: NavLink[];
}

// 1. The Fluid Spring (For structural layouts and large movements)
// High stiffness for instant reaction, high damping to completely kill any "bounce"
const fluidSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
  restDelta: 0.001, // Forces the animation to calculate to a very fine point
} as const;

// 2. The Exaggerated Ease (For opacity and CSS micro-interactions)
// Massive acceleration at the start, long buttery deceleration at the end
const ultraSmoothEase = [0.16, 1, 0.3, 1] as const;

export default function MobileMenu({ isOpen, setIsOpen, categories }: Props) {
  const [mounted, setMounted] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClose = () => setIsOpen(false);

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: ultraSmoothEase },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, ease: ultraSmoothEase },
    },
  };

  const menuVariants: Variants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: fluidSpring,
    },
    exit: {
      y: "100%",
      transition: { ...fluidSpring, stiffness: 350, damping: 36 }, // Slightly faster exit
    },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end lg:hidden">
          {/* Glassy Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
          />

          {/* The Main Menu Sheet */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-[10000] flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[32px] bg-white/90 pb-8 shadow-[0_-24px_48px_-12px_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[32px] saturate-150"
          >
            <div className="flex w-full justify-center pt-4 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-neutral-200" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                Navigation
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-200 hover:text-neutral-900"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col overflow-y-auto px-4">
              <Link
                href="/"
                onClick={handleClose}
                className="rounded-2xl px-4 py-3.5 text-lg font-medium text-neutral-700 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/5 hover:text-neutral-950"
              >
                Home
              </Link>

              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-neutral-700 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/5 hover:text-neutral-950"
                >
                  Categories
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 opacity-60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      categoriesOpen && "rotate-180 opacity-100",
                    )}
                  />
                </button>

                {/* Ultra-Fluid Accordion Animation */}
                <AnimatePresence initial={false}>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.98 }}
                      animate={{ height: "auto", opacity: 1, scale: 1 }}
                      exit={{ height: 0, opacity: 0, scale: 0.98 }}
                      transition={{
                        height: fluidSpring,
                        opacity: { duration: 0.4, ease: ultraSmoothEase },
                        scale: { duration: 0.5, ease: ultraSmoothEase },
                      }}
                      className="overflow-hidden px-4 origin-top"
                    >
                      <ul className="mb-2 ml-2 mt-1 flex flex-col space-y-1 border-l-2 border-neutral-100 pl-4">
                        {categories.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={handleClose}
                              className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-neutral-500 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/5 hover:text-neutral-900"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/search"
                onClick={handleClose}
                className="rounded-2xl px-4 py-3.5 text-lg font-medium text-neutral-700 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/5 hover:text-neutral-950"
              >
                Search
              </Link>
            </nav>

            <div className="mt-auto px-6 pt-6">
              <SignInButton
                className="w-full justify-center rounded-full py-3.5 shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96]"
                onClick={handleClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
