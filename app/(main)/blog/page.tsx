"use client";

import { Easing, motion } from "framer-motion";
import Link from "next/link";

// Buttery smooth Apple-like easing curve
const customEase: Easing = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: customEase },
  },
};

const baseVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: customEase, delay: 0.4 },
  },
};

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white flex flex-col items-center justify-center px-6 font-sans antialiased selection:bg-neutral-200 z-0">
      {/* Animated Blurry Background Orbs (Restored from About Page) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[25%] w-[450px] h-[450px] bg-neutral-100/70 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[25%] left-[20%] w-[400px] h-[400px] bg-neutral-50 rounded-full blur-[100px]"
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[580px] flex flex-col text-center items-center relative z-10"
      >
        {/* Editorial Eyebrow */}
        <motion.h2
          variants={textVariants}
          className="text-[#86868B] text-[12px] sm:text-[13px] font-medium tracking-[0.04em] mb-8 "
        >
          Blog
        </motion.h2>

        {/* The Statement */}
        <motion.h1
          variants={textVariants}
          className="text-[#151516e3] text-[26px] sm:text-[32px] font-semibold tracking-tight leading-[1.3] max-w-[90%] mb-16"
        >
          The founders are too busy — <br className="hidden sm:inline" />
          So no blog for today.
        </motion.h1>

        {/* Structurally heavier anchor to balance the layout */}
        <motion.div variants={baseVariants} className="w-full sm:w-[80%]">
          <Link
            href="/"
            className="group relative flex items-center justify-center w-full py-4 px-6 text-[15px] font-medium text-[#1D1D1F] transition-all duration-300"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300 mr-2">
              ←
            </span>
            Return to safe grounds
            <div className="absolute inset-0 pointer-events-none rounded-[16px]" />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
