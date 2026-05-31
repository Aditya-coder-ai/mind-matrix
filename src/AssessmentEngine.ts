import { 
  TopicNode, 
  KnowledgeLevels, 
  KnowledgeLevelKey, 
  DifficultyTier, 
  TrackedMisconception,
  AssessmentQuestion
} from "./types";
import { QUESTION_BANK } from "./data";

export class AssessmentEngine {
  
  /**
   * Identifies the weakest cognitive level for a given topic node.
   */
  static getTargetCognitiveLevel(levels: KnowledgeLevels): KnowledgeLevelKey {
    const sortedLevels: [KnowledgeLevelKey, number][] = [
      ["recall", levels.recall],
      ["understanding", levels.understanding],
      ["application", levels.application],
      ["analysis", levels.analysis],
      ["reflection", levels.reflection]
    ];
    
    // Sort ascending by mastery
    sortedLevels.sort((a, b) => a[1] - b[1]);
    
    // Return the lowest one, or if they are all very high, pick reflection to encourage deep thought
    if (sortedLevels[0][1] >= 90) return "reflection";
    return sortedLevels[0][0];
  }

  /**
   * Computes the adaptive difficulty based on aggregate mastery.
   */
  static getAdaptiveDifficulty(mastery: number): DifficultyTier {
    if (mastery < 40) return "beginner";
    if (mastery < 80) return "intermediate";
    return "advanced";
  }

  static getSeedQuestion(
    topicId: string, 
    level: KnowledgeLevelKey, 
    activeMisconceptions: TrackedMisconception[],
    askedQuestionIds: string[] = []
  ): AssessmentQuestion | null {
    const topicBank = QUESTION_BANK[topicId];
    if (!topicBank) return null;

    const unaskedQuestions = topicBank.filter(q => q.level === level && !askedQuestionIds.includes(q.id));
    if (unaskedQuestions.length === 0) return null;

    // Return the first unasked question
    return unaskedQuestions[0];
  }

  /**
   * Computes prerequisite decay.
   * If a student fails a fundamental concept (mastery drops < 50%),
   * we logically assume dependent concepts might be weaker.
   */
  static calculatePrerequisiteImpact(topicId: string, currentMastery: number, graphEdges: any[]) {
    if (currentMastery >= 50) return [];
    
    return graphEdges
      .filter(edge => edge.from === topicId)
      .map(edge => ({
        dependentTopic: edge.to,
        impactSeverity: edge.weight * (50 - currentMastery) / 50
      }));
  }

  /**
   * Updates a specific knowledge level after a Socratic interaction.
   * Calculates the new aggregate mastery.
   */
  static applyKnowledgeUpdate(
    currentLevels: KnowledgeLevels, 
    update: { level: string, delta: number }
  ): { newLevels: KnowledgeLevels, newMastery: number } {
    
    const VALID_KEYS: KnowledgeLevelKey[] = ["recall", "understanding", "application", "analysis", "reflection"];
    const validLevel = update.level as KnowledgeLevelKey;
    const newLevels = { ...currentLevels };
    
    if (VALID_KEYS.includes(validLevel)) {
      newLevels[validLevel] = Math.max(0, Math.min(100, newLevels[validLevel] + update.delta));
    }

    // New mastery is a weighted average
    // Recall(10%), Understanding(20%), Application(30%), Analysis(30%), Reflection(10%)
    const newMastery = Math.round(
      (newLevels.recall * 0.10) +
      (newLevels.understanding * 0.20) +
      (newLevels.application * 0.30) +
      (newLevels.analysis * 0.30) +
      (newLevels.reflection * 0.10)
    );

    return { newLevels, newMastery };
  }
}
