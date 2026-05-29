import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Sainto Commerce uses cookies on this website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Cookie Policy
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600">
        <p>
          Sainto Commerce uses cookies to keep the store working, remember your
          cart, and—if you accept—support analytics and personalization.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Essential cookies
          </strong>{" "}
          (for example, your shopping cart) are required for core functionality
          and are set when you use the site.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Optional cookies
          </strong>{" "}
          (analytics, ads, personalization) are only enabled when you click
          Accept on the cookie banner.
        </p>
        <p>
          If you choose Reject, we store your preference and do not enable
          optional tracking cookies.
        </p>
      </div>
      <Link
        href="/"
        className="mt-8 inline-block text-sm text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900"
      >
        Back to store
      </Link>
    </div>
  );
}
