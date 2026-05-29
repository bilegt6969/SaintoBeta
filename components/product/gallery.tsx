"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GridTileImage } from "components/grid/tile";
import Image from "next/image";
import { useCallback, useState } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const next = ((index % images.length) + images.length) % images.length;
      setImageIndex(next);
    },
    [images.length],
  );

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900";

  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div
        className="relative aspect-square w-full bg-neutral-100"
        aria-hidden
      />
    );
  }

  return (
    <div className="w-full">
      <div
        className={clsx("flex gap-3", {
          "lg:flex-row lg:gap-4": hasMultiple,
        })}
      >
        {hasMultiple ? (
          <ul className="hidden shrink-0 flex-col gap-2 lg:flex">
            {images.map((image, index) => {
              const isActive = index === imageIndex;

              return (
                <li key={`${image.src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-current={isActive ? "true" : undefined}
                    className="h-[72px] w-[72px]"
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

        <div className="min-w-0 flex-1">
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 rounded-3xl">
            {images.map((image, index) => (
              <Image
                key={`${image.src}-${index}`}
                className={clsx(
                  "absolute inset-0 h-full rounded-3xl w-full object-cover transition-opacity duration-150",
                  index === imageIndex ? "opacity-100" : "opacity-0",
                )}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt={image.altText}
                src={image.src}
                priority={index === 0}
              />
            ))}

            {hasMultiple ? (
              <>
                <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium tabular-nums text-neutral-600 shadow-sm ring-1 ring-neutral-200/80 backdrop-blur-sm">
                  {imageIndex + 1} / {images.length}
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-neutral-200/80 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => goTo(previousImageIndex)}
                    aria-label="Previous product image"
                    className={buttonClassName}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(nextImageIndex)}
                    aria-label="Next product image"
                    className={buttonClassName}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : null}
          </div>

          {hasMultiple ? (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {images.map((image, index) => {
                const isActive = index === imageIndex;

                return (
                  <li
                    key={`${image.src}-${index}`}
                    className="h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]"
                  >
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`View image ${index + 1} of ${images.length}`}
                      aria-current={isActive ? "true" : undefined}
                      className="h-full w-full"
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
        </div>
      </div>
    </div>
  );
}
