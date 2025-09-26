import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        ghost: {},
        contained: {},
        outlined: "border border-transparent",
        text: "!px-1.5 !py-0",
      },
      color: {
        neutral: {},
        primary: {},
        secondary: {},
        contrast: {},
      },
      size: {
        default: "h-9 rounded-lg px-4 py-2 has-[>svg]:px-3",
        icon: "size-9 rounded-lg",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        color: "neutral",
        className: "hover:bg-[var(--ghost-neutral-bg-h)]",
      },
      {
        variant: "ghost",
        color: "contrast",
        className:
          "bg-[var(--ghost-contrast-bg)] text-[var(--ghost-contrast-foreground)] hover:bg-[var(--ghost-contrast-bg-h)]",
      },
      {
        variant: "outlined",
        color: "neutral",
        className: "border-[var(--border-outline)]",
      },
      {
        variant: "text",
        color: "neutral",
        className:
          "text-[var(--text-neutral)] hover:text-[var(--text-neutral-h)] active:text-[var(--text-neutral-active)] active:bg-[var(--ghost-neutral-bg-h)]",
      },
    ],
    defaultVariants: {
      variant: "ghost",
      color: "neutral",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  color,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, color, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

