"use client";

import React from "react";
import Link from "next/link";
import { motion, type Easing } from "framer-motion";
import { isValidElement } from "react";

// --- Helper Function ---
// Use a type guard for safer access
const hasChildren = (
    element: React.ReactElement
): element is React.ReactElement<{ children: React.ReactNode }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (element.props as any).children !== undefined;
};

// Check if children contain a Link component for accessibility and semantic reasons
const containsLinkComponent = (children: React.ReactNode): boolean => {
    return React.Children.toArray(children).some(child => {
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

// --- Core Presentational Card Component ---
interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
    const baseStyles = "rounded-lg border border-fg/10 bg-bg p-6 shadow-sm";
    const combinedClassName = `${baseStyles} ${className}`;

    // This component now only handles the visual wrapper
    return (
        <div className={combinedClassName}>
            {children}
        </div>
    );
}

// --- Interactive Wrapper Component ---
interface CardLinkProps {
    className?: string;
    children: React.ReactNode;
    href?: string;
    external?: boolean;
    onClick?: () => void;
    hoverEffect?: boolean;
}

export function CardLink({
                             className = "",
                             children,
                             href,
                             external = false,
                             onClick,
                             hoverEffect = true,
                         }: CardLinkProps) {
    const cardVariants = {
        hover: {
            y: -5,
            transition: {
                duration: 0.2,
                ease: "easeOut" as Easing, // Explicitly cast the string literal as Easing
            },
        },
    };

    const hoverStyles = hoverEffect ? "hover:border-accent/50 hover:shadow-md transition-all duration-200" : "";
    const combinedClassName = `${className} ${hoverStyles}`;
    const isInternalLink = href && !external;

    const content = (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={combinedClassName}
        >
            <Card>{children}</Card>
        </motion.div>
    );

    // Use a simple conditional chain for better readability
    if (isInternalLink) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {content}
            </a>
        );
    }

    if (onClick) {
        return (
            <div onClick={onClick} className="block cursor-pointer">
                {content}
            </div>
        );
    }

    return <Card>{children}</Card>;
}

// --- Sub-components (fixed and cleaned up) ---
export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={`text-xl font-semibold ${className}`} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    // Corrected the closing tag
    return (
        <p className={`text-sm text-fg/70 ${className}`} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`mt-4 flex items-center pt-4 border-t border-fg/10 ${className}`} {...props}>
            {children}
        </div>
    );
}