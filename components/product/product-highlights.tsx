import type { ProductHighlight } from "lib/commerce";
import Image from "next/image";

export function ProductHighlights({
  highlights,
}: {
  highlights: ProductHighlight[];
}) {
  if (!highlights.length) return null;

  return (
    <ul className="space-y-3">
      {highlights.map((highlight) => (
        <li key={highlight.text} className="flex items-start gap-3">
          {highlight.icon?.url ? (
            <span className="relative mt-0.5 h-5 w-5 shrink-0">
              <Image
                src={highlight.icon.url}
                alt=""
                fill
                className="object-contain"
                sizes="20px"
              />
            </span>
          ) : (
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400"
              aria-hidden
            />
          )}
          <span className="text-sm leading-relaxed text-neutral-700">
            {highlight.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
