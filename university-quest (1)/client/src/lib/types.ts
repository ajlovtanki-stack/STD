/**
 * University Quest Data Model
 * Defines the core types for universities, scoring, and metadata
 */

export type Tier = "S" | "A" | "B" | "C" | "D" | "E" | "F";

export interface ScoringCriteria {
  id: string;
  name: string; // e.g., "Research Opportunities", "Campus Life"
  weight: number; // 0-100, relative weight
  description?: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  program: string;
  notes: string;
  
  // Scoring factors (0-100) - flexible custom scores
  customScores: Record<string, number>; // Map of criteria ID to score (0-100)
  
  // Legacy scoring factors (kept for backward compatibility)
  scholarships?: number;
  employability?: number;
  language?: number;
  acceptanceRate?: number;
  cost?: number;
  careerOpportunities?: number;
  
  // Calculated fields
  overallScore: number; // Auto-calculated weighted score
  tier: Tier; // Auto-assigned based on score
  
  // Metadata
  tags: string[]; // Custom tags (e.g., #Scholarship, #Cheap)
  status: "applied" | "accepted" | "rejected" | "wishlist" | "researching";
  applicationDeadline?: string; // ISO date string
  admissionDeadline?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface DashboardStats {
  totalUniversities: number;
  averageScore: number;
  applicationCount: number;
  acceptanceCount: number;
  topUniversity?: University;
  nearestDeadline?: { university: University; daysUntil: number };
}

export interface ScoringWeights {
  // Legacy weights (kept for backward compatibility)
  scholarships?: number;
  employability?: number;
  language?: number;
  acceptanceRate?: number;
  cost?: number;
  careerOpportunities?: number;
  
  // Custom criteria weights
  [key: string]: number | undefined;
}

export interface FilterOptions {
  tier?: Tier[];
  status?: University["status"][];
  tags?: string[];
  minScore?: number;
  maxScore?: number;
  country?: string;
  searchQuery?: string;
}

export type SortOption =
  | "highest-score"
  | "lowest-score"
  | "cheapest"
  | "best-climate"
  | "best-student-life"
  | "best-career-opportunities"
  | "easiest-admission"
  | "deadline"
  | "alphabetical";
