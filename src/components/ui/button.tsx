import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-ui font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none tap-target",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-[#1646b8]",
        accent: "bg-accentGreen text-white hover:bg-[#128038]",
        outline: "border border-border bg-white text-dark hover:bg-bg",
        ghost: "text-dark hover:bg-bg",
        premium: "bg-premium text-white hover:bg-[#6a2ec7]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
