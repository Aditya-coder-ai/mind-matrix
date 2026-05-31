export type SubjectName = "Chemistry" | "Physics" | "Mathematics" | "DSA" | "DBMS";

export interface KnowledgeLevels {
  recall: number;
  understanding: number;
  application: number;
  analysis: number;
  reflection: number;
}

export type KnowledgeLevelKey = keyof KnowledgeLevels;

export type DifficultyTier = "beginner" | "intermediate" | "advanced";

export interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export interface TrackedMisconception {
  id: string;
  topicId: string;
  concept: string;
  type: string;
  description: string;
  severity: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  resolved: boolean;
}
