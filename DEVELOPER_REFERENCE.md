# Developer Reference - AI Knowledge Assessment Engine

Quick reference for developers working on the Mind-matrix platform.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  React 19 + TypeScript + TailwindCSS 4 + Motion             │
├─────────────────────────────────────────────────────────────┤
│  App.tsx (State Manager)                                    │
│    ├── ChatScreen (Multi-level assessment UI)               │
│    ├── KnowledgeProfileScreen (Radar + Heatmap)            │
│    ├── MasteryMapScreen (Graph visualization)               │
│    ├── DashboardScreen (Overview + Trajectory)              │
│    ├── ReflectionsScreen (Journaling)                       │
│    └── SettingsScreen (Preferences)                         │
├─────────────────────────────────────────────────────────────┤
│  AssessmentEngine.ts (Pure logic module)                    │
│    ├── getTargetCognitiveLevel()                            │
│    ├── getAdaptiveDifficulty()                              │
│    ├── calculatePrerequisiteImpact()                        │
│    └── applyKnowledgeUpdate()                               │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  Express + Gemini 3.5 Flash                                 │
├─────────────────────────────────────────────────────────────┤
│  POST /api/chat (Enhanced Socratic dialogue)                │
│  POST /api/assess (Evaluation reports)                      │
│  POST /api/generate-question (Dynamic questions)            │
│  POST /api/hint (Progressive hints)                         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  localStorage (MVP) + Firestore (Ready)                     │
├─────────────────────────────────────────────────────────────┤
│  mindmatrix_profile                                          │
│  mindmatrix_nodes                                            │
│  mindmatrix_sessions                                         │
│  mindmatrix_misconceptions                                   │
│  mindmatrix_reflections                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Core Data Types

### KnowledgeLevels
```typescript
interface KnowledgeLevels {
  recall: number;        // 0-100
  understanding: number; // 0-100
  application: number;   // 0-100
  analysis: number;      // 0-100
  reflection: number;    // 0-100
}
```

### TopicNode
```typescript
interface TopicNode {
  id: string;
  name: string;
  subject: SubjectName;
  category: string;
  mastery: number;                    // Computed aggregate
  knowledgeLevels: KnowledgeLevels;   // Per-level breakdown
  difficultyTier: DifficultyTier;     // beginner | intermediate | advanced
  status: "mastered" | "active" | "pending";
  description: string;
  icon: string;
  x: number;  // Graph position
  y: number;  // Graph position
}
```

### TrackedMisconception
```typescript
interface TrackedMisconception {
  id: string;
  topicId: string;
  concept: string;
  type: string;
  description: string;
  severity: number;      // 0.0 - 1.0
  occurrences: number;
  firstSeen: string;     // ISO date
  lastSeen: string;      // ISO date
  resolved: boolean;
}
```

### SocraticSession
```typescript
interface SocraticSession {
  topicId: string;
  messages: Message[];
  conceptMastery: number;
  knowledgeLevels: KnowledgeLevels;
  currentLevel: KnowledgeLevelKey;
  difficultyTier: DifficultyTier;
  activeMisconception: MisconceptionState | null;
  trackedMisconceptions: TrackedMisconception[];
  analyzingLogic: boolean;
}
```

### KnowledgeGraphEdge
```typescript
interface KnowledgeGraphEdge {
  from: string;    // prerequisite topic ID
  to: string;      // dependent topic ID
  weight: number;  // 0-1 influence strength
}
```

---

## 🎯 Key Algorithms

### 1. Mastery Calculation
```typescript
// Weighted average of all 5 levels
mastery = (recall × 0.10) + 
          (understanding × 0.20) + 
          (application × 0.30) + 
          (analysis × 0.30) + 
          (reflection × 0.10)
```

### 2. Target Level Selection
```typescript
// Returns the weakest cognitive level
function getTargetCognitiveLevel(levels: KnowledgeLevels): KnowledgeLevelKey {
  const sorted = Object.entries(levels).sort((a, b) => a[1] - b[1]);
  return sorted[0][1] >= 90 ? "reflection" : sorted[0][0];
}
```

### 3. Difficulty Adjustment
```typescript
function getAdaptiveDifficulty(mastery: number): DifficultyTier {
  if (mastery < 40) return "beginner";
  if (mastery < 80) return "intermediate";
  return "advanced";
}
```

### 4. Prerequisite Cascade
```typescript
function calculatePrerequisiteImpact(
  topicId: string, 
  currentMastery: number, 
  graphEdges: KnowledgeGraphEdge[]
) {
  if (currentMastery >= 50) return [];
  
  return graphEdges
    .filter(edge => edge.from === topicId)
    .map(edge => ({
      dependentTopic: edge.to,
      impactSeverity: edge.weight * (50 - currentMastery) / 50
    }));
}
```

---

## 🔌 API Contracts

### POST /api/chat

**Request:**
```typescript
{
  topicId: string;
  message: string;
  history: Message[];
  currentLevel: KnowledgeLevelKey;
}
```

**Response:**
```typescript
{
  mentorPrompt: string;
  conceptMastery: number;
  knowledgeLevelUpdate: {
    level: KnowledgeLevelKey;
    delta: number;  // -20 to +20
  };
  detectedMisconceptions: Array<{
    type: string;
    description: string;
    severity: number;
  }>;
  socraticQuestions: string[];
  difficultyRecommendation: DifficultyTier;
  suggestedPractice?: string;
  prerequisites?: string[];
}
```

---

### POST /api/assess

**Request:**
```typescript
{
  topicId: string;
  sessionData: any;
}
```

**Response:**
```typescript
{
  concept: string;
  mastery: number;
  knowledgeLevels: KnowledgeLevels;
  strengths: string[];
  weaknesses: string[];
  misconceptions: string[];
  nextFocus: string[];
}
```

---

### POST /api/generate-question

**Request:**
```typescript
{
  topicId: string;
  level: KnowledgeLevelKey;
  difficultyTier: DifficultyTier;
  misconceptionContext?: string;
}
```

**Response:**
```typescript
{
  question: string;
  codeSnippet?: string;
  expectedAnswer?: string;
  hints: string[];
}
```

---

### POST /api/hint

**Request:**
```typescript
{
  topicId: string;
  history: Message[];
  currentLevel: KnowledgeLevelKey;
}
```

**Response:**
```typescript
{
  hint: string;
}
```

---

## 🎨 Design Tokens

### Colors
```typescript
// Primary
primary-navy: #1a1a2e
primary-container: #7033FF
on-primary: #ffffff

// Surface
surface-card: rgba(255, 255, 255, 0.95)
surface-container: rgba(255, 255, 255, 0.8)
surface-container-low: rgba(255, 255, 255, 0.6)
surface-container-high: rgba(255, 255, 255, 1.0)

// Outline
outline-variant: rgba(79, 0, 255, 0.15)

// Academic
academic-red: #ff3366
academic-red-container: rgba(255, 51, 102, 0.1)
academic-green-light: #00e673
academic-green-dark: #064e3b
```

### Typography
```typescript
// Font Families
font-sans: "Geist Sans"
font-serif: "Source Serif 4"
font-mono: "Geist Mono"

// Font Sizes
text-[9px]   // Labels
text-[10px]  // Small labels
text-xs      // 12px
text-sm      // 14px
text-base    // 16px
text-lg      // 18px
text-xl      // 20px
text-3xl     // 30px
text-4xl     // 36px

// Tracking
tracking-[0.15em]  // Tight
tracking-[0.2em]   // Normal
tracking-[0.25em]  // Wide
tracking-widest    // Extra wide
```

### Spacing
```typescript
// Padding/Margin
p-4   // 1rem (16px)
p-5   // 1.25rem (20px)
p-6   // 1.5rem (24px)
p-8   // 2rem (32px)

// Gaps
gap-1.5  // 0.375rem (6px)
gap-2    // 0.5rem (8px)
gap-4    // 1rem (16px)
gap-6    // 1.5rem (24px)
gap-8    // 2rem (32px)
```

---

## 🔧 Common Tasks

### Adding a New Subject

1. **Update types.ts:**
```typescript
export type SubjectName = "Chemistry" | "Physics" | "Mathematics" | "DSA" | "DBMS" | "NewSubject";
```

2. **Add topics to data.ts:**
```typescript
{
  id: "new-topic",
  name: "New Topic",
  subject: "NewSubject",
  category: "Category",
  mastery: 0,
  knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
  difficultyTier: "beginner",
  status: "pending",
  description: "...",
  icon: "icon-name",
  x: 200,
  y: 200
}
```

3. **Add graph edges:**
```typescript
{ from: "prerequisite-id", to: "new-topic", weight: 0.8 }
```

4. **Add to SUBJECT_THEMES in DashboardScreen.tsx**

---

### Adding a New Knowledge Level

1. **Update KnowledgeLevels interface:**
```typescript
interface KnowledgeLevels {
  recall: number;
  understanding: number;
  application: number;
  analysis: number;
  reflection: number;
  newLevel: number;  // Add here
}
```

2. **Update mastery calculation:**
```typescript
const newMastery = Math.round(
  (levels.recall * 0.10) +
  (levels.understanding * 0.20) +
  (levels.application * 0.30) +
  (levels.analysis * 0.30) +
  (levels.reflection * 0.10) +
  (levels.newLevel * 0.XX)  // Adjust weights
);
```

3. **Update UI components to display new level**

---

### Adding Seed Questions

**In data.ts:**
```typescript
export const QUESTION_BANK: Record<string, AssessmentQuestion[]> = {
  "topic-id": [
    {
      id: "q_topic_recall",
      topicId: "topic-id",
      level: "recall",
      question: "What is X?",
      expectedAnswer: "X is...",
      hints: ["Think about...", "Consider..."]
    },
    // Add more questions for each level
  ]
};
```

---

### Customizing AI System Instructions

**In server.ts:**
```typescript
const systemInstruction = 
  "You are Socratic AI, an intellectual STEM Socratic Mentor. " +
  "Your mission is to help students learn by asking guiding questions. " +
  // Add custom instructions here
  "Return a JSON object with: mentorPrompt, conceptMastery, ...";
```

---

## 🐛 Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('mindmatrix_nodes')
localStorage.getItem('mindmatrix_sessions')
localStorage.getItem('mindmatrix_misconceptions')
```

### Clear localStorage
```javascript
localStorage.clear()
// Then refresh page
```

### Check API responses
```javascript
// In browser DevTools > Network tab
// Filter by "api"
// Click on request to see payload and response
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Build errors
```bash
npm run build
```

---

## 📊 Performance Optimization

### Bundle Size Reduction
- Use dynamic imports for large components
- Lazy load screens not immediately needed
- Tree-shake unused dependencies

### API Response Time
- Cache frequent queries
- Implement request debouncing
- Use streaming for long responses

### Rendering Performance
- Memoize expensive calculations
- Use React.memo for pure components
- Virtualize long lists

---

## 🔐 Security Considerations

### API Key Protection
- Never commit `.env` file
- Use environment variables
- Rotate keys regularly

### Input Validation
- Sanitize user input before sending to API
- Validate response schemas
- Handle malformed data gracefully

### XSS Prevention
- Use React's built-in escaping
- Avoid dangerouslySetInnerHTML
- Sanitize markdown if rendering

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npx tsc --noEmit         # Type check

# Testing
curl -X POST http://localhost:3002/api/chat -H "Content-Type: application/json" -d '{...}'

# Debugging
npm run dev -- --debug   # Start with debug logging
```

---

## 🔗 Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/types.ts` | Type definitions | ~200 |
| `src/data.ts` | Initial data & constants | ~500 |
| `src/App.tsx` | Main app & state management | ~400 |
| `src/AssessmentEngine.ts` | Core logic module | ~120 |
| `server.ts` | Express API server | ~300 |
| `src/components/ChatScreen.tsx` | Chat interface | ~350 |
| `src/components/KnowledgeProfileScreen.tsx` | Profile dashboard | ~380 |
| `src/components/MasteryMapScreen.tsx` | Graph visualization | ~450 |
| `src/components/DashboardScreen.tsx` | Overview screen | ~400 |

---

## 🎓 Learning Resources

### React 19
- [React Docs](https://react.dev)
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### TailwindCSS 4
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind v4 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)

### Gemini API
- [Gemini API Docs](https://ai.google.dev/docs)
- [Gemini Node.js SDK](https://www.npmjs.com/package/@google/genai)

---

## 🤝 Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Keep components under 500 lines

### Commit Messages
```
feat: Add new knowledge level
fix: Resolve misconception tracking bug
docs: Update API documentation
refactor: Simplify mastery calculation
test: Add unit tests for AssessmentEngine
```

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Run type check and build
4. Test manually
5. Submit PR with description

---

## 📞 Support

For questions or issues:
1. Check IMPLEMENTATION_SUMMARY.md
2. Review TESTING_GUIDE.md
3. Inspect browser console for errors
4. Check server logs
5. Review API responses in Network tab

---

**Last Updated:** May 31, 2026  
**Version:** 1.0.0  
**Maintainer:** Development Team
