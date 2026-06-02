import type { Hero as HeroContent } from "lib/commerce/types";
import Image from "next/image";
import { cn } from "lib/cn";
 
export interface HeroImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}
export function Hero({ hero }: { hero: HeroContent }) {
  if (!hero.enabled) return null;
 
export interface Hero {
  title: string;
  desktopImage: HeroImage;
  mobileImage: HeroImage;
  enabled: boolean;
}
  const hasDesktop = Boolean(hero.desktopImage?.url);
  const hasMobile = Boolean(hero.mobileImage?.url);
 
export function Hero({ hero }: { hero: Hero }) {
  if (!hero.enabled) return null;
  if (!hasDesktop && !hasMobile) return null;
 
  return (
    <section className="w-full">
      <div className="relative w-full">
        {/* Mobile Image - vertical (1080x1920) */}
        <div className="lg:hidden relative w-full aspect-[9/16]">
          {hero.mobileImage?.url && (
    <section className="mx-auto max-w-[1600px] px-4 pt-6 md:px-8 lg:px-10 lg:pt-10">
      <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-100">
        {/* Mobile: vertical 1080x1920 */}
        <div className="relative aspect-[9/16] w-full lg:hidden">
          {hasMobile && (
            <Image
              src={hero.mobileImage.url}
              alt={hero.mobileImage.altText || hero.title}
          )}
        </div>
 
        {/* Desktop Image - horizontal (1920x1080) */}
        <div className="hidden lg:block relative w-full aspect-[16/9]">
          {hero.desktopImage?.url && (
        {/* Desktop / tablet: horizontal 1920x1080 */}
        <div className="relative hidden aspect-[16/9] w-full lg:block">
          {hasDesktop && (
            <Image
              src={hero.desktopImage.url}
              alt={hero.desktopImage.altText || hero.title}
              fill
              sizes="(min-width: 1024px) 100vw"
              priority
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}

