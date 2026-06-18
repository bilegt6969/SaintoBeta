// components/product/gallery.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GridTileImage } from "components/grid/tile";
import { AnimatePresence, motion } from "framer-motion";
import { ImageGeneration } from "img-fx";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const snapEase = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "10%" : "-10%",
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as const, stiffness: 400, damping: 35 },
      opacity: { duration: 0.25, ease: snapEase },
      scale: { duration: 0.25, ease: snapEase },
      filter: { duration: 0.2, ease: snapEase },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "10%" : "-10%",
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
    transition: {
      x: { type: "spring" as const, stiffness: 400, damping: 35 },
      opacity: { duration: 0.2, ease: snapEase },
      scale: { duration: 0.2, ease: snapEase },
      filter: { duration: 0.15, ease: snapEase },
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
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // ⚡ Default to true so the very first load gets the WebGL wow factor
  const [needsEffect, setNeedsEffect] = useState(true);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;

      const next = ((index % images.length) + images.length) % images.length;

      // 🧠 CACHE DETECTION: Check if the browser already has this image ready
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = images[next]!.src;

        // If img.complete is true, it's instant. Turn OFF the canvas effect.
        // If it's false, it's hitting the network. Turn ON the canvas effect.
        setNeedsEffect(!img.complete);
      }

      setDirection(index > imageIndex ? 1 : -1);
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

  const handleImageClick = () => {
    setEasterEggClicks((prev) => prev + 1);
    setTimeout(() => setEasterEggClicks(0), 2000);
  };

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
    if (distance > 50) goTo(nextImageIndex);
    else if (distance < -50) goTo(previousImageIndex);
  };

  return (
    <div className="w-full">
      {/* Background Preloaders */}
      {hasMultiple && (
        <div className="hidden" aria-hidden="true">
          <Image
            src={images[nextImageIndex]!.src}
            alt="preload-next"
            width={100}
            height={100}
            priority={true}
            fetchPriority="high"
          />
          <Image
            src={images[previousImageIndex]!.src}
            alt="preload-prev"
            width={100}
            height={100}
            priority={true}
            fetchPriority="high"
          />
        </div>
      )}

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
                        ? "ring-2 ring-neutral-500 ring-offset-4 scale-105"
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
                {/* ⚡ LOGIC SPLIT based on cache detection */}
                {needsEffect ? (
                  <ImageGeneration
                    preset="pixels-organic"
                    images={[images[imageIndex]!.src]}
                    autoReveal
                    className="h-full w-full"
                  >
                    <div
                      className="h-full w-full rounded-[2.5rem]"
                      aria-label={images[imageIndex]!.altText}
                      role="img"
                    />
                  </ImageGeneration>
                ) : (
                  <Image
                    className="h-full w-full object-cover rounded-[2.5rem]"
                    fill
                    sizes="(min-width: 1024px) 45vw, (min-width: 640px) 80vw, 100vw"
                    alt={images[imageIndex]!.altText}
                    src={images[imageIndex]!.src}
                    priority
                    quality={90}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Island Navigation UI */}
            {hasMultiple ? (
              <>
                <Link
                  href="/"
                  className="lg:hidden absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25] transition-all hover:bg-white/80"
                >
                  <span className="text-base">←</span>
                  <span>Back</span>
                </Link>

                <div className="hidden lg:block absolute left-5 top-5 z-10 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25]">
                  {imageIndex + 1} / {images.length}
                </div>

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
