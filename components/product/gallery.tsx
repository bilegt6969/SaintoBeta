// components/product/gallery.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GridTileImage } from "components/grid/tile";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const smoothEase = [0.32, 0.72, 0, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "15%" : "-15%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(12px)", // Cinematic blur on entry
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.5, ease: smoothEase },
      scale: { duration: 0.5, ease: smoothEase },
      filter: { duration: 0.4, ease: smoothEase },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "15%" : "-15%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(12px)", // Cinematic blur on exit
    transition: {
      x: { type: "spring" as const, stiffness: 260, damping: 28 },
      opacity: { duration: 0.4, ease: smoothEase },
      scale: { duration: 0.4, ease: smoothEase },
      filter: { duration: 0.3, ease: smoothEase },
    },
  }),
};

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [easterEggClicks, setEasterEggClicks] = useState(0); // 🥚 Easter Egg State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setDirection(index > imageIndex ? 1 : -1);
      const next = ((index % images.length) + images.length) % images.length;
      setImageIndex(next);
    },
    [imageIndex, images.length],
  );

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/5 hover:scale-110 active:scale-95";

  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div
        className="relative aspect-square w-full rounded-3xl bg-neutral-100"
        aria-hidden
      />
    );
  }

  // Easter Egg Trigger logic
  const handleImageClick = () => {
    setEasterEggClicks((prev) => prev + 1);
    // Reset clicks after a timeout to require rapid clicking
    setTimeout(() => setEasterEggClicks(0), 2000);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goTo(nextImageIndex);
    } else if (isRightSwipe) {
      goTo(previousImageIndex);
    }
  };

  return (
    <div className="w-full">
      <div
        className={clsx("flex gap-3", { "lg:flex-row lg:gap-5": hasMultiple })}
      >
        {/* Thumbnails Sidebar */}
        {hasMultiple ? (
          <ul className="hidden shrink-0 flex-col gap-3 lg:flex">
            {images.map((image, index) => {
              const isActive = index === imageIndex;
              return (
                <li key={`${image.src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "relative h-[72px] w-[72px] overflow-hidden rounded-md transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isActive
                        ? "ring-2 ring-neutral-900 ring-offset-2 scale-105"
                        : "hover:scale-105 opacity-70 hover:opacity-100",
                    )}
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={72}
                      height={72}
                      active={isActive}
                      isInteractive={false}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {/* Main Image Window */}
        <div className="min-w-0 flex-1">
          <motion.div
            className="relative aspect-square w-full overflow-hidden bg-neutral-50 rounded-[2.5rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] cursor-crosshair"
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            // 🥚 Easter Egg Animation: 5 rapid clicks triggers a playful 3D flip
            animate={{
              rotateY: easterEggClicks >= 5 ? 360 : 0,
              scale: easterEggClicks >= 5 ? 0.8 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onAnimationComplete={() => {
              if (easterEggClicks >= 5) setEasterEggClicks(0);
            }}
          >
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={imageIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  className="h-full w-full object-cover rounded-[2.5rem]"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  alt={images[imageIndex]!.altText}
                  src={images[imageIndex]!.src}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Island Navigation UI */}
            {hasMultiple ? (
              <>
                {/* Mobile Back Button - Only visible on mobile */}
                <Link
                  href="/"
                  className="lg:hidden absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25] transition-all hover:bg-white/80"
                >
                  <span className="text-base">←</span>
                  <span>Back</span>
                </Link>

                {/* Counter - Hidden on mobile when back button is shown */}
                <div className="hidden lg:block absolute left-5 top-5 z-10 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25]">
                  {imageIndex + 1} / {images.length}
                </div>

                {/* Arrows */}
                <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 rounded-full bg-white/70 p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(previousImageIndex);
                    }}
                    aria-label="Previous product image"
                    className={buttonClassName}
                  >
                    <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(nextImageIndex);
                    }}
                    aria-label="Next product image"
                    className={buttonClassName}
                  >
                    <ArrowRightIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>

          {/* Mobile Thumbnails */}
          {hasMultiple ? (
            <ul className="mt-4 flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide lg:hidden">
              {images.map((image, index) => {
                const isActive = index === imageIndex;
                return (
                  <li
                    key={`${image.src}-${index}`}
                    className="h-20 w-20 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className={clsx(
                        "relative h-full w-full overflow-hidden rounded-2xl transition-all duration-300",
                        isActive
                          ? "ring-2 ring-neutral-900 ring-offset-2"
                          : "opacity-60",
                      )}
                    >
                      <GridTileImage
                        alt={image.altText}
                        src={image.src}
                        width={80}
                        height={80}
                        active={isActive}
                        isInteractive={false}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
