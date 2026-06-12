"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/commerce";
import { useRouter, useSearchParams } from "next/navigation";

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1)
  ) {
    return null;
  }

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-3">
          <dt className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            {option.name}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const isActive = searchParams.get(optionNameLowerCase) === value;
              const isAvailable = true;

              return (
                <button
                  key={value}
                  onClick={() => updateOption(optionNameLowerCase, value)}
                  disabled={!isAvailable}
                  className={clsx(
                    "flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                    {
                      "bg-neutral-900 text-white shadow-sm": isActive,
                      "bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-white":
                        !isActive && isAvailable,
                      "cursor-not-allowed text-neutral-300 line-through":
                        !isAvailable,
                    },
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </div>
      ))}
    </div>
  );
}
