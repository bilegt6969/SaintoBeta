"use client";

import { useCookieConsent } from "components/cookie-consent";
import { cn } from "lib/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const COOKIE_KEY = "sainto-welcome-dismissed";
const BYTECODE_URL = "https://bytecode.solutions";

function hasDismissedWelcome(): boolean {
  return (
    document.cookie.includes(`${COOKIE_KEY}=1`) ||
    document.cookie.includes("welcome-toast=2")
  );
}

export function WelcomeCommerce() {
  const { ready: consentReady, consent } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!consentReady || consent === null) return;
    if (window.innerHeight < 650) return;
    if (!hasDismissedWelcome()) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [consent, consentReady]);

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [visible]);

  const dismiss = () => {
    setEntered(false);
    setVisible(false);
    document.cookie = `${COOKIE_KEY}=1; max-age=31536000; path=/`;
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="welcome-commerce-title"
      aria-describedby="welcome-commerce-desc"
      className={cn(
        "fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ease-out",
        entered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
      )}
    >
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2
              id="welcome-commerce-title"
              className="text-sm font-medium tracking-tight text-neutral-900"
            >
              Welcome to Sainto Commerce
            </h2>
            <p
              id="welcome-commerce-desc"
              className="mt-1.5 text-sm leading-relaxed text-neutral-500"
            >
              This is a high-performance, SSR storefront powered by{" "}
              <a
                href={BYTECODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
              >
                Bytecode Solutions
              </a>
              .{" "}
              <a
                href={BYTECODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 underline decoration-neutral-300 underline-offset-2 transition-colors hover:decoration-neutral-900"
              >
                Deploy your own
              </a>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss welcome message"
            className="shrink-0 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
