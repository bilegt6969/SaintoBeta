"use client";

export function FooterNewsletter() {
  return (
    <div className="w-full max-w-[19rem] lg:max-w-[22rem]">
      <p className="text-xs text-neutral-500">AI moves fast.</p>
      <p className="mt-0.5 text-sm font-semibold text-neutral-900 md:text-base">
        Stay ahead with Sainto.
      </p>
      <form
        className="mt-3 flex items-center gap-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-neutral-200/80"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          name="email"
          placeholder="Enter email address"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none md:text-[13px]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 md:text-[13px]"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
