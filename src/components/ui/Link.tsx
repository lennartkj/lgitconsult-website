"use client";

import React from "react";
import NextLink from "next/link";
import { motion, type Variants, type Easing } from "framer-motion";
import { isValidElement } from "react";

// --- Helper Function (fixed and improved) ---
// This function checks for nested links more reliably.
const containsLinkComponent = (children: React.ReactNode): boolean => {
    return React.Children.toArray(children).some(child => {
        if (React.isValidElement(child)) {
            // Direct comparison is the most reliable way to check component type
            if (child.type === NextLink) {
                return true;
            }
            // Use the 'in' operator for a safe check on props
            if ('children' in child.props && child.props.children) {
                return containsLinkComponent(child.props.children);
            }
        }
        return false;
    });
};

// --- Link Component ---
interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "underline" | "button" | "nav";
    external?: boolean;
    underlineAnimation?: boolean;
    onClick?: () => void;
}

const underlineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
        width: "100%",
        transition: {
            duration: 0.2,
            ease: "easeInOut" as Easing, // Use a type assertion to satisfy Framer Motion's strict types
        },
    },
};

const externalIcon = (
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
);

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
    // Check for nested links to prevent an invalid HTML structure.
    if (containsLinkComponent(children)) {
        console.error("Link component cannot contain a nested Next.js <Link> or <a> tag. This is invalid HTML and can cause hydration errors.");
        return (
            <a href={href} className={className} {...props}>
                {children}
                {external && externalIcon}
            </a>
        );
    }

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

    return (
        <NextLink
            href={href}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            onClick={onClick}
            {...externalProps}
            {...props}
        >
            <motion.span
                className="relative"
                initial="hidden"
                whileHover="visible"
                variants={underlineAnimation ? underlineVariants : undefined}
            >
                {children}
                {variant === "underline" && underlineAnimation && (
                    <motion.span
                        className="absolute bottom-0 left-0 h-0.5 bg-accent"
                        variants={underlineVariants}
                    />
                )}
            </motion.span>
            {external && externalIcon}
        </NextLink>
    );
}