"use client";

import { motion } from "framer-motion";

// Buttery smooth easing curve
const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: customEase },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: customEase },
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col items-center py-12 px-6 font-sans antialiased selection:bg-neutral-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[640px] flex flex-col"
      >
        {/* 1920x1080 Image Container */}
        <motion.div
          variants={imageVariants}
          className="relative w-full aspect-video bg-[#111] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-10 shadow-lg"
        >
          {/* Replace src with your actual 1920x1080 image path */}
          <img
            src="https://i.pinimg.com/736x/10/7d/d2/107dd25c49403ba60a12fb0f25616443.jpg"
            alt="Sainto Cover"
            className="w-full h-full object-cover"
          />
          {/* Optional: subtle inner shadow overlay to make it look embedded */}
          <div className="absolute inset-0 border border-black/10 rounded-[24px] sm:rounded-[32px] pointer-events-none" />
        </motion.div>

        {/* Text Content */}
        <article className="flex flex-col text-[#1D1D1F] w-full pl-1 sm:pl-2">
          <motion.h1
            variants={titleVariants}
            className="text-[42px] sm:text-[48px] font-medium tracking-[-0.05em] mb-3 leading-none"
          >
            dear visitor,
          </motion.h1>

          {/* Tight letter spacing and line height to match the reference */}
          <div className="text-[17px] sm:text-[19px] leading-[1.15] tracking-[-0.035em] font-medium flex flex-col gap-0 text-neutral-800">
            {[
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
            ].map((text, i) => (
              <motion.p variants={textVariants} key={i}>
                {text}
              </motion.p>
            ))}
          </div>
        </article>
      </motion.div>
    </main>
  );
}
