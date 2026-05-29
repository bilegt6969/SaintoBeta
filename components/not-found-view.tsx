import Link from "next/link";

export function NotFoundView() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-neutral-50 px-8 py-12 text-center sm:max-w-lg sm:px-10 sm:py-14">
        <p
          className="text-[5.5rem] font-semibold leading-none tracking-tighter text-neutral-200 sm:text-[6.5rem]"
          aria-hidden
        >
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          This page may have moved, or the link could be wrong. Head back to the
          store to keep browsing.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Back to home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800"
          >
            Browse products
          </Link>
        </div>
        <p className="mt-8 text-xs text-neutral-400">
          Need help?{" "}
          <Link
            href="/"
            className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
          >
            Return to Sainto
          </Link>
        </p>
      </div>
    </div>
  );
}
