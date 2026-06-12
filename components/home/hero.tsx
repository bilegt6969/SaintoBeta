// components/hero.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Hero as HeroContent } from "lib/commerce/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Motion Physics & Variants ─────────────────────────────────────────────────

// The custom cubic-bezier from your navbar for perfect physical momentum
const smoothEase = [0.32, 0.72, 0, 1] as const;
const springPhysics = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.05, // Slight zoom out for cinematic depth
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      x: springPhysics,
      opacity: { duration: 0.6, ease: smoothEase },
      scale: { duration: 0.8, ease: smoothEase },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "20%" : "-20%", // Parallax exit effect instead of full slide
    opacity: 0,
    scale: 0.95,
    zIndex: 0,
    transition: {
      x: springPhysics,
      opacity: { duration: 0.6, ease: smoothEase },
      scale: { duration: 0.8, ease: smoothEase },
    },
  }),
};

const fadeVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: {
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: { duration: 0.8, ease: smoothEase },
  },
  exit: {
    opacity: 0,
    scale: 1,
    zIndex: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeroSlide {
  desktopImage?: { url: string; altText?: string; focalPoint?: string };
  mobileImage?: { url: string; altText?: string; focalPoint?: string };
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface HeroProps {
  hero: HeroContent & {
    slides?: HeroSlide[];
    carouselSettings?: {
      autoplay?: boolean;
      autoplaySpeed?: number;
      showNavigation?: boolean;
      showPagination?: boolean;
      transition?: "slide" | "fade";
    };
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Hero({ hero }: HeroProps) {
  if (!hero.enabled) return null;

  const slides: HeroSlide[] = hero.slides?.length
    ? hero.slides
    : [
        {
          desktopImage: {
            url: hero.desktopImage.url,
            altText: hero.desktopImage.altText,
          },
          mobileImage: {
            url: hero.mobileImage.url,
            altText: hero.mobileImage.altText,
          },
          title: hero.title,
          ctaText: (hero as any).ctaText,
          ctaUrl: (hero as any).ctaUrl,
        },
      ];

  if (!slides.length) return null;

  const {
    autoplay = true,
    autoplaySpeed = 6000, // Slightly longer default to appreciate the smooth transitions
    showNavigation = true,
    showPagination = true,
    transition = "slide",
  } = hero.carouselSettings || {};

  return (
    <HeroCarousel
      slides={slides}
      autoplay={autoplay}
      autoplaySpeed={autoplaySpeed}
      showNavigation={showNavigation}
      showPagination={showPagination}
      transition={transition}
      sectionTitle={hero.title}
    />
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────

interface CarouselProps {
  slides: HeroSlide[];
  autoplay: boolean;
  autoplaySpeed: number;
  showNavigation: boolean;
  showPagination: boolean;
  transition: "slide" | "fade";
  sectionTitle?: string;
}

function HeroCarousel({
  slides,
  autoplay,
  autoplaySpeed,
  showNavigation,
  showPagination,
  transition,
  sectionTitle,
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide],
  );

  useEffect(() => {
    if (autoplay && slides.length > 1 && !isHovered) {
      resetTimeout();
      timeoutRef.current = setTimeout(nextSlide, autoplaySpeed);
    }
    return () => resetTimeout();
  }, [
    currentSlide,
    isHovered,
    autoplay,
    autoplaySpeed,
    slides.length,
    nextSlide,
    resetTimeout,
  ]);

  const variants = transition === "fade" ? fadeVariants : slideVariants;

  return (
    <section
      className="mx-auto max-w-[1600px] animate-hero-fade px-4 pt-0 md:px-8 lg:px-10 lg:pt-1"
      aria-label={sectionTitle ?? "Hero Carousel"}
      role="region"
    >
      <div
        className="relative w-full overflow-hidden rounded-[2.5rem] bg-neutral-100 shadow-[0_16px_40px_-4px_rgba(0,0,0,0.02)] ring-2 ring-black/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <SlideContent
              slide={slides[currentSlide]!}
              isPriority={currentSlide === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Aspect ratio shells */}
        <div className="aspect-square w-full lg:hidden" />
        <div className="hidden aspect-[16/9] w-full lg:block" />

        {/* Bottom smooth gradient for text legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3/5 bg-gradient-to-t from-black/70 via-black/20 to-transparent ease-[cubic-bezier(0.32,0.72,0,1)]" />

        {/* Overlay content */}
        {(slides[currentSlide]!.ctaText || slides[currentSlide]!.subtitle) && (
          <SlideOverlay slide={slides[currentSlide]!} />
        )}

        {/* Navigation arrows */}
        {showNavigation && slides.length > 1 && (
          <div className="absolute inset-0 z-20 hidden items-center justify-between px-6 lg:flex pointer-events-none">
            <NavButton direction="prev" onClick={prevSlide} />
            <NavButton direction="next" onClick={nextSlide} />
          </div>
        )}

        {/* Pagination dots (High-end Glassmorphism) */}
        {showPagination && slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 gap-2.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-[24px] saturate-[1.25] lg:flex">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-sm ${
                  index === currentSlide
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Slide content ─────────────────────────────────────────────────────────────

function SlideContent({
  slide,
  isPriority,
}: {
  slide: HeroSlide;
  isPriority: boolean;
}) {
  const desktopSrc = slide.desktopImage?.url;
  const mobileSrc = slide.mobileImage?.url;

  if (!desktopSrc && !mobileSrc) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
        <p className="text-sm font-medium text-neutral-400">
          Image not available
        </p>
      </div>
    );
  }

  const resolvedMobileSrc = mobileSrc ?? desktopSrc!;
  const resolvedDesktopSrc = desktopSrc ?? mobileSrc!;
  const mobileAlt =
    slide.mobileImage?.altText ||
    slide.desktopImage?.altText ||
    slide.title ||
    "";
  const desktopAlt =
    slide.desktopImage?.altText ||
    slide.mobileImage?.altText ||
    slide.title ||
    "";

  return (
    <>
      <Image
        src={resolvedMobileSrc}
        alt={mobileAlt}
        fill
        priority={isPriority}
        sizes="100vw"
        className="object-cover lg:hidden"
        style={{ objectPosition: slide.mobileImage?.focalPoint ?? "center" }}
      />
      <Image
        src={resolvedDesktopSrc}
        alt={desktopAlt}
        fill
        priority={isPriority}
        sizes="100vw"
        className="hidden object-cover lg:block"
        style={{ objectPosition: slide.desktopImage?.focalPoint ?? "center" }}
      />
    </>
  );
}

// ── Slide overlay ─────────────────────────────────────────────────────────────

function SlideOverlay({ slide }: { slide: HeroSlide }) {
  const content = (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="max-w-2xl"
    >
      {slide.title && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-md">
          {slide.title}
        </p>
      )}
      {slide.subtitle && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white drop-shadow-lg lg:text-5xl lg:leading-[1.1]">
          {slide.subtitle}
        </h2>
      )}
      {slide.ctaText && (
        <span className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 hover:bg-neutral-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-95">
          {slide.ctaText}
        </span>
      )}
    </motion.div>
  );

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-14"
      aria-hidden="true"
    >
      {slide.ctaUrl ? (
        <Link
          href={slide.ctaUrl}
          aria-label={slide.ctaText ?? slide.title}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-2xl w-fit"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] backdrop-blur-[24px] saturate-[1.25] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 hover:bg-white/20 active:scale-95"
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev" ? (
          <path d="m15 18-6-6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </button>
  );
}
