import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

// Mapa de colores dinámicos para input
const inputVariantColorMap = {
  outlined: {
    neutral:
      "border-[hsl(var(--border))] focus-visible:border-[hsl(var(--neutral))]",
    primary:
      "border-[hsl(var(--primary)/.4)] focus-visible:border-[hsl(var(--primary))] focus-visible:ring-[hsl(var(--primary-light))]",
    secondary:
      "border-[hsl(var(--secondary)/.4)] focus-visible:border-[hsl(var(--secondary))] focus-visible:ring-[hsl(var(--secondary-light))]",
    contrast:
      "border-[hsl(var(--contrast)/.4)] focus-visible:border-[hsl(var(--contrast-light))]",
  },
  filled: {
    neutral:
      "bg-[hsl(var(--neutral-dark))] border-b-2 border-[hsl(var(--neutral))] focus-visible:bg-[hsl(var(--neutral))]",
    primary:
      "bg-[hsl(var(--primary-dark)/.1)] border-b-2 border-[hsl(var(--primary))] focus-visible:bg-[hsl(var(--primary-dark)/.2)]",
    secondary:
      "bg-[hsl(var(--secondary-dark)/.1)] border-b-2 border-[hsl(var(--secondary))] focus-visible:bg-[hsl(var(--secondary-dark)/.2)]",
    contrast:
      "bg-[hsl(var(--contrast-dark)/.1)] border-b-2 border-[hsl(var(--contrast))] focus-visible:bg-[hsl(var(--contrast-dark)/.2)]",
  },
  standard: {
    neutral:
      "border-b-2 border-[hsl(var(--neutral))] focus-visible:border-[hsl(var(--neutral-light))]",
    primary:
      "border-b-2 border-[hsl(var(--primary))] focus-visible:border-[hsl(var(--primary-light))]",
    secondary:
      "border-b-2 border-[hsl(var(--secondary))] focus-visible:border-[hsl(var(--secondary-light))]",
    contrast:
      "border-b-2 border-[hsl(var(--contrast))] focus-visible:border-[hsl(var(--contrast-light))]",
  },
} as const;

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 bg-transparent text-base outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        outlined: "border rounded-md shadow-xs dark:bg-input/30 px-3",
        filled: "border-0 rounded-t-md border-b-2 px-3",
        standard: "border-0 border-b-2 rounded-none px-0",
      },
      color: {
        neutral: "",
        primary: "",
        secondary: "",
        contrast: "",
      },
      inputSize: {
        small: "h-7 text-sm",
        medium: "h-9 text-base",
        big: "h-11 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      hasStartAdornment: {
        true: "",
        false: "",
      },
      hasEndAdornment: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Adornos para outlined
      { variant: "outlined", hasStartAdornment: true, class: "pl-8" },
      { variant: "outlined", hasEndAdornment: true, class: "pr-8" },

      // Adornos para filled
      { variant: "filled", hasStartAdornment: true, class: "pl-8" },
      { variant: "filled", hasEndAdornment: true, class: "pr-8" },

      // Adornos para standard
      { variant: "standard", hasStartAdornment: true, class: "pl-8" },
      { variant: "standard", hasEndAdornment: true, class: "pr-8" },
    ],
    defaultVariants: {
      variant: "outlined",
      color: "neutral",
      inputSize: "medium",
      fullWidth: true,
      hasStartAdornment: false,
      hasEndAdornment: false,
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "color" | "size">,
    VariantProps<typeof inputVariants> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      color,
      inputSize,
      fullWidth,
      startAdornment,
      endAdornment,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasStartAdornment = !!startAdornment;
    const hasEndAdornment = !!endAdornment;

    const variantClass =
      (variant && color && inputVariantColorMap[variant]?.[color]) ||
      inputVariantColorMap.outlined.neutral;

    return (
      <div className={cn("relative inline-flex", fullWidth && "w-full")}>
        {startAdornment && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {startAdornment}
          </div>
        )}

        <input
          type={type}
          data-slot="input"
          className={cn(
            inputVariants({
              variant,
              color,
              inputSize,
              fullWidth,
              hasStartAdornment,
              hasEndAdornment,
            }),
            variantClass,
            "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />

        {endAdornment && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };

