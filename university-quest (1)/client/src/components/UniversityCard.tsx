/**
 * University Card Component
 * Displays university information in a game-inventory style card
 */

import { University } from "@/lib/types";
import { TierBadge } from "./TierBadge";
import { ScoreRing } from "./ScoreRing";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Zap } from "lucide-react";

interface UniversityCardProps {
  university: University;
  onClick?: () => void;
  featured?: boolean;
}

export function UniversityCard({ university, onClick, featured = false }: UniversityCardProps) {
  const isAccepted = university.status === "accepted";
  const isRejected = university.status === "rejected";

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg border-2 border-border bg-card text-card-foreground
        transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer
        ${featured ? "col-span-2 row-span-2" : ""}
        ${isAccepted ? "ring-2 ring-green-500" : ""}
        ${isRejected ? "opacity-60" : ""}
      `}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative p-4 h-full flex flex-col">
        {/* Header: Tier + Score */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg leading-tight mb-1">{university.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={14} />
              {university.city}, {university.country}
            </div>
          </div>
          <div className="ml-3">
            <TierBadge tier={university.tier} size="md" />
          </div>
        </div>

        {/* Score Ring */}
        <div className="flex justify-center mb-3">
          <ScoreRing score={university.overallScore} size={64} animated={false} />
        </div>

        {/* Program & Status */}
        <div className="text-xs mb-3 space-y-1">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Program:</span> {university.program}
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Status:</span>
            <span className="ml-1 px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-mono-regular">
              {university.status}
            </span>
          </p>
        </div>

        {/* Deadline indicator */}
        {university.applicationDeadline && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar size={12} />
            {new Date(university.applicationDeadline).toLocaleDateString()}
          </div>
        )}

        {/* Tags */}
        {university.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {university.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-mono-regular">
                #{tag}
              </Badge>
            ))}
            {university.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-mono-regular">
                +{university.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-auto pt-3 border-t border-border text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Employability:</span>
            <span className="font-semibold text-accent">{university.employability}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Career Ops:</span>
            <span className="font-semibold text-accent">{university.careerOpportunities}/100</span>
          </div>
        </div>

        {/* Status indicators */}
        {isAccepted && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-sm text-xs font-semibold">
            <Zap size={12} />
            ACCEPTED
          </div>
        )}
      </div>
    </div>
  );
}
