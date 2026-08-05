import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-white/60 bg-white/60 backdrop-blur-glass shadow-soft p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
