import Image from "next/image";
import { cn } from "lib/cn";

export interface HeroImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Hero {
  title: string;
  desktopImage: HeroImage;
  mobileImage: HeroImage;
  enabled: boolean;
}

export function Hero({ hero }: { hero: Hero }) {
  if (!hero.enabled) return null;

  return (
    <section className="w-full">
      <div className="relative w-full">
        {/* Mobile Image - vertical (1080x1920) */}
        <div className="lg:hidden relative w-full aspect-[9/16]">
          {hero.mobileImage?.url && (
            <Image
              src={hero.mobileImage.url}
              alt={hero.mobileImage.altText || hero.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          )}
        </div>

        {/* Desktop Image - horizontal (1920x1080) */}
        <div className="hidden lg:block relative w-full aspect-[16/9]">
          {hero.desktopImage?.url && (
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
