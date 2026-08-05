"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl bg-lavender-50 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-xl px-4 py-1.5 text-sm font-medium transition-all",
            value === opt.value
              ? "bg-white text-lavender-600 shadow-sm"
              : "text-gray-500 hover:text-lavender-500",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
