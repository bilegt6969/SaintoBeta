import Link from "next/link";

export function RecentlyViewedBlackCard() {
  return (
    <article className="flex w-full flex-col">
      <div className="relative flex aspect-4/3 w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-black p-3 sm:p-4">
        <Link
          href="/"
          className="mb-4 inline-block"
          aria-label="Recently Viewed"
        >
          <span className="block truncate text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            Recently Viewed
          </span>
        </Link>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className="text-center text-sm text-neutral-400">
            Your browsing history
          </p>
        </div>
      </div>
    </article>
  );
}
