"use client";

import React from "react";
import NextLink from "next/link";
import { motion, type Easing, type Variants } from "framer-motion";

// --- Typen ---
interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "underline" | "button" | "nav";
    external?: boolean;
    underlineAnimation?: boolean;
    onClick?: () => void;
}

// --- Konstanten ---

// Framer Motion Variants für die Unterstreichung
const underlineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
        width: "100%",
        transition: {
            duration: 0.2,
            ease: "easeInOut" as Easing, // Type Assertion zur Behebung des Framer Motion Fehlers
        },
    },
};

// SVG Icon für externe Links
const ExternalIcon = (
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

// --- Link Component ---

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

    // Basis-Stile für alle Varianten
    const baseStyles = "inline-flex items-center transition-colors";

    // Variant-spezifische Stile
    const variantStyles = {
        default: "text-accent hover:text-accent/80",
        underline: "text-fg hover:text-accent relative group", // Gruppe für Hover-Effekt
        button: "bg-accent text-accent-contrast hover:bg-accent/90 px-4 py-2 rounded-md font-medium",
        nav: "text-fg hover:text-accent font-medium",
    };

    // Externe Link-Attribute
    const externalProps = external ? {
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `${children} (opens in a new tab)`
    } : {};

    // Kombinierter Klassenname
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

    // Wenn es sich um einen externen Link handelt ODER wenn Animationen gewünscht sind,
    // verwenden wir ein einfaches <a>-Tag, andernfalls NextLink.
    // Da NextLink jetzt automatisch das <a>-Tag rendert, können wir es direkt verwenden.

    const isAnimatedUnderline = variant === "underline" && underlineAnimation;

    const linkContent = (
        <motion.span className="inline-flex items-center">
            {children}
            {isAnimatedUnderline && (
                // Fügt die animierte Unterstreichung hinzu
                <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-accent"
                    initial="hidden"
                    variants={underlineVariants}
                />
            )}
            {external && ExternalIcon}
        </motion.span>
    );

    // Wenn eine Unterstrich-Animation vorhanden ist, wird die motion-Logik an den NextLink delegiert.
    if (isAnimatedUnderline) {
        return (
            <NextLink
                href={href}
                className={combinedClassName}
                onClick={onClick}
                {...externalProps}
                {...props}
            >
                <motion.div
                    className="relative inline-flex items-center"
                    whileHover="visible"
                    initial="hidden"
                    variants={{ visible: {}, hidden: {} }} // Dummy variants für den Hover-Container
                >
                    {/* Das Link-Target, das die Animation auslöst */}
                    {linkContent}
                </motion.div>
            </NextLink>
        );
    }


    // Standardfall (keine Animation oder button/default variant)
    return (
        <NextLink
            href={href}
            className={combinedClassName}
            onClick={onClick}
            {...externalProps}
            {...props}
        >
            {children}
            {external && ExternalIcon}
        </NextLink>
    );
}
