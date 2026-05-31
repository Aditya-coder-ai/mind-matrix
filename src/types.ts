export type SubjectName = "Chemistry" | "Physics" | "Mathematics" | "DSA" | "DBMS";

// ─── Multi-Level Knowledge Model ───────────────────────────────────────────

/** Per-level mastery breakdown (Bloom's Taxonomy inspired) */
export interface KnowledgeLevels {
  recall: number;        // 0-100 — memory and syntax recognition
  understanding: number; // 0-100 — conceptual comprehension
  application: number;   // 0-100 — independent usage / coding
  analysis: number;      // 0-100 — debugging and reasoning
  reflection: number;    // 0-100 — metacognition and self-awareness
}

export type KnowledgeLevelKey = keyof KnowledgeLevels;

export const KNOWLEDGE_LEVEL_KEYS: KnowledgeLevelKey[] = [
  "recall", "understanding", "application", "analysis", "reflection"
];

export const KNOWLEDGE_LEVEL_LABELS: Record<KnowledgeLevelKey, string> = {
  recall: "Recall",
  understanding: "Understanding",
  application: "Application",
  analysis: "Analysis",
  reflection: "Reflection"
};

/** Default starting knowledge levels */
export const DEFAULT_KNOWLEDGE_LEVELS: KnowledgeLevels = {
  recall: 20,
  understanding: 20,
  application: 20,
  analysis: 20,
  reflection: 20
};

export const MASTERED_KNOWLEDGE_LEVELS: KnowledgeLevels = {
  recall: 100,
  understanding: 100,
  application: 100,
  analysis: 100,
  reflection: 100
};

// ─── Adaptive Difficulty ────────────────────────────────────────────────────

export type DifficultyTier = "beginner" | "intermediate" | "advanced";

// ─── Misconception Tracking ─────────────────────────────────────────────────

/** Tracked misconception with severity & history */
export interface TrackedMisconception {
  id: string;
  topicId: string;        // Parent topic node ID
  concept: string;        // Human-readable concept area
  type: string;           // e.g. "Squaring vs Doubling"
  description: string;
  severity: number;       // 0.0 – 1.0
  occurrences: number;
  firstSeen: string;      // ISO date
  lastSeen: string;       // ISO date
  resolved: boolean;
}

// ─── Assessment Questions ───────────────────────────────────────────────────

/** A structured question tagged with its cognitive level */
export interface AssessmentQuestion {
  id: string;
  topicId: string;
  level: KnowledgeLevelKey;
  question: string;
  codeSnippet?: string;
  expectedAnswer?: string;
  hints: string[];
}

// ─── AI Evaluation Output ───────────────────────────────────────────────────

/** Structured evaluation report returned by the assessment pipeline */
export interface AIEvaluationOutput {
  concept: string;
  mastery: number;
  knowledgeLevels: KnowledgeLevels;
  strengths: string[];
  weaknesses: string[];
  misconceptions: string[];
  nextFocus: string[];
}

// ─── Knowledge Graph ────────────────────────────────────────────────────────

/** An edge in the prerequisite knowledge graph */
export interface KnowledgeGraphEdge {
  from: string;    // prerequisite topic ID
  to: string;      // dependent topic ID
  weight: number;  // 0-1 influence strength
}

// ─── Core Data Types ────────────────────────────────────────────────────────

export interface TopicNode {
  id: string;
  name: string;
  subject: SubjectName;
  category: string;
  mastery: number;
  knowledgeLevels: KnowledgeLevels;
  difficultyTier: DifficultyTier;
  status: "mastered" | "active" | "pending";
  description: string;
  icon: string;
  x: number; // For visualization positioning on canvas (0 to 1000)
  y: number; // For visualization positioning on canvas (0 to 1000)
}

export type MessageSender = "ai" | "user";

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export interface MisconceptionState {
  title: string;
  description: string;
  suggestedPractice: string;
  prerequisites: string[];
  isMisconceived?: boolean;
}

export interface Reflection {
  id: string;
  topicId: string;
  topicName: string;
  question: string;
  answer: string;
  feedback: string;
  date: string;
}

export interface StudentProfile {
  name: string;
  role: "Student" | "Scholar" | "Researcher";
  avatarUrl: string;
  currentSubject: SubjectName;
}

export interface SocraticSession {
  topicId: string;
  messages: Message[];
  conceptMastery: number;
  knowledgeLevels: KnowledgeLevels;
  currentLevel: KnowledgeLevelKey;
  difficultyTier: DifficultyTier;
  activeMisconception: MisconceptionState | null;
  trackedMisconceptions: TrackedMisconception[];
  analyzingLogic: boolean;
  askedQuestionIds: string[];
  socraticQuestions: string[];
}
