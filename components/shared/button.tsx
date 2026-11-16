import { cn } from "@/src/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  const variants: Record<Variant, string> = {
    primary: "btn-primary",
    dark: "btn-dark",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };
  const sizes: Record<Size, string> = {
    sm: "px-4 py-2.5 text-xs",
    md: "",
    lg: "px-8 py-4 text-[15px]",
  };
  return cn(variants[variant], sizes[size], className);
}
