import { cn } from "@/lib/utils";

export function Badge({
  children,
  color = "#A98AFA",
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white", className)}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}
