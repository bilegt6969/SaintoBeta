"use client";

import { useEffect, useState } from "react";

export function BlackCardFooter() {
  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || "Sainto";
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="mt-3 aspect-square w-full space-y-2 sm:aspect-auto sm:w-auto">
      <p className="text-sm italic leading-snug text-neutral-800">
        Official Plug of Swaggers
      </p>
      <p className="text-xs leading-relaxed text-neutral-500">
        Sainto by bytecode
      </p>
      <div className="space-y-0.5 pt-1 text-[11px] leading-relaxed text-neutral-400">
        <p>
          © {year} {siteName} → Beta 0.0.1
        </p>
        <a
          href="https://vercel.com/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-neutral-600"
        ></a>
      </div>
    </div>
  );
}
