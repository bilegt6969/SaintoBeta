// components/grid/tile.tsx
import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        // Changed rounded-md to rounded-3xl and removed the static bg/hover states here
        "group flex h-full w-full items-center justify-center overflow-hidden rounded",
        {
          relative: label,
          "border-neutral-100 bg-neutral-200/40": active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full rounded w-full object-contain", {
            "p-6 pb-16": label,
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          quality={90}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
