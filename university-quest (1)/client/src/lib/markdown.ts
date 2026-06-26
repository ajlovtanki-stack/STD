/**
 * Markdown Import/Export Utilities
 * Handles conversion between University data and Markdown format
 */

import { University } from "./types";
import { updateUniversityScore } from "./scoring";

/**
 * Export universities to Markdown format
 * @param universities - Array of universities
 * @returns Markdown string
 */
export function exportToMarkdown(universities: University[]): string {
  let markdown = "# University Quest Data\n\n";
  markdown += `Generated: ${new Date().toISOString()}\n\n`;

  universities.forEach((uni) => {
    markdown += `## ${uni.name}\n\n`;
    markdown += `- **Country**: ${uni.country}\n`;
    markdown += `- **City**: ${uni.city}\n`;
    markdown += `- **Program**: ${uni.program}\n`;
    markdown += `- **Status**: ${uni.status}\n`;
    markdown += `- **Tier**: ${uni.tier}\n`;
    markdown += `- **Score**: ${uni.overallScore}/100\n`;

    if (uni.applicationDeadline) {
      const deadline = new Date(uni.applicationDeadline);
      markdown += `- **Application Deadline**: ${deadline.toLocaleDateString()}\n`;
    }

    markdown += `\n### Scores\n\n`;
    markdown += `- Scholarships: ${uni.scholarships ?? 50}\n`;
    markdown += `- Employability: ${uni.employability ?? 50}\n`;
    markdown += `- Language Support: ${uni.language ?? 50}\n`;
    markdown += `- Acceptance Rate: ${uni.acceptanceRate ?? 50}\n`;
    markdown += `- Cost: ${uni.cost ?? 50}\n`;
    markdown += `- Career Opportunities: ${uni.careerOpportunities ?? 50}\n`;

    if (uni.tags && uni.tags.length > 0) {
      markdown += `\n### Tags\n\n`;
      markdown += uni.tags.map((tag) => `- ${tag}`).join("\n");
      markdown += "\n";
    }

    if (uni.notes) {
      markdown += `\n### Notes\n\n${uni.notes}\n`;
    }

    markdown += "\n---\n\n";
  });

  return markdown;
}

/**
 * Export universities to JSON format
 * @param universities - Array of universities
 * @returns JSON string
 */
export function exportToJSON(universities: University[]): string {
  return JSON.stringify(universities, null, 2);
}

/**
 * Import universities from Markdown format
 * @param markdown - Markdown string
 * @returns Array of universities
 */
export function importFromMarkdown(markdown: string): University[] {
  const universities: University[] = [];
  const sections = markdown.split("## ").slice(1); // Skip header

  sections.forEach((section) => {
    const lines = section.split("\n");
    const name = lines[0].trim();

    const uni: Partial<University> = {
      name,
      country: extractValue(lines, "Country"),
      city: extractValue(lines, "City"),
      program: extractValue(lines, "Program"),
      status: (extractValue(lines, "Status") || "researching") as any,
      scholarships: parseScore(extractValue(lines, "Scholarships")),
      employability: parseScore(extractValue(lines, "Employability")),
      language: parseScore(extractValue(lines, "Language Support")),
      acceptanceRate: parseScore(extractValue(lines, "Acceptance Rate")),
      cost: parseScore(extractValue(lines, "Cost")),
      careerOpportunities: parseScore(extractValue(lines, "Career Opportunities")),
      notes: extractNotes(section),
      tags: extractTags(section),
    };

    const deadline = extractValue(lines, "Application Deadline");
    if (deadline) {
      uni.applicationDeadline = new Date(deadline).toISOString();
    }

    const completed = completeUniversity(uni);
    if (completed) {
      universities.push(completed);
    }
  });

  return universities;
}

/**
 * Import universities from JSON format
 * @param json - JSON string
 * @returns Array of universities
 */
export function importFromJSON(json: string): University[] {
  try {
    const parsed = JSON.parse(json);
    const universities = Array.isArray(parsed) ? parsed : [parsed];

    return universities.map((uni: any) => {
      const completed = completeUniversity(uni);
      return completed || ({} as University);
    }).filter((u: University) => u.id);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return [];
  }
}

/**
 * Complete a partial university with defaults and calculated fields
 * @param uni - Partial university data
 * @returns Completed university or null if invalid
 */
function completeUniversity(uni: Partial<University>): University | null {
  if (!uni.name) return null;

  const scholarships = uni.scholarships ?? 50;
  const employability = uni.employability ?? 50;
  const language = uni.language ?? 50;
  const acceptanceRate = uni.acceptanceRate ?? 50;
  const cost = uni.cost ?? 50;
  const careerOpportunities = uni.careerOpportunities ?? 50;

  const completed = {
    id: uni.id || generateId(),
    name: uni.name,
    country: uni.country || "",
    city: uni.city || "",
    program: uni.program || "",
    notes: uni.notes || "",
    scholarships,
    employability,
    language,
    acceptanceRate,
    cost,
    careerOpportunities,
    customScores: {
      scholarships,
      employability,
      language,
      acceptanceRate,
      cost,
      careerOpportunities,
    },
    tags: uni.tags || [],
    status: uni.status || ("researching" as const),
    applicationDeadline: uni.applicationDeadline,
    createdAt: uni.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Recalculate score
  return updateUniversityScore(completed);
}

/**
 * Generate a unique ID
 * @returns UUID-like string
 */
function generateId(): string {
  return `uni_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Extract value from markdown lines
 * @param lines - Array of markdown lines
 * @param key - Key to search for
 * @returns Value or empty string
 */
function extractValue(lines: string[], key: string): string {
  const line = lines.find((l) => l.includes(`**${key}**`));
  if (!line) return "";
  return line.split(":").slice(1).join(":").trim();
}

/**
 * Extract notes section from markdown
 * @param section - Markdown section
 * @returns Notes text
 */
function extractNotes(section: string): string {
  const notesMatch = section.match(/### Notes\n\n([\s\S]*?)(?:---|\Z)/);
  return notesMatch ? notesMatch[1].trim() : "";
}

/**
 * Extract tags from markdown
 * @param section - Markdown section
 * @returns Array of tags
 */
function extractTags(section: string): string[] {
  const tagsMatch = section.match(/### Tags\n\n([\s\S]*?)(?:###|---|\Z)/);
  if (!tagsMatch) return [];
  return tagsMatch[1]
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

/**
 * Parse score from string
 * @param value - Score value
 * @returns Parsed score or 50
 */
function parseScore(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 50 : Math.max(0, Math.min(100, parsed));
}
