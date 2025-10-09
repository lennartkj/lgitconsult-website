"use client";

import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Children, isValidElement } from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "underline" | "button" | "nav";
  external?: boolean;
  underlineAnimation?: boolean;
  onClick?: () => void;
}

const underlineVariants = {
  hidden: { width: 0 },
  visible: { 
    width: "100%",
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

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

export function Link({
  href,
  children,
  className = "",
  variant = "default",
  external = false,
  underlineAnimation = true,
  onClick,
  ...props
}: LinkProps) {
  // Base styles for all variants
  const baseStyles = "inline-flex items-center transition-colors";

  // Variant-specific styles
  const variantStyles = {
    default: "text-accent hover:text-accent/80",
    underline: "text-fg hover:text-accent relative",
    button: "bg-accent text-accent-contrast hover:bg-accent/90 px-4 py-2 rounded-md font-medium",
    nav: "text-fg hover:text-accent font-medium",
  };

  // External link attributes
  const externalProps = external ? { 
    target: "_blank", 
    rel: "noopener noreferrer",
    "aria-label": `${children} (opens in a new tab)`
  } : {};

  // Combined className
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // Check if children contain Link components
  const hasLinkInChildren = containsLinkComponent(children);

  // If children contain Link components, render as a span to avoid nested <a> tags
  if (hasLinkInChildren) {
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    };

    return (
      <span 
        className={combinedClassName} 
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
        {external && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="ml-1 h-3 w-3"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" 
            />
          </svg>
        )}
      </span>
    );
  }

  // For underline variant with animation
  if (variant === "underline" && underlineAnimation) {
    return (
      <NextLink href={href} {...externalProps} onClick={onClick} className={combinedClassName} {...props}>
        {children}
        <motion.span 
          className="absolute bottom-0 left-0 h-0.5 bg-accent"
          initial="hidden"
          whileHover="visible"
          variants={underlineVariants}
        />
      </NextLink>
    );
  }

  // For all other variants
  return (
    <NextLink href={href} {...externalProps} onClick={onClick} className={combinedClassName} {...props}>
      {children}
      {external && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="ml-1 h-3 w-3"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" 
          />
        </svg>
      )}
    </NextLink>
  );
}
