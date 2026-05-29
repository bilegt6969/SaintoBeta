"use client";

import type { NavLink } from "lib/navigation";
import { cn } from "lib/cn";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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

export default function MobileMenu({ isOpen, setIsOpen, categories }: Props) {
  const [mounted, setMounted] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  useEffect(() => setMounted(true), []);

  const handleClose = () => setIsOpen(false);

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const menuVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 26 },
    },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.3 } },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end lg:hidden">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleClose}
            className="absolute left-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </motion.button>
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-[10000] flex max-h-[80vh] flex-col overflow-hidden rounded-t-[28px] bg-neutral-950 px-6 pb-8 pt-10"
          >
            <nav className="flex flex-col gap-1 overflow-y-auto">
              <Link
                href="/"
                onClick={handleClose}
                className="py-3 text-lg font-medium text-white"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={() => setCategoriesOpen((o) => !o)}
                className="flex items-center justify-between py-3 text-lg font-medium text-white"
              >
                Categories
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    categoriesOpen && "rotate-180",
                  )}
                />
              </button>
              {categoriesOpen && (
                <ul className="mb-2 space-y-1 border-l border-white/10 pl-4">
                  {categories.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className="block py-2 text-[15px] text-white/80 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/search"
                onClick={handleClose}
                className="py-3 text-lg font-medium text-white"
              >
                Search
              </Link>
              <div className="mt-4 pt-2">
                <SignInButton
                  className="w-full justify-center py-2.5"
                  onClick={handleClose}
                />
              </div>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
