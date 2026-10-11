"use client";

import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-accent-gradient text-white shadow-soft hover:shadow-glass",
    secondary:
      "bg-white/70 text-lavender-600 border border-lavender-200 hover:bg-white",
    ghost: "bg-transparent text-lavender-600 hover:bg-lavender-50",
    danger: "bg-blush-500 text-white hover:bg-blush-400",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-2xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
