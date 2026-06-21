"use client";

import { Easing, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Smooth Apple-like easing (Do not touch)
const customEase: Easing = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(20px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: customEase },
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

const manifestoText = [
  "We started Sainto because we kept running into the same problem.",
  "You see something cool on TikTok. Maybe on Instagram. Maybe at 2am while doomscrolling.",
  "You save it.",
  "You search for it.",
  "Nothing.",
  "Either it does not exist in Ulaanbaatar, the shipping costs more than the item itself, or the website does not even deliver here.",
  "It is actually kind of insane how many good finds never make it here.",
  "So we built Sainto.",
  "A place for all those pieces you keep seeing online but can never get your hands on. The niché finds. The underrated brands. The stuff your algorithm keeps feeding you.",
  "No more gatekeeping.",
  'No more asking "where did you get that?"',
  "No more spending three hours searching with zero aura results.",
  "We are still figuring things out. The site will change. New things will come.",
  "Some things will break. Some things will get better.",
  "But the idea stays the same.",
  "Finding cool stuff should not feel like a side quest.",
  "Thanks for stopping by.",
  "-Bilegt Amartuvshin, CWRU '30",
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center pt-1 pb-24 px-6 font-sans antialiased selection:bg-neutral-200 overflow-hidden z-0">
      {/* Solid white background behind navbar */}
      <div className="fixed inset-x-0 top-0 z-[-1] h-32 bg-white" />
      {/* Animated Blurry Background Orbs (Glassmorphism Effect - Kept intact) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-neutral-100/70 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-neutral-50 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[580px] flex flex-col relative z-10 pb-12"
      >
        {/* Cover Image Container */}
        <motion.div
          variants={imageVariants}
          className="relative w-full aspect-square bg-[#F5F5F7] rounded-[20px] overflow-hidden mb-16 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <Image
            src="https://i.pinimg.com/736x/e3/42/2c/e3422ceeb1978a79f5b3219d6a8bc46a.jpg"
            alt="Sainto Cover"
            fill
            priority
            sizes="(max-w-[580px]) 100vw, 580px"
            className="object-cover"
          />
          <div className="absolute inset-0 border border-black/[0.03] pointer-events-none rounded-[20px]" />
        </motion.div>

        {/* Content Restructured to Match Provided Design System Aesthetic */}
        <article className="flex flex-col w-full px-1">
          {/* Main bold greeting style directly from the screenshot */}
          <motion.h1
            variants={textVariants}
            className="text-[#151516e3] text-[22px] sm:text-[24px] font-semibold tracking-tight mb-6"
          >
            Dear visitor,
          </motion.h1>

          {/* Clean, high-contrast minimalist sans-serif layout mirroring the image layout */}
          <div className="font-sans text-[16px] sm:text-[17px] leading-[1.65] flex flex-col gap-5 text-[#86868B] font-normal tracking-normal">
            {manifestoText.map((text, i) => {
              const isLast = i === manifestoText.length - 1;
              const isThanks = i === manifestoText.length - 2;

              // Renders the founder sign-off using the exact underline layout treatment from the image
              if (isLast) {
                const cleanName = text.replace("-", "");
                return (
                  <motion.p
                    variants={textVariants}
                    key={i}
                    className="text-[#86868B] text-[16px] sm:text-[17px] mt-8 font-normal tracking-normal"
                  >
                    <span style={{ fontStyle: "oblique 18deg" }}>
                      From{" "}
                      <Link
                        href="https://www.instagram.com/bilegtaamartuvshin/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-1 underline-offset-4 text-black font-medium hover:opacity-70 transition-opacity"
                      >
                        {cleanName}
                      </Link>
                    </span>
                  </motion.p>
                );
              }

              return (
                <motion.p
                  variants={textVariants}
                  key={i}
                  className={
                    isThanks ? "text-black/80 font-medium mt-2" : "max-w-[96%]"
                  }
                >
                  {text}
                </motion.p>
              );
            })}
          </div>
        </article>
      </motion.div>
    </main>
  );
}
