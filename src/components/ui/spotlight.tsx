import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
}

export const Spotlight = ({
  className,
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(263, 70%, 50%, .15) 0, hsla(263, 70%, 40%, .08) 50%, hsla(263, 70%, 30%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(263, 70%, 50%, .12) 0, hsla(263, 70%, 40%, .06) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(263, 70%, 50%, .08) 0, hsla(263, 70%, 35%, .04) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <div
        style={{
          background: gradientFirst,
          width: `${width}px`,
          height: `${height}px`,
          transform: `translateY(${translateY}px) translateX(${xOffset}px)`,
        }}
        className="animate-spotlight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-3xl"
      />
      <div
        style={{
          background: gradientSecond,
          width: `${smallWidth}px`,
          height: `${height}px`,
          transform: `translateY(${translateY}px) translateX(-${xOffset}px)`,
          animationDelay: `${duration / 3}s`,
        }}
        className="animate-spotlight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-3xl"
      />
      <div
        style={{
          background: gradientThird,
          width: `${smallWidth}px`,
          height: `${height}px`,
          transform: `translateY(${translateY}px)`,
          animationDelay: `${(duration / 3) * 2}s`,
        }}
        className="animate-spotlight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-3xl"
      />
    </div>
  );
};
