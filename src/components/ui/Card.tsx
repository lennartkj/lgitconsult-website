"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Children, isValidElement } from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const cardVariants = {
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
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

export function Card({
  className = "",
  children,
  href,
  external = false,
  onClick,
  hoverEffect = true,
  ...props
}: CardProps) {
  const baseStyles = "rounded-lg border border-fg/10 bg-bg p-6 shadow-sm";
  const hoverStyles = hoverEffect ? "hover:border-accent/50 hover:shadow-md transition-all duration-200" : "";
  const combinedClassName = `${baseStyles} ${hoverStyles} ${className}`;

  const content = (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );

  // Check if children contain Link components
  const hasLinkInChildren = containsLinkComponent(children);

  // If href is provided and there are no Link components in children, wrap with Link
  if (href && !hasLinkInChildren) {
    return (
      <Link
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="block"
      >
        <motion.div variants={cardVariants} whileHover="hover">
          {content}
        </motion.div>
      </Link>
    );
  }

  // If href is provided but there are Link components in children, use a div instead
  if (href && hasLinkInChildren) {
    return (
      <div className="block">
        <motion.div variants={cardVariants} whileHover="hover" onClick={() => window.location.href = href}>
          {content}
        </motion.div>
      </div>
    );
  }

  // If onClick is provided, make it interactive
  if (onClick) {
    return (
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        onClick={onClick}
        className="cursor-pointer"
      >
        {content}
      </motion.div>
    );
  }

  // Otherwise, render as a static card
  return <>{content}</>;
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-fg/70 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 flex items-center pt-4 border-t border-fg/10 ${className}`} {...props}>
      {children}
    </div>
  );
}
