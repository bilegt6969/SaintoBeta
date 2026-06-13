"use client";

import { motion } from "framer-motion";

export default function AboutCard() {
  return (
    <main className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans antialiased selection:bg-neutral-200">
      {/* Extremely subtle ambient background, typical of Apple's clean UI */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-gray-100 to-white rounded-full blur-3xl opacity-50" />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.98 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like cubic bezier
        className="w-full max-w-[520px] bg-white/80 backdrop-blur-2xl border border-black/[0.03] rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 my-10"
      >
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1D1D1F] mb-8">
          Dear visitor,
        </h2>

        <div className="text-[17px] leading-[1.5] tracking-[-0.015em] text-[#424245] space-y-6 mb-12">
          <p>
            We started Sainto because we kept running into the same problem.
          </p>

          <p>
            You see something cool on TikTok. Maybe on Instagram. Maybe at 2am
            while doomscrolling. <br />
            <span className="block mt-3 text-[#1D1D1F] font-medium tracking-tight">
              You save it. You search for it. Nothing.
            </span>
          </p>

          <p>
            Either it doesn't exist in Ulaanbaatar, the shipping costs more than
            the item itself, or the website doesn't even deliver here. It's
            actually kind of insane how many good finds never make it here.
          </p>

          <p className="text-[#1D1D1F] font-medium tracking-tight text-[19px]">
            So we built Sainto.
          </p>

          <p>
            A place for all those pieces you keep seeing online but can never
            get your hands on. The niche finds. The underrated brands. The stuff
            your algorithm keeps feeding you.
          </p>

          <p className="text-[#1D1D1F] font-medium tracking-tight space-y-1">
            <span className="block">No more gatekeeping.</span>
            <span className="block">
              No more asking "where did you get that?"
            </span>
            <span className="block">
              No more spending three hours searching with zero aura results.
            </span>
          </p>

          <p>
            We are still figuring things out. The site will change. New things
            will come. Some things will break. Some things will get better. But
            the idea stays the same.
          </p>

          <p>
            Finding cool stuff shouldn't feel like a side quest.
            <br />
            Thanks for stopping by.
          </p>

          <p className="text-[#1D1D1F] font-semibold pt-4 text-[19px] tracking-tight">
            Stay niche with us.
          </p>
        </div>

        {/* Footer / Signature Area */}
        <div className="pt-8 border-t border-black/[0.04] flex flex-col gap-1 text-[13px] sm:text-[14px] text-[#86868B] tracking-tight">
          <p className="font-medium text-[#1D1D1F]">
            Bilegt Amartuvshin, Stanford '31
          </p>
          <p>
            Co-Founder & Developer at{" "}
            <a
              href="/"
              className="text-[#1D1D1F] underline decoration-black/20 underline-offset-4 hover:decoration-black/40 transition-colors"
            >
              Sainto
            </a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
