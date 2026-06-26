/**
 * Score Ring Component
 * Displays overall score as a circular progress indicator
 */

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number; // 0-100
  size?: number; // diameter in pixels
  animated?: boolean;
}

export function ScoreRing({ score, size = 80, animated = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) return;

    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(score / 20);
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [score, animated]);

  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  // Color based on score
  let color = "#808080"; // Gray (C tier)
  if (displayScore >= 85) color = "#ffd700"; // Gold (S tier)
  else if (displayScore >= 70) color = "#c0c0c0"; // Silver (A tier)
  else if (displayScore >= 55) color = "#cd7f32"; // Bronze (B tier)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.15 0.008 260)"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animated ? "stroke-dashoffset 0.05s linear" : "none",
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-bold text-lg" style={{ color }}>
          {displayScore}
        </span>
        <span className="text-xs text-muted-foreground font-mono-regular">/ 100</span>
      </div>
    </div>
  );
}
