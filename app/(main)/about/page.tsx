"use client";

import { Easing, motion } from "framer-motion";
import Image from "next/image";

// Smooth Apple-like easing
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
  "A place for all those pieces you keep seeing online but can never get your hands on. The niche finds. The underrated brands. The stuff your algorithm keeps feeding you.",
  "No more gatekeeping.",
  'No more asking "where did you get that?"',
  "No more spending three hours searching with zero aura results.",
  "We are still figuring things out. The site will change. New things will come.",
  "Some things will break. Some things will get better.",
  "But the idea stays the same.",
  "Finding cool stuff should not feel like a side quest.",
  "Thanks for stopping by.",
  "Sainto",
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#F5F5F7] flex flex-col items-center py-16 px-6 font-sans antialiased selection:bg-neutral-300 overflow-hidden z-0">
      {/* Animated Blurry Background Orbs (Glassmorphism Effect) */}
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
          className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-neutral-300/40 rounded-full blur-[80px]"
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
          className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-neutral-200/50 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[640px] flex flex-col relative z-10 pb-12"
      >
        {/* 1920x1080 Image Container */}
        <motion.div
          variants={imageVariants}
          className="relative w-full aspect-video bg-[#E5E5EA] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <Image
            src="https://i.pinimg.com/736x/16/d9/66/16d96602abcfbcfe627e6beeae47be4a.jpg"
            alt="Sainto Cover"
            fill
            priority
            sizes="(max-w-[640px]) 100vw, 640px"
            className="object-cover"
          />
          {/* Subtle inner shadow overlay */}
          <div className="absolute inset-0 border border-black/5 pointer-events-none rounded-[24px] sm:rounded-[32px]" />
        </motion.div>

        {/* Text Content */}
        <article className="flex flex-col w-full pl-1 sm:pl-2">
          {/* Eyebrow text matching the reference image */}
          <motion.h2
            variants={textVariants}
            className="text-[#86868B] text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.25em] mb-4"
          >
            A Letter From The Founders
          </motion.h2>

          <motion.h1
            variants={textVariants}
            className="text-[#1D1D1F] text-[38px] sm:text-[46px] font-semibold tracking-[-0.04em] mb-10 leading-none"
          >
            Dear visitor,
          </motion.h1>

          {/* Letter-inspired Serif body text */}
          <div className="font-serif text-[17px] sm:text-[19px] leading-[1.65] flex flex-col gap-6 text-[#515154]">
            {manifestoText.map((text, i) => {
              const isSignOff = i >= manifestoText.length - 2;

              return (
                <motion.p
                  variants={textVariants}
                  key={i}
                  className={
                    isSignOff
                      ? "text-[#1D1D1F] italic mt-2 font-medium"
                      : "max-w-[96%]"
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
