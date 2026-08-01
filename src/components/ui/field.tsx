import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      <label className="mb-1.5 block font-ui text-sm font-medium text-dark">{label}</label>
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-2xl border border-border bg-white px-4 font-ui text-sm text-dark outline-none transition-colors focus:border-primary",
          error && "border-hard",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 font-ui text-xs text-hard">{error}</p>}
    </div>
  )
);
Field.displayName = "Field";
