import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-lavender-200 bg-white/80 px-4 py-2.5 text-sm text-gray-700",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender-300 transition",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
