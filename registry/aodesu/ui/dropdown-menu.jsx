"use client";
import { cn } from "@/lib/utils";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDown, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
const dropdownMenuContentVariants = cva("z-50 min-w-[8rem] rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-popover-foreground shadow-md p-1 " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out " +
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", {
    variants: {
        size: {
            sm: "p-1 text-xs",
            md: "p-1 text-sm",
            lg: "p-2 text-base",
        },
    },
    defaultVariants: { size: "md" },
});
const dropdownMenuItemVariants = cva("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden " +
    "focus:bg-accent focus:text-accent-foreground " +
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
    variants: {
        variant: {
            default: "",
            destructive: "text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive",
        },
        inset: {
            true: "pl-8",
        },
        size: {
            sm: "py-1 text-xs",
            md: "py-1.5 text-sm",
            lg: "py-2 text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});
const dropdownMenuSubTriggerVariants = cva("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden " +
    "focus:bg-accent focus:text-accent-foreground " +
    "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", {
    variants: {
        inset: { true: "pl-8" },
        size: {
            sm: "py-1 text-xs",
            md: "py-1.5 text-sm",
            lg: "py-2 text-base",
        },
    },
    defaultVariants: { size: "md" },
});
function DropdownMenu(props) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props}/>;
}
function DropdownMenuTrigger(props) {
    return (<DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props}/>);
}
function DropdownMenuContent({ className, sideOffset = 4, size, ...props }) {
    return (<DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn(dropdownMenuContentVariants({ size }), className)} {...props}/>
    </DropdownMenuPrimitive.Portal>);
}
function DropdownMenuGroup(props) {
    return (<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props}/>);
}
function DropdownMenuItem({ className, variant, inset, size, ...props }) {
    return (<DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" className={cn(dropdownMenuItemVariants({ variant, inset, size }), className)} {...props}/>);
}
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return (<DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn(dropdownMenuItemVariants(), "pl-8", className)} checked={checked} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4"/>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>);
}
function DropdownMenuRadioGroup(props) {
    return (<DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props}/>);
}
function DropdownMenuRadioItem({ className, children, ...props }) {
    return (<DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn(dropdownMenuItemVariants({ inset: true }), className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current"/>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>);
}
function DropdownMenuLabel({ className, inset, ...props }) {
    return (<DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset} className={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", className)} {...props}/>);
}
function DropdownMenuSeparator({ className, ...props }) {
    return (<DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("bg-border -mx-1 my-1 h-px", className)} {...props}/>);
}
function DropdownMenuShortcut({ className, ...props }) {
    return (<span data-slot="dropdown-menu-shortcut" className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props}/>);
}
function DropdownMenuSub(props) {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props}/>;
}
function DropdownMenuSubTrigger({ className, inset, size, children, ...props }) {
    return (<DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn(dropdownMenuSubTriggerVariants({ inset, size }), className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4"/>
    </DropdownMenuPrimitive.SubTrigger>);
}
function DropdownMenuSubContent({ className, ...props }) {
    return (<DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn("z-50 min-w-[8rem] rounded-md border bg-[hsl(var(--background))] text-popover-foreground shadow-lg p-1 " +
            "data-[state=open]:animate-in data-[state=closed]:animate-out " +
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props}/>);
}
function DropdownButton({ label, children, menuGropClassName }) {
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {label}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup className={menuGropClassName ? menuGropClassName : ''}>
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>);
}
export { DropdownButton, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, dropdownMenuContentVariants, DropdownMenuGroup, DropdownMenuItem, dropdownMenuItemVariants, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, dropdownMenuSubTriggerVariants, DropdownMenuTrigger };
