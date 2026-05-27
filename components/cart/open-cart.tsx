import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
  variant = "default",
}: {
  className?: string;
  quantity?: number;
  variant?: "default" | "island";
}) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center transition-colors",
        variant === "island"
          ? "h-9 w-9 rounded-full text-neutral-800 hover:text-neutral-600"
          : "h-11 w-11 rounded-md border border-neutral-200 text-black dark:border-neutral-700 dark:text-white",
      )}
    >
      <ShoppingCartIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div
          className={clsx(
            "absolute right-0 top-0 -mr-2 -mt-2 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-medium",
            variant === "island"
              ? "bg-neutral-900 text-white"
              : "rounded-sm bg-blue-600 text-white",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
