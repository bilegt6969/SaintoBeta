"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useMediaQuery } from "hooks/use-media-query";
import { cn } from "lib/cn";
import { Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const easeOutSmooth = [0.16, 1, 0.3, 1] as const;

interface NavbarSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function NavbarSearchModal({
  isOpen,
  onClose,
  onOpen,
}: NavbarSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen();
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose, onOpen]);

  useEffect(() => {
    setHasTyped(searchQuery.trim().length > 0);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    setSearchQuery("");
    setHasTyped(false);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose();
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: easeOutSmooth } },
    exit: { opacity: 0, transition: { duration: 0.35 } },
  };

  const searchBarVariants: Variants = {
    hidden: { opacity: 0, y: isLargeScreen ? -16 : 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 26 },
    },
    exit: {
      opacity: 0,
      y: isLargeScreen ? -8 : 8,
      scale: 0.99,
      transition: { duration: 0.35 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-[99] bg-neutral-950/75 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="pointer-events-none fixed inset-0 z-[110] flex items-end justify-center px-4 pb-28 max-lg:pb-[calc(max(0.75rem,env(safe-area-inset-bottom))+5.5rem)] lg:items-start lg:pt-28 lg:pb-0">
            <motion.div
              variants={searchBarVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="pointer-events-auto w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="mb-3 ml-auto block text-[13px] text-white/50 transition-colors hover:text-white/80"
              >
                Close
              </button>
              <form onSubmit={handleSubmit} className="relative">
                <div className="pointer-events-none absolute left-5 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2">
                  {hasTyped ? (
                    <span className="text-[15px] font-semibold tracking-tight text-neutral-500">
                      Search
                    </span>
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="products…"
                  autoComplete="off"
                  className={cn(
                    "island-surface h-14 w-full rounded-full pr-14 text-[16px] text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/20",
                    hasTyped ? "pl-[5.5rem]" : "pl-12",
                  )}
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className={cn(
                    "absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors",
                    hasTyped
                      ? "bg-white text-black hover:bg-neutral-100"
                      : "bg-white/15 text-white/90 hover:bg-white/20",
                  )}
                >
                  <Reply className="h-5 w-5 rotate-180" strokeWidth={2} />
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
