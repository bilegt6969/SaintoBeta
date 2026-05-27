import { cn } from "lib/cn";
import type { ReactNode } from "react";

export default function Wrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("relative w-full", className)}>{children}</div>;
}
