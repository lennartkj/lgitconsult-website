"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Children, isValidElement } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
  external?: boolean;
}

// Helper function to check if children contain Link components
const containsLinkComponent = (children: React.ReactNode): boolean => {
  let hasLink = false;

  Children.forEach(children, (child) => {
    if (!hasLink) {
      if (isValidElement(child)) {
        // Check if the child is a Link component from our UI library
        if (child.type && 
            ((typeof child.type === 'function' && child.type.name === 'Link') || 
             (typeof child.type === 'object' && child.type.displayName === 'Link'))) {
          hasLink = true;
        } else if (child.props && child.props.children) {
          // Recursively check children
          hasLink = containsLinkComponent(child.props.children);
        }
      }
    }
  });

  return hasLink;
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
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (external) {
              window.open(href, "_blank", "noopener,noreferrer");
            } else {
              window.location.href = href;
            }
          }}
          {...props}
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
      });
    }

    // Otherwise, render as motion.button
    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
