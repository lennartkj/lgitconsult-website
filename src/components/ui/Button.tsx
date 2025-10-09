"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
  external?: boolean;
}

// Type guard to check if a React element has a children prop
const hasChildren = (
    element: React.ReactElement
): element is React.ReactElement<{ children: React.ReactNode }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (element.props as any).children !== undefined;
};

// Helper function to check if children contain Link components
const containsLinkComponent = (children: React.ReactNode): boolean => {
  return React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      if (child.type === Link) {
        return true;
      }
      if (hasChildren(child)) {
        return containsLinkComponent(child.props.children);
      }
    }
    return false;
  });
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
          className = "",
          variant = "primary",
          size = "md",
          asChild = false,
          href,
          external = false,
          children,
          ...props
        },
        ref
    ) => {
      // Base styles
      const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

      // Variant styles
      const variantStyles = {
        primary: "bg-accent text-accent-contrast hover:bg-accent/90",
        secondary: "bg-muted text-fg hover:bg-muted/80",
        outline: "border border-fg/20 hover:bg-muted",
        ghost: "hover:bg-muted",
      };

      // Size styles
      const sizeStyles = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-6 py-3 text-lg",
      };

      const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

      // Check if children contain Link components
      const hasLinkInChildren = containsLinkComponent(children);

      // Motion props to separate from HTML button props
      const motionProps = {
        whileTap: { scale: 0.98 }
      };

      // If href is provided and there are no Link components in children, render as Link
      if (href && !hasLinkInChildren) {
        return (
            <Link
                href={href}
                className={combinedClassName}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {children}
            </Link>
        );
      }

      // If href is provided but there are Link components in children, use a button with onClick
      if (href && hasLinkInChildren) {
        return (
            <motion.button
                ref={ref}
                className={combinedClassName}
                {...motionProps}
                onClick={() => {
                  if (external) {
                    window.open(href, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.href = href;
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(props as any)}
            >
              {children}
            </motion.button>
        );
      }

      // If asChild is true, clone the child and pass the props
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
          className: combinedClassName,
          ...props,
        } as React.HTMLAttributes<HTMLElement> & React.ClassAttributes<HTMLElement>);
      }

      // Otherwise, render as motion.button
      return (
          <motion.button
              ref={ref}
              className={combinedClassName}
              {...motionProps}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...(props as any)}
          >
            {children}
          </motion.button>
      );
    }
);

Button.displayName = "Button";

export { Button };