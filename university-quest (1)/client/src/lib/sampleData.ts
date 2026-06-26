/**
 * Sample Data Generator
 * Creates example universities for testing and demo purposes
 */

import { University } from "./types";
import { updateUniversityScore } from "./scoring";

const sampleUniversities = [
  {
    name: "TU Delft",
    country: "Netherlands",
    city: "Delft",
    program: "Computer Science",
    notes: "Strong engineering program, great tech industry connections",
    scholarships: 75,
    employability: 95,
    language: 90,
    acceptanceRate: 35,
    cost: 80,
    careerOpportunities: 95,
    tags: ["ComputerScience", "Engineering", "Scholarship", "English"],
    status: "applied" as const,
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Aalto University",
    country: "Finland",
    city: "Espoo",
    program: "Computer Science",
    notes: "Excellent design and tech focus, Nordic quality of life",
    scholarships: 85,
    employability: 92,
    language: 95,
    acceptanceRate: 20,
    cost: 85,
    careerOpportunities: 90,
    tags: ["ComputerScience", "Design", "Scholarship", "Dream"],
    status: "researching" as const,
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Warsaw University of Technology",
    country: "Poland",
    city: "Warsaw",
    program: "Computer Science",
    notes: "Affordable, growing tech hub, good industry connections",
    scholarships: 60,
    employability: 78,
    language: 85,
    acceptanceRate: 60,
    cost: 95,
    careerOpportunities: 75,
    tags: ["ComputerScience", "Cheap", "English"],
    status: "applied" as const,
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "ETH Zurich",
    country: "Switzerland",
    city: "Zurich",
    program: "Computer Science",
    notes: "Top-tier research, challenging admissions, expensive",
    scholarships: 70,
    employability: 98,
    language: 92,
    acceptanceRate: 10,
    cost: 30,
    careerOpportunities: 98,
    tags: ["ComputerScience", "Dream", "Research"],
    status: "researching" as const,
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "University of Copenhagen",
    country: "Denmark",
    city: "Copenhagen",
    program: "Computer Science",
    notes: "Nordic excellence, great student life, free tuition for EU",
    scholarships: 80,
    employability: 88,
    language: 95,
    acceptanceRate: 25,
    cost: 90,
    careerOpportunities: 85,
    tags: ["ComputerScience", "StudentLife", "English"],
    status: "wishlist" as const,
    applicationDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Technion - Israel Institute of Technology",
    country: "Israel",
    city: "Haifa",
    program: "Computer Science",
    notes: "Strong tech background, startup ecosystem",
    scholarships: 65,
    employability: 90,
    language: 85,
    acceptanceRate: 40,
    cost: 70,
    careerOpportunities: 92,
    tags: ["ComputerScience", "Startup", "Research"],
    status: "researching" as const,
    applicationDeadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function generateSampleData(): University[] {
  return sampleUniversities.map((uni, index) => {
    const completed = updateUniversityScore({
      ...uni,
      id: `uni_sample_${index}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      customScores: {
        scholarships: uni.scholarships,
        employability: uni.employability,
        language: uni.language,
        acceptanceRate: uni.acceptanceRate,
        cost: uni.cost,
        careerOpportunities: uni.careerOpportunities,
      },
    });
    return completed;
  });
}
