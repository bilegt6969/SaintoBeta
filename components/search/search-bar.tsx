"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "lib/cn";
import { CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SearchBar({
  defaultValue = "",
  autoFocus,
  onSubmit,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  onSubmit: (query: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasTyped = value.trim().length > 0;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSubmit(q);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto group"
    >
      {/* Dynamic Background Glow on Focus */}
      <div
        className={cn(
          "absolute -inset-1 rounded-[2rem] bg-neutral-900/5 blur-xl transition-all duration-500",
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-95",
        )}
      />

      <div
        className={cn(
          "relative flex h-14 items-center overflow-hidden rounded-full bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 transition-all duration-500",
          isFocused
            ? "shadow-[0_8px_40px_rgb(0,0,0,0.08)] ring-black/10"
            : "hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:ring-black/10",
        )}
      >
        {/* Animated Leading Icon */}
        <div className="absolute left-5 flex items-center justify-center pointer-events-none z-10 text-neutral-400">
          <Search
            className={cn(
              "h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isFocused
                ? "text-neutral-900 scale-110"
                : "text-neutral-400 scale-100",
            )}
            strokeWidth={2}
          />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products, brands, categories..."
          autoComplete="off"
          enterKeyHint="search"
          className="h-full w-full bg-transparent pl-14 pr-24 text-[16px] text-neutral-900 outline-none placeholder:text-neutral-400 placeholder:transition-opacity focus:placeholder:opacity-50 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />

        {/* Trailing Actions */}
        <div className="absolute right-2 flex items-center gap-1.5">
          <AnimatePresence>
            {hasTyped && (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={handleClear}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            aria-label="Submit Search"
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
              hasTyped
                ? "bg-neutral-900 text-white shadow-md hover:bg-neutral-800"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed",
            )}
            disabled={!hasTyped}
          >
            <CornerDownLeft className="h-4 w-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </form>
  );
}
