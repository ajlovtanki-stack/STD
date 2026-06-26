/**
 * useUniversities Hook
 * Manages university data with local storage persistence
 */

import { useEffect, useState, useCallback } from "react";
import { University, FilterOptions, SortOption } from "@/lib/types";
import { updateUniversityScore } from "@/lib/scoring";
import { generateSampleData } from "@/lib/sampleData";

const STORAGE_KEY = "university-quest-data";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Array.isArray(data) && data.length > 0) {
          setUniversities(data);
        } else {
          // Empty array in storage, load sample data
          const sampleData = generateSampleData();
          setUniversities(sampleData);
        }
      } else {
        // No stored data, load sample data
        const sampleData = generateSampleData();
        setUniversities(sampleData);
      }
    } catch (error) {
      console.error("Failed to load universities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever universities change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(universities));
      } catch (error) {
        console.error("Failed to save universities:", error);
      }
    }
  }, [universities, isLoading]);

  const addUniversity = useCallback((uni: Omit<University, "id" | "createdAt" | "updatedAt" | "overallScore" | "tier">) => {
    const newUni = updateUniversityScore({
      ...uni,
      id: `uni_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setUniversities((prev) => [newUni, ...prev]);
    return newUni;
  }, []);

  const updateUniversity = useCallback((id: string, updates: Partial<University>) => {
    setUniversities((prev) =>
      prev.map((uni) => {
        if (uni.id !== id) return uni;
        const updated = { ...uni, ...updates, updatedAt: new Date().toISOString() };
        return updateUniversityScore(updated);
      })
    );
  }, []);

  const deleteUniversity = useCallback((id: string) => {
    setUniversities((prev) => prev.filter((uni) => uni.id !== id));
  }, []);

  const filterUniversities = useCallback(
    (options: FilterOptions): University[] => {
      return universities.filter((uni) => {
        if (options.tier && !options.tier.includes(uni.tier)) return false;
        if (options.status && !options.status.includes(uni.status)) return false;
        if (options.minScore !== undefined && uni.overallScore < options.minScore) return false;
        if (options.maxScore !== undefined && uni.overallScore > options.maxScore) return false;
        if (options.country && uni.country.toLowerCase() !== options.country.toLowerCase())
          return false;

        if (options.tags && options.tags.length > 0) {
          const hasAllTags = options.tags.every((tag) =>
            uni.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
          );
          if (!hasAllTags) return false;
        }

        if (options.searchQuery) {
          const query = options.searchQuery.toLowerCase();
          return (
            uni.name.toLowerCase().includes(query) ||
            uni.country.toLowerCase().includes(query) ||
            uni.city.toLowerCase().includes(query) ||
            uni.program.toLowerCase().includes(query) ||
            uni.notes.toLowerCase().includes(query)
          );
        }

        return true;
      });
    },
    [universities]
  );

  const sortUniversities = useCallback(
    (unis: University[], option: SortOption): University[] => {
      const sorted = [...unis];

      switch (option) {
        case "highest-score":
          sorted.sort((a, b) => b.overallScore - a.overallScore);
          break;
        case "lowest-score":
          sorted.sort((a, b) => a.overallScore - b.overallScore);
          break;
        case "cheapest":
          sorted.sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0)); // Higher cost score = cheaper
          break;
        case "best-career-opportunities":
          sorted.sort((a, b) => (b.careerOpportunities ?? 0) - (a.careerOpportunities ?? 0));
          break;
        case "easiest-admission":
          sorted.sort((a, b) => (b.acceptanceRate ?? 0) - (a.acceptanceRate ?? 0)); // Higher rate = easier
          break;
        case "deadline":
          sorted.sort((a, b) => {
            if (!a.applicationDeadline) return 1;
            if (!b.applicationDeadline) return -1;
            return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
          });
          break;
        case "alphabetical":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "best-climate":
        case "best-student-life":
          // These would require additional data fields not in current model
          // For now, sort by overall score
          sorted.sort((a, b) => b.overallScore - a.overallScore);
          break;
      }

      return sorted;
    },
    []
  );

  const getAllTags = useCallback((): string[] => {
    const tags = new Set<string>();
    universities.forEach((uni) => {
      uni.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [universities]);

  const getCountries = useCallback((): string[] => {
    const countries = new Set<string>();
    universities.forEach((uni) => {
      if (uni.country) countries.add(uni.country);
    });
    return Array.from(countries).sort();
  }, [universities]);

  return {
    universities,
    isLoading,
    addUniversity,
    updateUniversity,
    deleteUniversity,
    filterUniversities,
    sortUniversities,
    getAllTags,
    getCountries,
  };
}
