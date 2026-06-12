"use client";

import { motion, type Transition } from "framer-motion";
import { cn } from "lib/cn";
import { type ReactNode } from "react";

export const metalScanTransition: Transition = {
  duration: 2.5,
  ease: [0.175, 0.885, 0.32, 1],
  times: [0, 0.6, 0.6, 1],
  repeat: Infinity,
  repeatType: "mirror",
  repeatDelay: 0.2,
};

const clipPathKeyframes = [
  "inset(0px 0px 0px 0px)",
  "inset(0px 100% 0px 0px)",
  "inset(0px 100% 0px 0px)",
  "inset(0px 0px 0px 0px)",
];

const dividerKeyframes = [
  "translateX(12px)",
  "translateX(-12px)",
  "translateX(-12px)",
  "translateX(12px)",
];

export function MetalShimmer({
  children,
  metal,
  className,
  clipBackgroundClassName = "bg-[#f3f3f3]",
  active,
}: {
  children: ReactNode;
  metal: ReactNode;
  className?: string;
  clipBackgroundClassName?: string;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-grid w-fit max-w-full grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1",
        className,
      )}
    >
      <span className="col-start-1 row-start-1 z-0 min-w-0">{metal}</span>
      <motion.span
        className={cn(
          "col-start-1 row-start-1 z-10 min-w-0",
          clipBackgroundClassName,
        )}
        initial={{ clipPath: "inset(0px 0px 0px 0px)" }}
        animate={{
          clipPath: active ? clipPathKeyframes : "inset(0px 0px 0px 0px)",
        }}
        transition={active ? metalScanTransition : { duration: 0.2 }}
      >
        {children}
      </motion.span>
      {active ? (
        <motion.span
          aria-hidden
          className="pointer-events-none col-start-1 row-start-1 z-20 h-full w-[2px] justify-self-center rounded-full bg-neutral-400"
          initial={{ transform: "translateX(12px)" }}
          animate={{ transform: dividerKeyframes }}
          transition={metalScanTransition}
        />
      ) : null}
    </span>
  );
}

export function metalTextClassName() {
  return "bg-gradient-to-r from-neutral-500 via-neutral-200 to-neutral-600 bg-clip-text font-bold text-transparent";
}
