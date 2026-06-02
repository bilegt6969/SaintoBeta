import type { Hero as HeroContent } from "lib/commerce/types";
import Image from "next/image";

export function Hero({ hero }: { hero: HeroContent }) {
  if (!hero.enabled) return null;

  const hasDesktop = Boolean(hero.desktopImage?.url);
  const hasMobile = Boolean(hero.mobileImage?.url);

  if (!hasDesktop && !hasMobile) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-6 md:px-8 lg:px-10 lg:pt-10">
      <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-100">
        {/* Mobile: vertical 1080x1920 */}
        <div className="relative aspect-[9/16] w-full lg:hidden">
          {hasMobile && (
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
