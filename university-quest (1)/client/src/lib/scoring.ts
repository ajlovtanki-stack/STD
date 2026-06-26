/**
 * Scoring Engine
 * Calculates weighted scores and assigns tier rankings
 * Supports both legacy fixed criteria and custom flexible criteria
 */

import { University, Tier, ScoringWeights, ScoringCriteria } from "./types";

// Default legacy scoring weights (kept for backward compatibility)
export const DEFAULT_WEIGHTS: ScoringWeights = {
  scholarships: 0.2,
  employability: 0.2,
  language: 0.1,
  acceptanceRate: 0.15,
  cost: 0.15,
  careerOpportunities: 0.2,
};

// Default custom scoring criteria
export const DEFAULT_CRITERIA: ScoringCriteria[] = [
  {
    id: "scholarships",
    name: "Scholarships",
    weight: 20,
    description: "Scholarship availability and generosity",
  },
  {
    id: "employability",
    name: "Employability",
    weight: 20,
    description: "Graduate employability and career outcomes",
  },
  {
    id: "language",
    name: "Language Support",
    weight: 10,
    description: "English-friendly programs and support",
  },
  {
    id: "acceptanceRate",
    name: "Acceptance Rate",
    weight: 15,
    description: "Admission difficulty (lower is more prestigious)",
  },
  {
    id: "cost",
    name: "Cost",
    weight: 15,
    description: "Affordability (lower cost is better)",
  },
  {
    id: "careerOpportunities",
    name: "Career Opportunities",
    weight: 20,
    description: "Post-graduation opportunities",
  },
];

/**
 * Calculate overall score using custom criteria
 * @param uni - University data
 * @param criteria - Array of scoring criteria with weights
 * @returns Weighted score (0-100)
 */
export function calculateScoreWithCriteria(
  uni: University,
  criteria: ScoringCriteria[]
): number {
  if (criteria.length === 0) return 0;

  // Calculate total weight
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;

  // Calculate weighted score
  let score = 0;
  for (const criterion of criteria) {
    const criteriaScore = uni.customScores[criterion.id] ?? 0;
    score += (criteriaScore * criterion.weight) / totalWeight;
  }

  return Math.round(score);
}

/**
 * Calculate overall score (legacy method for backward compatibility)
 * @param uni - University data
 * @param weights - Scoring weights
 * @returns Weighted score (0-100)
 */
export function calculateScore(
  uni: Omit<University, "overallScore" | "tier">,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  // Inverse scoring: lower acceptance rate and cost are better
  const acceptanceScore = 100 - (uni.acceptanceRate ?? 50);
  const costScore = 100 - (uni.cost ?? 50);

  const score =
    (uni.scholarships ?? 0) * (weights.scholarships ?? 0.2) +
    (uni.employability ?? 0) * (weights.employability ?? 0.2) +
    (uni.language ?? 0) * (weights.language ?? 0.1) +
    acceptanceScore * (weights.acceptanceRate ?? 0.15) +
    costScore * (weights.cost ?? 0.15) +
    (uni.careerOpportunities ?? 0) * (weights.careerOpportunities ?? 0.2);

  return Math.round(score);
}

/**
 * Assign tier based on overall score (S-F scale)
 * Score distribution:
 * S: 90-100 (Top tier)
 * A: 80-89  (Excellent)
 * B: 70-79  (Very Good)
 * C: 60-69  (Good)
 * D: 50-59  (Acceptable)
 * E: 40-49  (Below Average)
 * F: 0-39   (Poor)
 *
 * @param score - Overall score (0-100)
 * @returns Tier (S, A, B, C, D, E, or F)
 */
export function assignTier(score: number): Tier {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  return "F";
}

/**
 * Update university with calculated score and tier (using custom criteria)
 * @param uni - University data
 * @param criteria - Array of scoring criteria
 * @returns Updated university with calculated fields
 */
export function updateUniversityScoreWithCriteria(
  uni: Omit<University, "overallScore" | "tier">,
  criteria: ScoringCriteria[]
): University {
  const overallScore = calculateScoreWithCriteria(
    { ...uni, overallScore: 0, tier: "C" } as University,
    criteria
  );
  const tier = assignTier(overallScore);

  return {
    ...uni,
    overallScore,
    tier,
  };
}

/**
 * Update university with calculated score and tier (legacy method)
 * @param uni - University data
 * @param weights - Scoring weights
 * @returns Updated university with calculated fields
 */
export function updateUniversityScore(
  uni: Omit<University, "overallScore" | "tier">,
  weights?: ScoringWeights
): University {
  const overallScore = calculateScore(uni, weights);
  const tier = assignTier(overallScore);

  return {
    ...uni,
    overallScore,
    tier,
  };
}

/**
 * Get tier color for UI rendering
 * @param tier - Tier (S, A, B, C, D, E, F)
 * @returns CSS color value
 */
export function getTierColor(tier: Tier): string {
  const colors: Record<Tier, string> = {
    S: "oklch(0.85 0.2 65)", // Gold
    A: "oklch(0.8 0.05 0)", // Silver
    B: "oklch(0.6 0.15 40)", // Bronze
    C: "oklch(0.5 0.02 0)", // Gray
    D: "oklch(0.45 0.01 0)", // Dark Gray
    E: "oklch(0.4 0.01 0)", // Darker Gray
    F: "oklch(0.35 0.01 0)", // Very Dark Gray
  };
  return colors[tier];
}

/**
 * Get tier label for UI
 * @param tier - Tier (S, A, B, C, D, E, F)
 * @returns Human-readable tier label
 */
export function getTierLabel(tier: Tier): string {
  const labels: Record<Tier, string> = {
    S: "Dream School",
    A: "Strong Choice",
    B: "Very Good",
    C: "Good Option",
    D: "Acceptable",
    E: "Below Average",
    F: "Poor Fit",
  };
  return labels[tier];
}
