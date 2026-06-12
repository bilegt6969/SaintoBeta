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
          ? "h-8 w-8 rounded-full text-neutral-800 hover:text-neutral-600"
          : "h-11 w-11 rounded-md border border-neutral-200 text-black dark:border-neutral-700 dark:text-white",
      )}
    >
      <svg
        viewBox="0 12 17 20"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4.5 w-4.5"
        fill="currentColor"
      >
        <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z" />
      </svg>

      {quantity ? (
        <div
          className={clsx(
            "absolute right-0 top-0 -mr-1 -mt-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-medium",
            variant === "island"
              ? "bg-white text-neutral-800"
              : "rounded-sm bg-blue-600 text-white",
          )}
        >
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
