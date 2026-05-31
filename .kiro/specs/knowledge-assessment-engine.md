# AI Knowledge Assessment & Socratic Tutoring Engine

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Created:** 2026-05-31  
**Last Updated:** 2026-05-31  
**Implementation Completed:** 2026-05-31

---

## Executive Summary

Transform the existing Mind-matrix Socratic AI platform into a full-fledged personalized learning engine with:
- **Multi-level knowledge assessment** (5 cognitive levels: Recall → Understanding → Application → Analysis → Reflection)
- **Dynamic misconception tracking** with severity scoring and occurrence history
- **Adaptive difficulty system** that adjusts based on student performance
- **Knowledge graph-driven learning** with prerequisite cascade effects
- **Structured assessment flow** with progressive checkpoints
- **Enhanced Socratic questioning framework** for guided discovery

---

## Architecture Decisions

### ✅ Confirmed Decisions

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| **Subjects** | All 5 existing subjects (Chemistry, Physics, Math, DSA, DBMS) | Apply 5-level assessment model universally across all domains |
| **Persistence** | Firestore now, PostgreSQL + pgvector later | Firestore already wired up; minimize infrastructure complexity for MVP |
| **LLM Backend** | Gemini 3.5 Flash now, provider abstraction for future | Already working; enhance system instructions for multi-level assessment |
| **Question Bank** | Hybrid approach (seed + AI-generated) | Hand-authored starter questions with AI-generated follow-ups for quality + flexibility |

---

## Current State Analysis

### Existing Capabilities
- ✅ 5 subjects with topic nodes and mastery scores
- ✅ Socratic Chat with Gemini AI + pedagogical fallbacks
- ✅ Mastery Map visualization with SVG graph edges
- ✅ Reflections journaling with mentor feedback
- ✅ Settings (theme toggle, curriculum switcher, voice selection)
- ✅ Firebase initialized (Firestore converters defined but not actively used)
- ✅ Basic misconception tracking (single misconception per topic, static)

### Key Gaps

| Requirement | Current State | Gap Severity |
|------------|---------------|--------------|
| 5 Knowledge Levels (Recall → Reflection) | Single mastery % per topic | **Major** |
| Misconception Database with severity/occurrences | Static `INITIAL_MISCONCEPTIONS` map | **Major** |
| Adaptive Question Flow (progressive checkpoints) | No structured question generation | **Major** |
| Socratic Questioning Framework | Partially implemented (chat + hints) | **Medium** |
| Knowledge Graph with prerequisite cascading | SVG edges exist, no data model | **Medium** |
| Adaptive Difficulty System | Not implemented | **Major** |
| AI Evaluation Output (structured report) | `conceptMastery` returned from API | **Medium** |
| Knowledge Profile with per-concept breakdown | Single mastery % | **Major** |

---

## Requirements

### 1. Multi-Level Knowledge Assessment System

#### 1.1 Five Cognitive Levels (Bloom's Taxonomy Inspired)

**REQ-1.1.1:** The system SHALL track mastery across 5 distinct cognitive levels for each topic:

| Level | Description | Score Range | Example Assessment |
|-------|-------------|-------------|-------------------|
| **Recall** | Memory and syntax recognition | 0-100 | "What is an array?" |
| **Understanding** | Conceptual comprehension | 0-100 | "Explain what happens when you call push()" |
| **Application** | Independent usage / coding | 0-100 | "Write code to add an element to an array" |
| **Analysis** | Debugging and reasoning | 0-100 | "What's wrong with this code?" |
| **Reflection** | Metacognition and self-awareness | 0-100 | "Which array operations confuse you and why?" |

**REQ-1.1.2:** Each topic node SHALL maintain:
- Individual scores for all 5 levels (0-100 scale)
- An aggregate mastery score computed as the weighted average of all levels
- Historical progression data for each level

**REQ-1.1.3:** The system SHALL display:
- Current level being assessed in the chat interface
- Per-level mastery bars in the sidebar
- Progress stepper showing advancement through levels

**REQ-1.1.4:** Default starting values:
- All levels initialize at 20/100 for new topics
- Mastered topics show 100/100 across all levels

---

### 2. Dynamic Misconception Tracking System

#### 2.1 Misconception Database

**REQ-2.1.1:** The system SHALL track misconceptions with the following attributes:
- `id`: Unique identifier
- `topicId`: Parent topic node ID
- `concept`: Human-readable concept area
- `type`: Specific misconception category (e.g., "Squaring vs Doubling")
- `description`: Detailed explanation of the misconception
- `severity`: Float 0.0-1.0 indicating impact on learning
- `occurrences`: Integer count of how many times detected
- `firstSeen`: ISO timestamp of first detection
- `lastSeen`: ISO timestamp of most recent detection
- `resolved`: Boolean indicating if student has overcome it

**REQ-2.1.2:** Misconception Detection:
- AI SHALL analyze student responses for common misconceptions
- System SHALL increment occurrence count when same misconception reappears
- System SHALL update severity based on frequency and recency
- System SHALL mark misconceptions as resolved after 3 consecutive correct responses in that area

**REQ-2.1.3:** Misconception Display:
- Show active misconception count badge in navigation
- Display expandable list of misconceptions with severity bars
- Color-code by severity: High (red), Moderate (amber), Emerging (gray)
- Show occurrence count and date range for each

**REQ-2.1.4:** Misconception Reinforcement:
- When same misconception appears ≥2 times, generate targeted reinforcement questions
- Prioritize addressing high-severity misconceptions in question flow

---

### 3. Adaptive Question Flow Engine

#### 3.1 Question Bank Structure

**REQ-3.1.1:** The system SHALL maintain a question bank with:
- Seed questions hand-authored for core topics (minimum 5 questions per topic covering all levels)
- AI-generated supplementary questions created dynamically
- Each question tagged with: `topicId`, `level`, `difficulty tier`, `hints[]`

**REQ-3.1.2:** Question Selection Logic:
- Target the weakest knowledge level for the current topic
- Consider difficulty tier based on recent performance
- Incorporate misconception context for targeted reinforcement
- Follow progressive flow: Recall → Understanding → Application → Analysis → Reflection

#### 3.2 Adaptive Difficulty System

**REQ-3.2.1:** The system SHALL support 3 difficulty tiers:
- **Beginner**: Fundamentals + guided hints + Socratic questioning
- **Intermediate**: Mix of explanations + coding + light debugging
- **Advanced**: Complex coding + debugging + edge cases

**REQ-3.2.2:** Difficulty Adjustment Rules:
- High accuracy (>80% in last 5 questions) → advance to harder tier
- Medium accuracy (50-80%) → maintain current tier
- Low accuracy (<50%) → reduce to easier tier

**REQ-3.2.3:** Each topic node SHALL track current `difficultyTier`

#### 3.3 Assessment Flow

**REQ-3.3.1:** "Start Assessment" button SHALL:
- Initialize structured question flow for current topic
- Display knowledge level indicator above chat
- Show progress through 5 levels with visual stepper
- Generate questions targeting weakest areas

**REQ-3.3.2:** Question Flow Management:
- Minimum 2 questions per level before advancing
- Require 70% accuracy to progress to next level
- Allow revisiting lower levels if performance drops
- Track assessment session history

---

### 4. Enhanced Socratic Questioning Framework

#### 4.1 Guided Discovery

**REQ-4.1.1:** AI responses SHALL include:
- `socraticQuestions[]`: Array of follow-up questions for guided discovery
- Numbered prompts student can click to explore
- Scaffolded hints that don't reveal answers directly

**REQ-4.1.2:** Hint System Enhancement:
- Include current knowledge level in hint generation context
- Implement progressive hint disclosure (3 levels: gentle → moderate → strong)
- Track hint usage per question for difficulty adjustment

**REQ-4.1.3:** Socratic Dialogue Patterns:
- Ask clarifying questions before providing corrections
- Encourage student to explain their reasoning
- Guide toward self-discovery rather than direct instruction
- Validate partial understanding before building further

---

### 5. Knowledge Graph & Prerequisite Cascading

#### 5.1 Knowledge Graph Data Model

**REQ-5.1.1:** The system SHALL maintain a directed graph with:
- Nodes: Topic IDs
- Edges: Prerequisite relationships with weight (0-1 influence strength)
- Formalized in `KNOWLEDGE_GRAPH_EDGES` array

**REQ-5.1.2:** Graph Structure:
```typescript
interface KnowledgeGraphEdge {
  from: string;    // prerequisite topic ID
  to: string;      // dependent topic ID
  weight: number;  // 0-1 influence strength
}
```

#### 5.2 Cascade Effects

**REQ-5.2.1:** Prerequisite Impact Rules:
- Weakness in prerequisite (mastery <50%) SHALL reduce confidence in dependent topics
- Impact magnitude = prerequisite_deficit × edge_weight
- Display cascade warnings: "Poor understanding of X may affect: Y, Z"

**REQ-5.2.2:** Mastery Map Visualization:
- Edge coloring: green (strong prerequisite met), amber (weak), red (failing)
- Hover on node → highlight all downstream affected nodes
- Show mini radar chart per node tooltip (5-level breakdown)
- Display prerequisite cascade warnings in detail panel

---

### 6. AI Evaluation & Knowledge Profile

#### 6.1 Structured AI Evaluation Output

**REQ-6.1.1:** `/api/assess` endpoint SHALL return:
```typescript
interface AIEvaluationOutput {
  concept: string;
  mastery: number;          // Overall computed from levels
  knowledgeLevels: KnowledgeLevels;
  strengths: string[];
  weaknesses: string[];
  misconceptions: string[];
  nextFocus: string[];
}
```

**REQ-6.1.2:** Evaluation Triggers:
- After completing assessment flow for a topic
- On-demand via "Generate Report" button
- Automatically after every 10 chat interactions

#### 6.2 Knowledge Profile Screen (NEW)

**REQ-6.2.1:** A new "Knowledge Profile" tab SHALL display:

1. **Radar Chart** (per topic):
   - 5-axis spider chart (Recall/Understanding/Application/Analysis/Reflection)
   - SVG-based rendering
   - Color-coded by mastery level

2. **Misconception Tracker**:
   - Scrollable list of active misconceptions
   - Severity bars with color coding
   - Occurrence counts and date ranges
   - Resolution status indicators

3. **Mastery Heatmap**:
   - Grid: all topics × all levels
   - Color-coded cells by mastery percentage
   - Hover tooltips with exact scores

4. **Strengths & Weaknesses Summary**:
   - AI-generated cards highlighting top 3 strengths
   - Top 3 weaknesses with recommended focus areas
   - Actionable next steps

5. **Learning Progression Timeline**:
   - Historical mastery snapshots over time
   - Line chart showing level progression
   - Milestone markers for achievements

**REQ-6.2.2:** Design Language:
- Continue existing Geist + Source Serif typography
- Primary-container accent colors
- Dot-pattern background
- Rounded-none card borders
- Uppercase mono labels

---

### 7. Backend API Enhancements

#### 7.1 Enhanced `/api/chat` Endpoint

**REQ-7.1.1:** Request body SHALL include:
- `currentLevel`: Which cognitive level is being assessed
- `difficultyTier`: Current difficulty setting
- `misconceptionContext`: Array of active misconceptions

**REQ-7.1.2:** Response SHALL include:
```typescript
{
  reply: string;
  conceptMastery: number;
  knowledgeLevelUpdate: {
    level: KnowledgeLevelKey;
    delta: number;  // -20 to +20
  };
  detectedMisconceptions: Array<{
    type: string;
    severity: number;
    description: string;
  }>;
  socraticQuestions: string[];
  difficultyRecommendation: DifficultyTier;
}
```

**REQ-7.1.3:** System Instruction Enhancement:
- Include all 5 knowledge levels and assessment criteria
- Provide examples of each level's question types
- Define misconception detection patterns
- Specify Socratic questioning guidelines

#### 7.2 New `/api/assess` Endpoint

**REQ-7.2.1:** Accepts:
- `topicId`: Topic to evaluate
- `sessionHistory`: Recent chat messages and responses

**REQ-7.2.2:** Returns:
- Structured `AIEvaluationOutput` object
- Comprehensive evaluation report for Knowledge Profile

#### 7.3 New `/api/generate-question` Endpoint

**REQ-7.3.1:** Accepts:
- `topicId`: Target topic
- `level`: Target knowledge level
- `difficultyTier`: Difficulty setting
- `misconceptionContext`: Active misconceptions to address

**REQ-7.3.2:** Returns:
- Dynamically generated `AssessmentQuestion`
- Tailored to student's weak areas
- Includes hints and expected answer patterns

#### 7.4 Enhanced `/api/hint` Endpoint

**REQ-7.4.1:** Include current knowledge level in hint generation
**REQ-7.4.2:** Implement 3-tier progressive hint disclosure
**REQ-7.4.3:** Return Socratic scaffolding questions instead of direct answers

---

### 8. Data Persistence

#### 8.1 LocalStorage (MVP)

**REQ-8.1.1:** Persist to localStorage:
- Topic nodes with knowledge levels
- Tracked misconceptions array
- Assessment session history
- Difficulty tier per topic
- Evaluation reports

**REQ-8.1.2:** Auto-save triggers:
- After each chat message
- After knowledge level updates
- After misconception detection
- On page unload

#### 8.2 Firestore (Future Migration)

**REQ-8.2.1:** Firestore converters already defined SHALL be used for:
- User profiles
- Topic progress
- Misconception history
- Reflection entries
- Assessment reports

**REQ-8.2.2:** Migration path:
- Keep localStorage as primary for MVP
- Add Firestore sync as optional enhancement
- Implement conflict resolution for offline/online sync

---

### 9. UI/UX Enhancements

#### 9.1 ChatScreen Modifications

**REQ-9.1.1:** Add above chat area:
- Knowledge Level indicator (current level being assessed)
- Progress stepper (5 levels with completion status)
- "Start Assessment" button

**REQ-9.1.2:** Right sidebar enhancements:
- Replace single mastery meter with 5 per-level bars
- Add active misconception count badge
- Expandable misconception list

**REQ-9.1.3:** Socratic guidance display:
- Show numbered prompts when AI returns `socraticQuestions[]`
- Clickable prompts that insert question into chat
- Visual distinction from regular messages

#### 9.2 Sidebar Navigation

**REQ-9.2.1:** Add "Knowledge Profile" nav item:
- Icon: `BarChart3`
- Badge showing total active misconceptions
- Position: between "Mastery Map" and "Reflections"

#### 9.3 Dashboard Enhancements

**REQ-9.3.1:** Replace static trajectory graph with:
- Real data from `knowledgeLevels` history
- Multi-line chart (one line per level)
- Time-based x-axis

**REQ-9.3.2:** Add new cards:
- "Quick Assessment" card (launches 5-question flow)
- Top 3 misconceptions with severity indicators
- "Knowledge Level Breakdown" mini-chart for active topic

#### 9.4 MasteryMap Enhancements

**REQ-9.4.1:** Dynamic edge rendering from `KNOWLEDGE_GRAPH_EDGES`
**REQ-9.4.2:** Edge coloring based on prerequisite strength
**REQ-9.4.3:** Hover effects showing cascade impact
**REQ-9.4.4:** Mini radar chart tooltips per node

#### 9.5 Reflections Integration

**REQ-9.5.1:** Integrate Level 5 (Reflection) assessment:
- Reflection prompt becomes part of structured assessment
- Track reflection quality score
- Update Reflection knowledge level based on depth of response

---

### 10. Assessment Engine Logic

#### 10.1 Core Algorithm (AssessmentEngine.ts)

**REQ-10.1.1:** Pure logic module (no React) SHALL implement:

1. **Next Question Level Selection**:
   - Identify weakest knowledge level for current topic
   - Return next level to assess

2. **Difficulty Tier Determination**:
   - Calculate recent accuracy (last 5 questions)
   - Apply adjustment rules (REQ-3.2.2)
   - Return recommended difficulty tier

3. **Question Flow Management**:
   - Enforce minimum questions per level
   - Check advancement criteria (70% accuracy)
   - Handle level regression on poor performance

4. **Misconception Reinforcement**:
   - Detect repeated misconceptions (≥2 occurrences)
   - Generate targeted questions addressing specific misconceptions
   - Track resolution progress

5. **Prerequisite Cascade Calculation**:
   - Traverse knowledge graph from weak prerequisite
   - Calculate impact on dependent topics
   - Return affected topic IDs with impact scores

**REQ-10.1.2:** Module exports:
```typescript
export class AssessmentEngine {
  selectNextLevel(knowledgeLevels: KnowledgeLevels): KnowledgeLevelKey;
  determineDifficulty(recentAccuracy: number[]): DifficultyTier;
  shouldAdvanceLevel(levelHistory: QuestionResult[]): boolean;
  calculateCascadeImpact(topicId: string, graph: KnowledgeGraphEdge[]): CascadeImpact[];
  selectNextQuestion(context: AssessmentContext): AssessmentQuestion;
}
```

---

## Success Criteria

### Functional Requirements

✅ **FR-1:** Student can start a structured assessment for any topic and progress through all 5 knowledge levels

✅ **FR-2:** System accurately tracks and displays per-level mastery scores for each topic

✅ **FR-3:** Misconceptions are automatically detected, tracked with severity, and displayed in UI

✅ **FR-4:** Difficulty adjusts dynamically based on student performance (3-tier system)

✅ **FR-5:** Knowledge Profile screen displays radar charts, heatmaps, and misconception tracker

✅ **FR-6:** Prerequisite weaknesses trigger cascade warnings on dependent topics

✅ **FR-7:** AI provides Socratic guidance with follow-up questions instead of direct answers

✅ **FR-8:** All state persists to localStorage and survives page refresh

### Non-Functional Requirements

✅ **NFR-1:** Type safety - all new types compile without errors (`npx tsc --noEmit`)

✅ **NFR-2:** Performance - assessment flow responds within 2 seconds per question

✅ **NFR-3:** Accessibility - all new components meet WCAG 2.1 AA standards

✅ **NFR-4:** Theme compatibility - all components work in light and dark mode

✅ **NFR-5:** Mobile responsive - Knowledge Profile screen adapts to mobile viewports

---

## Out of Scope (Future Enhancements)

- ❌ Multi-user support (single student profile for MVP)
- ❌ Real-time collaboration features
- ❌ Video/audio content integration
- ❌ Gamification (badges, leaderboards)
- ❌ Export reports to PDF
- ❌ Integration with external LMS platforms
- ❌ Voice-based assessment (text-only for MVP)
- ❌ PostgreSQL + pgvector migration (Firestore ready, but localStorage for MVP)
- ❌ Multi-LLM provider switching (Gemini only for MVP)

---

## Verification Plan

### Automated Tests

1. **Dev server starts**: `npm run dev` — verify no TypeScript errors
2. **Type checking**: `npx tsc --noEmit` — verify all new types compile
3. **API endpoints**: Test `/api/chat`, `/api/assess`, `/api/generate-question` with curl
4. **Build verification**: `npm run build` — verify production build succeeds

### Manual Verification

1. **Knowledge Profile Screen**: Navigate to new tab, verify radar chart renders with correct data
2. **Multi-level Assessment**: Start chat, send answers, verify level-specific mastery updates
3. **Misconception Tracking**: Intentionally give wrong answers, verify misconceptions appear with severity
4. **Adaptive Difficulty**: Answer correctly multiple times, verify difficulty increases
5. **Knowledge Graph Cascade**: Lower a prerequisite score, verify dependent topics show warnings
6. **Persistence**: Refresh the page, verify all state persists via localStorage
7. **Theme Compatibility**: Test all new components in both light and dark mode
8. **Socratic Flow**: Verify AI asks follow-up questions instead of giving direct answers
9. **Assessment Flow**: Complete full 5-level assessment, verify progression logic
10. **Hint System**: Request hints at different levels, verify progressive disclosure

---

## Dependencies

### External Libraries (Already Installed)
- React 19
- TypeScript
- TailwindCSS 4
- Vite
- Express
- @google/generative-ai (Gemini)
- Firebase SDK

### New Dependencies (None Required)
- All features implementable with existing stack

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| AI evaluation inconsistency | Medium | High | Implement structured prompts with examples; validate outputs |
| Question bank insufficient coverage | Medium | Medium | Start with seed questions; AI generates supplements |
| Performance degradation with large history | Low | Medium | Implement pagination; limit stored history to last 100 interactions |
| LocalStorage size limits | Low | Low | Monitor storage usage; implement cleanup of old data |
| Misconception detection false positives | Medium | Medium | Require multiple occurrences before flagging; allow manual dismissal |

---

## Implementation Phases

### Phase 1: Type System & Data Model (Foundation)
- Extend types.ts with new interfaces
- Update data.ts with question bank and graph edges
- Verify type compilation

### Phase 2: Backend API Enhancement
- Enhance `/api/chat` with multi-level assessment
- Implement `/api/assess` endpoint
- Implement `/api/generate-question` endpoint
- Enhance `/api/hint` endpoint

### Phase 3: Assessment Engine Logic
- Create AssessmentEngine.ts module
- Implement level selection algorithm
- Implement difficulty adjustment logic
- Implement cascade calculation

### Phase 4: Knowledge Profile Screen
- Create KnowledgeProfileScreen.tsx
- Implement radar chart component
- Implement misconception tracker
- Implement mastery heatmap

### Phase 5: Chat & UI Enhancements
- Add knowledge level indicator to ChatScreen
- Add per-level mastery bars
- Add "Start Assessment" flow
- Display Socratic guidance prompts

### Phase 6: Integration & Polish
- Wire AssessmentEngine into App.tsx
- Add localStorage persistence
- Update Sidebar with new nav item
- Enhance Dashboard with real data
- Update MasteryMap with graph rendering

---

## Open Questions

> **Q1:** Should we implement a "confidence score" separate from mastery percentage?  
> **Recommendation:** Not for MVP. Mastery percentage is sufficient; confidence can be inferred from consistency.

> **Q2:** How many questions should a "Quick Assessment" include?  
> **Recommendation:** 5 questions (1 per level) for quick assessment; full assessment is 10+ questions (2+ per level).

> **Q3:** Should misconceptions auto-resolve or require manual confirmation?  
> **Recommendation:** Auto-resolve after 3 consecutive correct responses in that area; allow manual "Mark as Resolved" button.

> **Q4:** Should we track time spent per question for analytics?  
> **Recommendation:** Yes, add `timeSpent` field to question results for future analytics, but don't display in MVP.

---

## Glossary

- **Knowledge Level**: One of 5 cognitive assessment dimensions (Recall, Understanding, Application, Analysis, Reflection)
- **Difficulty Tier**: One of 3 complexity levels (Beginner, Intermediate, Advanced)
- **Misconception**: A persistent incorrect understanding tracked with severity and occurrence count
- **Cascade Effect**: Impact of prerequisite weakness on dependent topics in knowledge graph
- **Socratic Questioning**: Guided discovery through questions rather than direct instruction
- **Assessment Flow**: Structured progression through all 5 knowledge levels for a topic
- **Mastery Score**: Aggregate score (0-100) computed from all 5 knowledge levels

---

## References

- Bloom's Taxonomy: https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/
- Socratic Method: https://en.wikipedia.org/wiki/Socratic_method
- Knowledge Graphs: https://en.wikipedia.org/wiki/Knowledge_graph
- Misconception-Based Learning: https://www.edutopia.org/article/addressing-student-misconceptions

---

**Next Steps:**
1. Review and approve requirements
2. Proceed to Design phase (system architecture, component diagrams, data flow)
3. Break down into implementation tasks
4. Begin Phase 1 implementation
