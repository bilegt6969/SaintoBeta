import type { Transition, Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Avoid SSR/client mismatch: motion only after mount, and never with reduced motion. */
export function useSearchMotion() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldAnimate = mounted && !prefersReducedMotion;

  return { mounted, shouldAnimate };
}

/** * Apple's signature fluid momentum curve.
 * Fast initial acceleration, long smooth deceleration.
 */
export const searchEase = [0.32, 0.72, 0, 1] as const;

export const searchSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: searchEase,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: searchEase },
  },
};

export const searchBarVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...searchSpring,
      opacity: { duration: 0.4, ease: searchEase },
    },
  },
};

export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: searchEase,
    },
  },
};

export const messageVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: searchEase },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: searchEase },
  },
};
