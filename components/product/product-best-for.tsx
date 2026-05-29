import type { BestFor } from "lib/commerce";
import Image from "next/image";

function BestForItem({
  label,
  icon,
}: {
  label: string;
  icon?: { url: string; altText: string };
}) {
  return (
    <div className="group inline-flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-5 py-2 shadow-sm transition-all hover:border-neutral-300 hover:shadow hover:-translate-y-0.5">
      {icon?.url && (
        <div className="relative h-5 w-5 shrink-0">
          <Image
            src={icon.url}
            alt={icon.altText || label}
            fill
            className="object-contain transition-transform group-hover:scale-110"
            sizes="20px"
          />
        </div>
      )}
      <span className="whitespace-nowrap text-sm font-semibold text-neutral-800">
        {label}
      </span>
    </div>
  );
}

export function ProductBestFor({ bestFor }: { bestFor: BestFor }) {
  const { hairType, hairLength } = bestFor;

  if (!hairType && !hairLength) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {hairType && (
        <BestForItem label={hairType.label} icon={hairType.icon} />
      )}
      {hairLength && (
        <BestForItem label={hairLength.label} icon={hairLength.icon} />
      )}
    </div>
  );
}