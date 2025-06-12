"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative h-5 w-5 shrink-0 rounded-md border-2",
      "transition-all duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600",
      "data-[state=unchecked]:border-gray-300 data-[state=unchecked]:hover:border-violet-400",
      "dark:border-gray-700 dark:focus-visible:ring-violet-400",
      "dark:data-[state=checked]:bg-violet-500 dark:data-[state=checked]:border-violet-500",
      "dark:data-[state=unchecked]:hover:border-violet-400",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Check className="h-4 w-4 text-white" />
      </motion.div>
    </CheckboxPrimitive.Indicator>

    {/* Hover effect overlay */}
    <motion.div
      className={cn(
        "absolute inset-0 rounded-md",
        "bg-violet-100 opacity-0",
        "peer-hover:opacity-10 peer-data-[state=checked]:opacity-0",
        "transition-opacity duration-200",
        "dark:bg-violet-900",
      )}
    />

    {/* Focus ring animation */}
    <motion.div
      className={cn(
        "absolute inset-0 rounded-md",
        "ring-2 ring-violet-500 ring-offset-2",
        "opacity-0 scale-95",
        "peer-focus-visible:opacity-100 peer-focus-visible:scale-100",
        "transition-all duration-200",
      )}
    />
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
