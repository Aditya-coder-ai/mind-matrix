# Testing Guide - AI Knowledge Assessment & Socratic Tutoring Engine

**Server:** http://localhost:3002  
**Date:** May 31, 2026

---

## 🧪 Quick Start Testing

### 1. Launch the Application
```bash
cd Mind-matrix
npm run dev
```
Open browser to http://localhost:3002

---

## 📋 Feature Testing Checklist

### ✅ Test 1: Multi-Level Knowledge Assessment

**Steps:**
1. Navigate to **Chat** screen (should be default or click Chat in sidebar)
2. Look for the **"Target Level"** badge above the chat (e.g., "Target Level: Understanding")
3. Send a message: "A mole is just the weight of something"
4. Observe the AI response
5. Check the **right sidebar** - you should see 5 mastery bars:
   - Recall
   - Understanding (should be highlighted as current)
   - Application
   - Analysis
   - Reflection
6. Send another message and watch the bars update

**Expected Results:**
- ✅ Target level indicator visible
- ✅ Current level highlighted in sidebar
- ✅ Individual level bars show different percentages
- ✅ Bars animate when updated
- ✅ Overall mastery changes based on level updates

---

### ✅ Test 2: Knowledge Profile Dashboard

**Steps:**
1. Click **"Knowledge Profile"** in the sidebar (should have a BarChart3 icon)
2. Observe the radar chart (5-axis spider chart)
3. Scroll down to see the **Active Misconceptions** section
4. Check the **Level-by-Level Breakdown** table at the bottom

**Expected Results:**
- ✅ Radar chart displays with 5 axes (Recall, Understanding, Application, Analysis, Reflection)
- ✅ Misconceptions listed with severity bars
- ✅ Occurrence counts visible
- ✅ Table shows all topics with per-level percentages
- ✅ Color coding: green (>80%), amber (50-80%), red (<30%)

---

### ✅ Test 3: Misconception Tracking

**Steps:**
1. Go to **Chat** screen
2. Select "Mole Concept" topic (Chemistry)
3. Give an intentionally wrong answer: "Mass and moles are the same thing"
4. Check the **sidebar badge** on "Knowledge Profile" nav item
5. Look at the **Active Misconception** card in the chat sidebar
6. Navigate to **Knowledge Profile** to see full misconception details

**Expected Results:**
- ✅ Badge appears on Knowledge Profile nav item with count
- ✅ Misconception card appears in chat sidebar (red border)
- ✅ Misconception type and description displayed
- ✅ Severity bar shows impact level
- ✅ Occurrence count increments if repeated
- ✅ Full list visible in Knowledge Profile screen

---

### ✅ Test 4: Adaptive Difficulty System

**Steps:**
1. In **Chat** screen, answer several questions correctly
2. Check the session state (you can inspect in browser DevTools: localStorage → mindmatrix_sessions)
3. Look for `difficultyTier` field
4. Continue answering correctly to see it change from "beginner" → "intermediate" → "advanced"

**Expected Results:**
- ✅ Difficulty tier starts at "beginner" for new topics
- ✅ Tier increases with high accuracy (>80%)
- ✅ Tier decreases with low accuracy (<50%)
- ✅ AI adjusts question complexity accordingly

---

### ✅ Test 5: Knowledge Graph & Cascade Warnings

**Steps:**
1. Navigate to **Mastery Map** screen
2. Observe the **SVG edges** connecting nodes
3. **Hover** over a node to see:
   - Mini radar chart tooltip
   - Mastery percentage
4. **Click** on a node with low mastery (e.g., "Mole Concept")
5. Check the **right sidebar** for "Cascade Warnings" section
6. Look at edge colors:
   - Green = strong prerequisite (>80%)
   - Amber = weak prerequisite (40-80%)
   - Red = failing prerequisite (<40%)

**Expected Results:**
- ✅ Edges render dynamically from graph data
- ✅ Edge colors reflect prerequisite strength
- ✅ Hover shows mini radar chart
- ✅ Cascade warnings list dependent topics
- ✅ Impact severity calculated correctly
- ✅ Prerequisites listed with status indicators

---

### ✅ Test 6: Socratic Guidance & Hints

**Steps:**
1. In **Chat** screen, click the **"I'm stuck"** button (bottom right)
2. Observe the hint that appears above the input box
3. Send a message and look for **Socratic follow-up questions** in the AI response
4. Click the **X** button to dismiss the hint

**Expected Results:**
- ✅ Hint appears in a light blue box with lightbulb icon
- ✅ Hint provides guidance without revealing answer
- ✅ AI responses include follow-up questions
- ✅ Hint can be dismissed
- ✅ Multiple hints can be requested

---

### ✅ Test 7: Dashboard Enhancements

**Steps:**
1. Navigate to **Dashboard** screen
2. Check the **Mastery Trajectory** graph (top left)
3. Look at **Cognitive Friction** card (top right)
4. Scroll to **Recommended Pathway** section
5. Check **Recent Reflections** at the bottom

**Expected Results:**
- ✅ Trajectory graph shows learning progression
- ✅ Friction areas listed with severity bars
- ✅ Top 3 misconceptions displayed
- ✅ Pathway cards show active/pending topics
- ✅ "Launch Quick Assessment" button visible
- ✅ Reflections displayed with mentor feedback

---

### ✅ Test 8: Data Persistence

**Steps:**
1. Make some changes:
   - Send chat messages
   - Update mastery scores
   - Trigger misconceptions
2. **Refresh the page** (F5 or Ctrl+R)
3. Check that all data persists:
   - Chat history
   - Mastery scores
   - Misconceptions
   - Knowledge levels

**Expected Results:**
- ✅ All chat messages preserved
- ✅ Mastery scores unchanged
- ✅ Misconceptions still tracked
- ✅ Knowledge levels maintained
- ✅ No data loss on refresh

---

### ✅ Test 9: Theme Compatibility

**Steps:**
1. Open browser DevTools (F12)
2. Toggle between light and dark mode (if your OS supports it)
3. Check all screens for visual consistency

**Expected Results:**
- ✅ All components readable in both modes
- ✅ Colors adapt appropriately
- ✅ Borders and backgrounds visible
- ✅ No contrast issues

---

### ✅ Test 10: Subject Switching

**Steps:**
1. Navigate to **Settings** screen
2. Change the **Current Subject** (e.g., Chemistry → Physics)
3. Go back to **Dashboard**
4. Check **Mastery Map**
5. Verify **Knowledge Profile**

**Expected Results:**
- ✅ All screens update to show new subject
- ✅ Topic nodes change in Mastery Map
- ✅ Knowledge Profile shows new subject data
- ✅ Misconceptions filtered by subject
- ✅ Dashboard shows relevant topics

---

## 🎯 Advanced Testing Scenarios

### Scenario A: Complete Assessment Flow

1. Select a topic with low mastery (e.g., "Limiting Reactants")
2. Navigate to Chat
3. Observe starting level (should be "Recall")
4. Answer 2-3 questions correctly
5. Watch level progress to "Understanding"
6. Continue through all 5 levels
7. Check Knowledge Profile to see updated radar chart

**Expected:** Progressive advancement through all 5 cognitive levels

---

### Scenario B: Misconception Resolution

1. Trigger a misconception by giving wrong answers
2. Note the occurrence count
3. Give 3 consecutive correct answers on that topic
4. Check if misconception is marked as resolved

**Expected:** Misconception severity decreases, eventually marked resolved

---

### Scenario C: Prerequisite Cascade

1. Go to Mastery Map
2. Select "Algebra Basics" (Chemistry) - a prerequisite
3. Artificially lower its mastery (via chat interactions)
4. Click on "Mole Concept" (depends on Algebra)
5. Check cascade warnings

**Expected:** Warning shows "Poor understanding of Algebra Basics may affect: Mole Concept"

---

### Scenario D: Voice Input (Browser Dependent)

1. In Chat screen, click the **microphone icon**
2. Allow microphone permissions
3. Speak a question
4. Observe text appearing in input box

**Expected:** Speech-to-text works (Chrome/Edge best support)

---

## 🔍 API Endpoint Testing

### Test /api/chat
```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "mole-concept",
    "message": "What is a mole?",
    "history": [],
    "currentLevel": "recall"
  }'
```

**Expected Response:**
```json
{
  "mentorPrompt": "...",
  "conceptMastery": 45,
  "knowledgeLevelUpdate": {
    "level": "recall",
    "delta": 5
  },
  "detectedMisconceptions": [],
  "socraticQuestions": ["...", "..."],
  "difficultyRecommendation": "beginner"
}
```

---

### Test /api/assess
```bash
curl -X POST http://localhost:3002/api/assess \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "mole-concept",
    "sessionData": {}
  }'
```

**Expected Response:**
```json
{
  "concept": "mole-concept",
  "mastery": 50,
  "knowledgeLevels": {
    "recall": 60,
    "understanding": 50,
    "application": 40,
    "analysis": 30,
    "reflection": 45
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "misconceptions": ["..."],
  "nextFocus": ["..."]
}
```

---

### Test /api/generate-question
```bash
curl -X POST http://localhost:3002/api/generate-question \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "mole-concept",
    "level": "application",
    "difficultyTier": "intermediate",
    "misconceptionContext": "Confuses mass with moles"
  }'
```

**Expected Response:**
```json
{
  "question": "...",
  "codeSnippet": "...",
  "expectedAnswer": "...",
  "hints": ["...", "..."]
}
```

---

### Test /api/hint
```bash
curl -X POST http://localhost:3002/api/hint \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "mole-concept",
    "history": [],
    "currentLevel": "understanding"
  }'
```

**Expected Response:**
```json
{
  "hint": "Think about the relationship between mass and particle count..."
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Server won't start
**Solution:** Check if port 3000-3002 is in use. Server will auto-increment to next available port.

### Issue 2: TypeScript errors
**Solution:** Run `npx tsc --noEmit` to check for type errors. All should pass.

### Issue 3: Misconceptions not appearing
**Solution:** Make sure you're giving clearly wrong answers. Try: "Mass and moles are the same"

### Issue 4: Knowledge Profile shows no data
**Solution:** Interact with chat first to generate data. Initial state has some seed data.

### Issue 5: Voice input not working
**Solution:** Check browser permissions. Works best in Chrome/Edge. Safari may have limitations.

---

## 📊 Performance Benchmarks

### Expected Performance:
- **Page Load:** <2 seconds
- **Chat Response:** 1-3 seconds (depends on Gemini API)
- **Screen Transitions:** <300ms
- **Graph Rendering:** <500ms
- **localStorage Save:** <50ms

### Bundle Sizes:
- **JavaScript:** 432KB (130KB gzipped)
- **CSS:** 42.8KB (7.8KB gzipped)
- **Total:** ~475KB (~138KB gzipped)

---

## ✅ Final Verification Checklist

Before considering testing complete, verify:

- [ ] All 5 subjects work (Chemistry, Physics, Math, DSA, DBMS)
- [ ] All 5 knowledge levels track independently
- [ ] Misconceptions appear and track occurrences
- [ ] Difficulty adjusts based on performance
- [ ] Knowledge graph renders with colored edges
- [ ] Cascade warnings appear for weak prerequisites
- [ ] Hints provide guidance without answers
- [ ] Data persists across page refresh
- [ ] All API endpoints respond correctly
- [ ] No console errors in browser DevTools
- [ ] TypeScript compilation passes
- [ ] Build succeeds without errors
- [ ] Theme works in light and dark mode
- [ ] Mobile responsive (test on smaller viewport)

---

## 🎓 User Acceptance Testing

### Student Perspective:
1. Can I see my progress across different cognitive levels?
2. Do I understand which areas need improvement?
3. Are misconceptions clearly explained?
4. Does the difficulty feel appropriate?
5. Do hints help without giving away answers?
6. Can I track my learning over time?

### Educator Perspective:
1. Does the system accurately assess student understanding?
2. Are misconceptions detected reliably?
3. Is the knowledge graph useful for planning?
4. Does the Socratic method guide discovery?
5. Is the data visualization clear and actionable?

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Feature Tests:
[ ] Multi-Level Assessment
[ ] Knowledge Profile
[ ] Misconception Tracking
[ ] Adaptive Difficulty
[ ] Knowledge Graph
[ ] Socratic Guidance
[ ] Dashboard
[ ] Data Persistence
[ ] Theme Compatibility
[ ] Subject Switching

Issues Found:
1. ___________
2. ___________
3. ___________

Overall Status: PASS / FAIL
Notes: ___________
```

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Deploy to production
   - Monitor user feedback
   - Track performance metrics

2. **If issues found:**
   - Document in GitHub Issues
   - Prioritize by severity
   - Fix and re-test

3. **Future enhancements:**
   - Add more seed questions
   - Implement PostgreSQL migration
   - Add multi-LLM support
   - Build gamification features

---

**Happy Testing! 🎉**

*For questions or issues, refer to IMPLEMENTATION_SUMMARY.md*
