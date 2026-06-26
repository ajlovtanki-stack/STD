/**
 * Dashboard Page
 * Displays overview stats, tier ranking, and top universities
 */

import { useMemo } from "react";
import { useUniversityContext } from "@/contexts/UniversityContext";
import { TierBadge } from "@/components/TierBadge";
import { ScoreRing } from "@/components/ScoreRing";
import { UniversityCard } from "@/components/UniversityCard";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, FileUp } from "lucide-react";
import { exportToMarkdown, exportToJSON, importFromMarkdown, importFromJSON } from "@/lib/markdown";

interface DashboardProps {
  onAddUniversity?: () => void;
  onViewUniversity?: (id: string) => void;
  onBrowseUniversities?: () => void;
}

export default function Dashboard({ onAddUniversity, onViewUniversity, onBrowseUniversities }: DashboardProps) {
  const { universities } = useUniversityContext();

  // Calculate stats
  const stats = useMemo(() => {
    const total = universities.length;
    const avgScore = total > 0 ? Math.round(universities.reduce((sum, u) => sum + u.overallScore, 0) / total) : 0;
    const applied = universities.filter((u) => u.status === "applied").length;
    const accepted = universities.filter((u) => u.status === "accepted").length;
    const topUni = universities.sort((a, b) => b.overallScore - a.overallScore)[0];

    // Find nearest deadline
    const now = new Date();
    const withDeadline = universities
      .filter((u) => u.applicationDeadline)
      .map((u) => ({
        uni: u,
        daysUntil: Math.ceil(
          (new Date(u.applicationDeadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
      }))
      .filter((u) => u.daysUntil > 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    return {
      total,
      avgScore,
      applied,
      accepted,
      topUni,
      nearestDeadline: withDeadline[0],
    };
  }, [universities]);

  // Group by tier
  const byTier = useMemo(() => {
    const tiers: Record<string, typeof universities> = { S: [], A: [], B: [], C: [], D: [], E: [], F: [] };
    universities.forEach((u) => {
      if (tiers[u.tier]) {
        tiers[u.tier].push(u);
      }
    });
    return tiers;
  }, [universities]);

  const handleExportMarkdown = () => {
    const markdown = exportToMarkdown(universities);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `university-quest-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(universities);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `university-quest-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMarkdown = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const imported = importFromMarkdown(content);
          // TODO: Merge with existing universities
          console.log("Imported universities:", imported);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl">UNIVERSITY QUEST</h1>
            <p className="text-sm text-muted-foreground mt-1">Your personal university collection tracker</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBrowseUniversities} variant="outline" size="sm">
              Browse
            </Button>
            <Button onClick={onAddUniversity} size="sm" className="gap-2">
              <Plus size={16} />
              Add University
            </Button>
            <Button onClick={handleExportMarkdown} variant="outline" size="sm" className="gap-2">
              <FileDown size={16} />
              Export MD
            </Button>
            <Button onClick={handleExportJSON} variant="outline" size="sm" className="gap-2">
              <FileDown size={16} />
              Export JSON
            </Button>
            <Button onClick={handleImportMarkdown} variant="outline" size="sm" className="gap-2">
              <FileUp size={16} />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono-regular mb-2">TOTAL UNIVERSITIES</p>
            <p className="font-display font-bold text-3xl text-accent">{stats.total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono-regular mb-2">AVERAGE SCORE</p>
            <p className="font-display font-bold text-3xl text-accent">{stats.avgScore}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono-regular mb-2">APPLICATIONS</p>
            <p className="font-display font-bold text-3xl text-accent">{stats.applied}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono-regular mb-2">ACCEPTANCES</p>
            <p className="font-display font-bold text-3xl text-accent">{stats.accepted}</p>
          </div>
        </div>

        {/* Top University */}
        {stats.topUni && (
          <div className="bg-card border-2 border-accent rounded-lg p-6">
            <h2 className="font-display font-bold text-xl mb-4">YOUR TOP PICK</h2>
            <div className="flex items-center gap-6">
              <ScoreRing score={stats.topUni.overallScore} size={100} animated={true} />
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl mb-2">{stats.topUni.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {stats.topUni.city}, {stats.topUni.country}
                </p>
                <div className="flex gap-4">
                  <TierBadge tier={stats.topUni.tier} size="lg" showLabel={true} />
                  <Button onClick={() => onViewUniversity?.(stats.topUni!.id)} variant="default" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearest Deadline */}
        {stats.nearestDeadline && (
          <div className="bg-card border border-destructive rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-mono-regular mb-2">NEAREST DEADLINE</p>
            <p className="font-display font-bold text-lg mb-2">{stats.nearestDeadline.uni.name}</p>
            <p className="text-sm text-destructive">
              {stats.nearestDeadline.daysUntil} days remaining
            </p>
          </div>
        )}

        {/* Tier Ranking */}
        <div className="space-y-8">
          <h2 className="font-display font-bold text-2xl">TIER RANKING</h2>

          {(["S", "A", "B", "C"] as const).map((tier) => {
            const unis = byTier[tier].sort((a, b) => b.overallScore - a.overallScore);
            if (unis.length === 0) return null;

            return (
              <div key={tier} className="space-y-3">
                <div className="flex items-center gap-3">
                  <TierBadge tier={tier} size="lg" />
                  <p className="text-sm text-muted-foreground font-mono-regular">{unis.length} universities</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unis.map((uni) => (
                    <UniversityCard
                      key={uni.id}
                      university={uni}
                      onClick={() => onViewUniversity?.(uni.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {universities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No universities yet. Start your quest!</p>
            <Button onClick={onAddUniversity} size="lg">
              Add Your First University
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
