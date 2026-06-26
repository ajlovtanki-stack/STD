/**
 * University Context
 * Provides global state management for universities and scoring weights
 */

import React, { createContext, useContext, ReactNode } from "react";
import { University, ScoringWeights } from "@/lib/types";
import { DEFAULT_WEIGHTS } from "@/lib/scoring";
import { useUniversities } from "@/hooks/useUniversities";

interface UniversityContextType {
  universities: University[];
  isLoading: boolean;
  weights: ScoringWeights;
  setWeights: (weights: ScoringWeights) => void;
  addUniversity: (uni: Omit<University, "id" | "createdAt" | "updatedAt" | "overallScore" | "tier">) => University;
  updateUniversity: (id: string, updates: Partial<University>) => void;
  deleteUniversity: (id: string) => void;
  filterUniversities: (options: any) => University[];
  sortUniversities: (unis: University[], option: any) => University[];
  getAllTags: () => string[];
  getCountries: () => string[];
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ children }: { children: ReactNode }) {
  const universities = useUniversities();
  const [weights, setWeights] = React.useState<ScoringWeights>(DEFAULT_WEIGHTS);

  const value: UniversityContextType = {
    ...universities,
    weights,
    setWeights,
  };

  return (
    <UniversityContext.Provider value={value}>
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversityContext() {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error("useUniversityContext must be used within UniversityProvider");
  }
  return context;
}
