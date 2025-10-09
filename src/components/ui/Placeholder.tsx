import React, { useMemo } from "react";

// Define pattern types
type PatternType = 'diagonal' | 'dots' | 'waves' | 'grid' | 'triangles' | 'circles' | 'zigzag' | 'honeycomb';

interface PlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  pattern?: PatternType | 'random';
  randomColors?: boolean; // Enable random colors
  seed?: number; // For consistent randomization
}

export function Placeholder({
  width = 800,
  height = 600,
  text = "Placeholder Image",
  bgColor = "#f0f0f0",
  textColor = "#333333",
  className = "",
  pattern = 'random',
  randomColors = false,
  seed,
}: PlaceholderProps) {
  // Generate a unique ID for this placeholder to avoid pattern ID conflicts
  const uniqueId = useMemo(() => Math.random().toString(36).substring(2, 11), []);

  // Generate random colors if randomColors is true
  const randomBgColor = useMemo(() => {
    if (!randomColors) return bgColor;

    // Generate a random pastel color for background
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
    const lightness = 75 + Math.floor(Math.random() * 15); // 75-90%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, [randomColors, bgColor, seed]);

  const randomTextColor = useMemo(() => {
    if (!randomColors) return textColor;

    // Generate a contrasting color for text
    // Extract hue from randomBgColor if it's HSL
    const hslMatch = randomBgColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    let hue = 0;

    if (hslMatch) {
      hue = (parseInt(hslMatch[1]) + 180) % 360; // Opposite hue
    } else {
      hue = Math.floor(Math.random() * 360);
    }

    return `hsl(${hue}, 80%, 30%)`; // Dark, saturated color for contrast
  }, [randomColors, textColor, randomBgColor, seed]);

  // Determine the pattern to use
  const selectedPattern = useMemo(() => {
    const patternOptions: PatternType[] = [
      'diagonal', 'dots', 'waves', 'grid', 'triangles', 'circles', 'zigzag', 'honeycomb'
    ];

    if (pattern === 'random') {
      // Use the seed if provided, otherwise use a random index
      const randomIndex = seed !== undefined 
        ? Math.abs(Math.sin(seed) * patternOptions.length) | 0
        : Math.floor(Math.random() * patternOptions.length);
      return patternOptions[randomIndex];
    }

    return pattern as PatternType;
  }, [pattern, seed]);

  // Generate a secondary color for some patterns
  const secondaryColor = useMemo(() => {
    const hue = randomTextColor.startsWith('#') 
      ? parseInt(randomTextColor.substring(1, 3), 16) + 120
      : Math.random() * 360;
    return `hsl(${hue % 360}, 70%, 50%)`;
  }, [randomTextColor]);

  // Define pattern elements
  const patternElements = useMemo(() => {
    const patternId = `pattern-${selectedPattern}-${uniqueId}`;

    switch (selectedPattern) {
      case 'diagonal':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke={randomTextColor}
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />
          </pattern>
        );

      case 'dots':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
          >
            <circle
              cx="10"
              cy="10"
              r="2"
              fill={randomTextColor}
              fillOpacity="0.3"
            />
          </pattern>
        );

      case 'waves':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="40"
            height="20"
          >
            <path
              d="M 0 10 Q 10 5, 20 10 Q 30 15, 40 10"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
          </pattern>
        );

      case 'grid':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>
        );

      case 'triangles':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="30"
            height="30"
          >
            <path
              d="M 0 0 L 15 30 L 30 0 Z"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>
        );

      case 'circles':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
          >
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>
        );

      case 'zigzag':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="40"
            height="20"
          >
            <path
              d="M 0 10 L 10 0 L 20 10 L 30 0 L 40 10"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
          </pattern>
        );

      case 'honeycomb':
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="30"
            height="52"
          >
            <path
              d="M15,2 L28,15 L28,37 L15,50 L2,37 L2,15 Z"
              fill="none"
              stroke={randomTextColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>
        );

      default:
        return (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke={randomTextColor}
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>
        );
    }
  }, [selectedPattern, randomTextColor, uniqueId]);

  // Generate decorative elements based on the pattern
  const decorativeElements = useMemo(() => {
    // Create a hash from the text to get consistent decorative elements
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    switch (selectedPattern) {
      case 'circles':
      case 'dots':
        return (
          <>
            <circle 
              cx={width * 0.2} 
              cy={height * 0.2} 
              r={Math.min(width, height) * 0.15} 
              fill={randomTextColor} 
              fillOpacity="0.05" 
            />
            <circle 
              cx={width * 0.8} 
              cy={height * 0.8} 
              r={Math.min(width, height) * 0.1} 
              fill={randomTextColor} 
              fillOpacity="0.05" 
            />
          </>
        );

      case 'waves':
      case 'zigzag':
        return (
          <path 
            d={`M0 ${height * 0.8} Q ${width * 0.25} ${height * 0.7}, ${width * 0.5} ${height * 0.8} T ${width} ${height * 0.7}`} 
            fill={randomTextColor} 
            fillOpacity="0.05" 
          />
        );

      case 'triangles':
      case 'honeycomb':
        return (
          <polygon 
            points={`${width * 0.5},${height * 0.2} ${width * 0.8},${height * 0.7} ${width * 0.2},${height * 0.7}`} 
            fill={randomTextColor} 
            fillOpacity="0.05" 
          />
        );

      default:
        // For other patterns, use a simple gradient overlay
        return (
          <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={randomTextColor} stopOpacity="0.05" />
            <stop offset="100%" stopColor={randomBgColor} stopOpacity="0" />
          </linearGradient>
        );
    }
  }, [selectedPattern, width, height, randomBgColor, randomTextColor, text, uniqueId]);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: width,
        height: height,
        backgroundColor: randomBgColor,
        color: randomTextColor,
        position: "relative",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {patternElements}
            {selectedPattern === 'diagonal' && (
              <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={randomTextColor} stopOpacity="0.05" />
                <stop offset="100%" stopColor={randomBgColor} stopOpacity="0" />
              </linearGradient>
            )}
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill={randomBgColor} />

          {/* Decorative elements */}
          {decorativeElements}

          {/* Pattern overlay */}
          <rect width="100%" height="100%" fill={`url(#pattern-${selectedPattern}-${uniqueId})`} />

          {/* Gradient overlay for some patterns */}
          {selectedPattern === 'diagonal' && (
            <rect width="100%" height="100%" fill={`url(#gradient-${uniqueId})`} />
          )}
        </svg>
      </div>
      <div className="z-10 text-center p-4">
        <div className="font-bold text-lg">{text}</div>
        <div className="text-sm opacity-70">{`${width}×${height}`}</div>
      </div>
    </div>
  );
}
