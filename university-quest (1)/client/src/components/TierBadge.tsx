/**
 * Tier Badge Component
 * Displays S/A/B/C tier with appropriate styling
 */

import { Tier } from "@/lib/types";
import { getTierColor, getTierLabel } from "@/lib/scoring";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TierBadge({ tier, size = "md", showLabel = false }: TierBadgeProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-3xl",
  };

  const tierColor = getTierColor(tier);
  const tierLabel = getTierLabel(tier);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center font-display font-bold rounded-sm border-2 transition-all duration-200 hover:scale-110 cursor-default`}
        style={{
          backgroundColor: tierColor,
          borderColor: tierColor,
          color: tier === "A" || tier === "C" || tier === "D" || tier === "E" ? "#000" : "#fff",
        }}
      >
        {tier}
      </div>
      {showLabel && <span className="text-xs font-mono-regular text-muted-foreground">{tierLabel}</span>}
    </div>
  );
}
