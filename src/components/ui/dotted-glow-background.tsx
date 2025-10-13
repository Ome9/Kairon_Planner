import React from "react";
import { cn } from "@/lib/utils";

interface DottedGlowBackgroundProps {
  className?: string;
  opacity?: number;
  gap?: number;
  radius?: number;
  colorLightVar?: string;
  glowColorLightVar?: string;
  colorDarkVar?: string;
  glowColorDarkVar?: string;
  backgroundOpacity?: number;
  speedMin?: number;
  speedMax?: number;
  speedScale?: number;
}

const DottedGlowBackground: React.FC<DottedGlowBackgroundProps> = ({
  className,
  opacity = 1,
  gap = 10,
  radius = 1.6,
  colorLightVar = "--color-neutral-500",
  glowColorLightVar = "--color-neutral-600",
  colorDarkVar = "--color-neutral-500",
  glowColorDarkVar = "--color-purple-600",
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 1.6,
  speedScale = 1,
}) => {
  const dotColor = `var(${colorDarkVar})`;
  const glowColor = `var(${glowColorDarkVar})`;

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(circle at center, ${glowColor} 0%, transparent 50%)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity: opacity,
      }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id="dotted-pattern"
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gap / 2}
              cy={gap / 2}
              r={radius}
              fill={dotColor}
              opacity={opacity}
            >
              <animate
                attributeName="r"
                values={`${radius};${radius * 1.5};${radius}`}
                dur={`${speedMin + Math.random() * (speedMax - speedMin)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${opacity};${opacity * 0.5};${opacity}`}
                dur={`${speedMin + Math.random() * (speedMax - speedMin)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
          <radialGradient id="glow-gradient">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={glowColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        <rect
          width="100%"
          height="100%"
          fill="url(#glow-gradient)"
          className="animate-pulse"
          style={{
            animationDuration: `${speedScale * 3}s`,
            animationTimingFunction: "ease-in-out",
          }}
        />
      </svg>
    </div>
  );
};

export default DottedGlowBackground;
