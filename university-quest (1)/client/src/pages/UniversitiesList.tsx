/**
 * Universities List Page
 * Displays universities with filtering, sorting, and search capabilities
 */

import { useState, useMemo } from "react";
import { useUniversityContext } from "@/contexts/UniversityContext";
import { UniversityCard } from "@/components/UniversityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import { SortOption, Tier } from "@/lib/types";

interface UniversitiesListProps {
  onBack?: () => void;
  onViewUniversity?: (id: string) => void;
}

export default function UniversitiesList({ onBack, onViewUniversity }: UniversitiesListProps) {
  const { universities, filterUniversities, sortUniversities, getAllTags, getCountries } = useUniversityContext();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<Tier[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("highest-score");

  // Get available options
  const allTags = getAllTags();
  const allCountries = getCountries();

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    const filtered = filterUniversities({
      searchQuery,
      tier: selectedTiers.length > 0 ? selectedTiers : undefined,
      status: selectedStatuses.length > 0 ? (selectedStatuses as any[]) : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      country: selectedCountry || undefined,
    });

    return sortUniversities(filtered, sortBy);
  }, [searchQuery, selectedTiers, selectedStatuses, selectedTags, selectedCountry, sortBy, filterUniversities, sortUniversities]);

  const toggleTier = (tier: Tier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTiers([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setSelectedCountry("");
    setSortBy("highest-score");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedTiers.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedTags.length > 0 ||
    selectedCountry;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft size={16} />
            </Button>
            <h1 className="font-display font-bold text-2xl">BROWSE UNIVERSITIES</h1>
          </div>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" size="sm" className="gap-2">
              <X size={16} />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Search</label>
                <Input
                  placeholder="University name, country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest-score">Highest Score</SelectItem>
                    <SelectItem value="lowest-score">Lowest Score</SelectItem>
                    <SelectItem value="cheapest">Cheapest</SelectItem>
                    <SelectItem value="best-career-opportunities">Best Career Ops</SelectItem>
                    <SelectItem value="easiest-admission">Easiest Admission</SelectItem>
                    <SelectItem value="deadline">Nearest Deadline</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Tier</label>
                <div className="flex flex-wrap gap-2">
                  {(["S", "A", "B", "C", "D", "E", "F"] as Tier[]).map((tier) => (
                    <Badge
                      key={tier}
                      variant={selectedTiers.includes(tier) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTier(tier)}
                    >
                      {tier} Tier
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Status</label>
                <div className="space-y-2">
                  {["researching", "applied", "accepted", "rejected", "wishlist"].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="rounded"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              {allCountries.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All countries</SelectItem>
                      {allCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main: University Cards */}
          <div className="lg:col-span-3">
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No universities match your filters.</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4 font-mono-regular">
                  {filteredAndSorted.length} university{filteredAndSorted.length !== 1 ? "ies" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAndSorted.map((uni) => (
                    <UniversityCard
                      key={uni.id}
                      university={uni}
                      onClick={() => onViewUniversity?.(uni.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
