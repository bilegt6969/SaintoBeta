"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Buttery smooth Apple-like easing curve
const customEase = [0.16, 1, 0.3, 1] as const;

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
  hidden: { opacity: 0, y: 20, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: customEase as any },
  },
};

export default function BlogPage() {
  return (
    <main className="relative h-[calc(100vh-68px-40px-280px)] overflow-hidden bg-[#f5f5f5] flex flex-col items-center justify-center px-6 font-sans antialiased z-0">
      {/* Animated Blurry Background Orbs */}
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
          className="absolute top-[20%] right-[25%] w-[450px] h-[450px] rounded-full"
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
          className="absolute bottom-[25%] left-[20%] w-[400px] h-[400px] rounded-full "
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[640px] flex flex-col text-center items-center"
      >
        {/* Editorial Eyebrow */}
        <motion.h2
          variants={textVariants}
          className="text-[#86868B] text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.1em] mb-6"
        >
          Sainto Blog
        </motion.h2>

        {/* The Statement */}
        <motion.h1
          variants={textVariants}
          className="font-serif text-[#1D1D1F] text-[28px] sm:text-[34px] font-medium tracking-[-0.03em] leading-[1.4] max-w-[85%] mb-12 text-neutral-800"
        >
          The founders are too busy — <br className="hidden sm:inline" />
          So no blog for today.
        </motion.h1>

        {/* Minimal Subtle Navigation Rule/Link */}
        <motion.div variants={textVariants}>
          <Link
            href="/"
            className="text-[14px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors duration-300 tracking-[-0.01em] flex items-center gap-1.5 group"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform duration-300">
              ←
            </span>
            Back to safe grounds
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
