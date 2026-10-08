import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "purple" | "indigo";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    outline: "border border-slate-300 dark:border-slate-700 text-foreground",
    success: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    indigo: "bg-indigo-600 text-white font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
