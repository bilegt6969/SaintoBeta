"use client";

import Image from "next/image";
import Link from "next/link";

export function HomeGridBlackCard({ description }: { description?: string }) {
  return (
    <article className="flex w-full flex-col">
      <div className="relative flex aspect-4/3 w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-black p-3 sm:p-4">
        <Link
          href="/"
          className="mb-4 inline-block"
          aria-label="All Categories"
        >
          <Image
            src="/selections.svg"
            alt="All Categories"
            width={800}
            height={200}
            className="h-8 w-auto max-w-[9rem] object-contain brightness-0 invert object-left sm:h-9 sm:max-w-[9rem] sm:mb-3 md:h-12 md:max-w-[16.5rem] md:mb-4 lg:h-[3.375rem] lg:max-w-[19.5rem]"
            priority
            unoptimized
          />
        </Link>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <p className="mb-2 text-center text-sm text-neutral-400 font-serif"></p>
          {description && (
            <p className="text-center text-xs text-neutral-500 font-serif">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
