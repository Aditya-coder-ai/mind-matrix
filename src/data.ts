import { 
  TopicNode, 
  Reflection, 
  StudentProfile, 
  MisconceptionState, 
  SubjectName,
  DEFAULT_KNOWLEDGE_LEVELS,
  MASTERED_KNOWLEDGE_LEVELS,
  AssessmentQuestion,
  KnowledgeGraphEdge,
  TrackedMisconception
} from "./types";

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: "Alex Mercer",
  role: "Student",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3T7Vwnhck1OyiWHA3S5BkOQbpX78yYMpcfHEuizZD_IMTQEOh-KAXo7l_LPH-7GCWTSsljyLmkqGpkUc-XxjI1UZjc1tqieObXzUrerrmOXW1yOdnEaK9WCu42APL4J4ZGrXTgS7Dw5uXq9SsV75d-RZYTT46kFR9eRaTr1_akAUO0vmBaLNgYTiLESKl6x-9tLKnqTI6S08SJ0XN5D8lGqeBkMeRUcDmpPuF06f-fq7N8iyxCO3rAjTZaH3Mnn01aphdS3Nszt3n",
  currentSubject: "Chemistry"
};

export const INITIAL_TOPIC_NODES: TopicNode[] = [
  // CHEMISTRY CURRICULUM
  {
    id: "algebra-chem",
    name: "Algebra Basics",
    subject: "Chemistry",
    category: "Foundations",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Fundamental algebraic rearrangement and equation balances required for basic chemical calculation.",
    icon: "calculator",
    x: 200,
    y: 200
  },
  {
    id: "mole-concept",
    name: "Mole Concept",
    subject: "Chemistry",
    category: "Stoichiometry",
    mastery: 35,
    knowledgeLevels: { recall: 60, understanding: 40, application: 20, analysis: 10, reflection: 45 },
    difficultyTier: "beginner",
    status: "active",
    description: "The molar bridge relating macroscopic mass in grams to the microscopic quantity of discrete particles (atoms, molecules).",
    icon: "forum",
    x: 450,
    y: 350
  },
  {
    id: "limiting-chem",
    name: "Limiting Reactants",
    subject: "Chemistry",
    category: "Stoichiometry",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Identifying which reagent limits chemical output and calculating excess reagent surplus.",
    icon: "box",
    x: 750,
    y: 250
  },
  {
    id: "percent-yield-chem",
    name: "Percent Yield",
    subject: "Chemistry",
    category: "Stoichiometry",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Measuring theoretical stoichiometry yields against actual laboratory output percentages.",
    icon: "trending-up",
    x: 650,
    y: 500
  },

  // PHYSICS CURRICULUM
  {
    id: "vector-addition",
    name: "Vector Addition",
    subject: "Physics",
    category: "Mechanics",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Combining vector components to analyze resulting net directional forces.",
    icon: "check_circle",
    x: 180,
    y: 180
  },
  {
    id: "mass-weight",
    name: "Mass vs Weight",
    subject: "Physics",
    category: "Mechanics",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Differentiating internal invariant mass from gravitationally variant local weight.",
    icon: "check_circle",
    x: 250,
    y: 320
  },
  {
    id: "newtons-laws-intro",
    name: "Newton's Laws",
    subject: "Physics",
    category: "Mechanics",
    mastery: 55,
    knowledgeLevels: { recall: 80, understanding: 60, application: 40, analysis: 30, reflection: 65 },
    difficultyTier: "intermediate",
    status: "active",
    description: "Understanding inertia, net forces, and mutual action-reaction pairs in motion.",
    icon: "model_training",
    x: 450,
    y: 350
  },
  {
    id: "newtons-second-law",
    name: "Newton's Second Law",
    subject: "Physics",
    category: "Mechanics",
    mastery: 35,
    knowledgeLevels: { recall: 70, understanding: 50, application: 30, analysis: 10, reflection: 15 },
    difficultyTier: "beginner",
    status: "active",
    description: "Applying force and acceleration relationships (F = ma) across horizontal, vertical, and inclined planes.",
    icon: "error",
    x: 650,
    y: 500
  },
  {
    id: "fluid-mechanics",
    name: "Fluid Mechanics",
    subject: "Physics",
    category: "Dynamics",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Concepts of fluid density, pressure distributions at varying depths, and buoyancy principles.",
    icon: "water_drop",
    x: 750,
    y: 250
  },

  // MATHEMATICS CURRICULUM
  {
    id: "functions-math",
    name: "Algebra Functions",
    subject: "Mathematics",
    category: "Calculus Pathway",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Properties of variable functions, domain restrictions, and algebraic equations.",
    icon: "calculator",
    x: 200,
    y: 200
  },
  {
    id: "limits-math",
    name: "Limits & Continuity",
    subject: "Mathematics",
    category: "Calculus Pathway",
    mastery: 60,
    knowledgeLevels: { recall: 90, understanding: 75, application: 50, analysis: 40, reflection: 45 },
    difficultyTier: "intermediate",
    status: "active",
    description: "Approaching continuous convergence and analyzing infinite bounds as variables converge on specific points.",
    icon: "trending-up",
    x: 450,
    y: 350
  },
  {
    id: "derivatives-math",
    name: "Differential Calculus",
    subject: "Mathematics",
    category: "Calculus Pathway",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Calculating precise rates of change and derivatives across mathematical polynomial slopes.",
    icon: "model_training",
    x: 750,
    y: 250
  },
  {
    id: "integrals-math",
    name: "Integral Calculus",
    subject: "Mathematics",
    category: "Calculus Pathway",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Measuring area summations under curvature slopes to accumulate progressive change factors.",
    icon: "insights",
    x: 650,
    y: 500
  },

  // DSA CURRICULUM
  {
    id: "arrays-dsa",
    name: "Arrays & Strings",
    subject: "DSA",
    category: "Linear Structures",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Contiguous memory allocation, indexing, sliding window, and two-pointer traversal patterns.",
    icon: "list",
    x: 200,
    y: 200
  },
  {
    id: "linked-lists-dsa",
    name: "Linked Lists",
    subject: "DSA",
    category: "Linear Structures",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Singly and doubly linked node chains with pointer manipulation, reversal, and cycle detection.",
    icon: "link",
    x: 250,
    y: 320
  },
  {
    id: "trees-dsa",
    name: "Trees & BST",
    subject: "DSA",
    category: "Hierarchical Structures",
    mastery: 50,
    knowledgeLevels: { recall: 80, understanding: 60, application: 50, analysis: 30, reflection: 30 },
    difficultyTier: "intermediate",
    status: "active",
    description: "Binary trees, binary search trees, DFS/BFS traversals, balanced tree rotations, and height optimization.",
    icon: "git-branch",
    x: 450,
    y: 350
  },
  {
    id: "graphs-dsa",
    name: "Graph Algorithms",
    subject: "DSA",
    category: "Non-Linear Structures",
    mastery: 20,
    knowledgeLevels: { recall: 40, understanding: 20, application: 10, analysis: 10, reflection: 20 },
    difficultyTier: "beginner",
    status: "active",
    description: "Adjacency representations, BFS/DFS, shortest path (Dijkstra, Bellman-Ford), topological sort, and MST algorithms.",
    icon: "network",
    x: 650,
    y: 500
  },
  {
    id: "dp-dsa",
    name: "Dynamic Programming",
    subject: "DSA",
    category: "Optimization",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "Overlapping subproblem decomposition, memoization tables, and bottom-up tabulation for optimal substructure.",
    icon: "layers",
    x: 750,
    y: 250
  },

  // DBMS CURRICULUM
  {
    id: "relational-model-dbms",
    name: "Relational Model",
    subject: "DBMS",
    category: "Foundations",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "Tables, tuples, attributes, keys, and the mathematical foundations of relational algebra.",
    icon: "table",
    x: 200,
    y: 200
  },
  {
    id: "sql-queries-dbms",
    name: "SQL Queries",
    subject: "DBMS",
    category: "Query Language",
    mastery: 100,
    knowledgeLevels: { ...MASTERED_KNOWLEDGE_LEVELS },
    difficultyTier: "advanced",
    status: "mastered",
    description: "SELECT, JOIN, GROUP BY, subqueries, aggregate functions, and set operations for data retrieval.",
    icon: "terminal",
    x: 250,
    y: 320
  },
  {
    id: "normalization-dbms",
    name: "Normalization",
    subject: "DBMS",
    category: "Schema Design",
    mastery: 40,
    knowledgeLevels: { recall: 60, understanding: 50, application: 30, analysis: 20, reflection: 40 },
    difficultyTier: "intermediate",
    status: "active",
    description: "Functional dependencies, 1NF through BCNF decomposition, lossless joins, and dependency preservation.",
    icon: "filter",
    x: 450,
    y: 350
  },
  {
    id: "transactions-dbms",
    name: "Transactions & Concurrency",
    subject: "DBMS",
    category: "Transaction Management",
    mastery: 15,
    knowledgeLevels: { recall: 30, understanding: 15, application: 10, analysis: 10, reflection: 10 },
    difficultyTier: "beginner",
    status: "active",
    description: "ACID properties, serializability, two-phase locking, deadlock detection, and isolation levels.",
    icon: "lock",
    x: 650,
    y: 500
  },
  {
    id: "indexing-dbms",
    name: "Indexing & Optimization",
    subject: "DBMS",
    category: "Performance",
    mastery: 0,
    knowledgeLevels: { ...DEFAULT_KNOWLEDGE_LEVELS },
    difficultyTier: "beginner",
    status: "pending",
    description: "B+ tree indices, hash indexing, query execution plans, cost estimation, and optimizer strategies.",
    icon: "zap",
    x: 750,
    y: 250
  }
];

export const INITIAL_MISCONCEPTIONS: Record<string, MisconceptionState> = {
  "mole-concept": {
    title: "Confuses Mass with Moles",
    description: "Student is equating macroscopic property (weight/mass) directly with the discrete particle count (moles), missing the molar mass conversion bridge.",
    suggestedPractice: "Focus on scenarios involving unit dimension analysis to map mass scales to Avogadro calculations.",
    prerequisites: ["Algebra Basics", "Dimensional Analysis"]
  },
  "newtons-second-law": {
    title: "F=ma Context Error",
    description: "You successfully apply the formula in horizontal planes, but struggle to isolate net forces when vertical gravity and normal forces interact.",
    suggestedPractice: "Focus on scenarios involving Vertical Motion and inclined planes to master net force calculation before applying the formula.",
    prerequisites: ["Vector Addition", "Mass vs Weight"]
  },
  "limits-math": {
    title: "Confuses Limit with Value",
    description: "The student treats the limiting value of a function at point c as identical to f(c), missing boundary holes or localized jump discontinuities.",
    suggestedPractice: "Practice evaluating discontinuous piecewise functions where the local limit differs from the concrete point value.",
    prerequisites: ["Algebra Functions", "Interval Notation"]
  },
  "trees-dsa": {
    title: "Confuses BST Property with Heap Order",
    description: "Student applies max-heap ordering logic to BST insertion, placing larger values as left children instead of right, breaking the invariant.",
    suggestedPractice: "Trace BST insertion step-by-step on paper for 10 random sequences, verifying the in-order traversal yields sorted output.",
    prerequisites: ["Arrays & Strings", "Linked Lists"]
  },
  "graphs-dsa": {
    title: "Incorrect BFS/DFS Termination",
    description: "Student fails to maintain a visited set during graph traversal, causing infinite loops on cyclic graphs and incorrect shortest-path results.",
    suggestedPractice: "Implement BFS on a cyclic undirected graph and trace the visited set at each dequeue step.",
    prerequisites: ["Trees & BST", "Arrays & Strings"]
  },
  "normalization-dbms": {
    title: "Misidentifies Functional Dependencies",
    description: "Student confuses partial dependencies with transitive dependencies, leading to incorrect decomposition from 2NF to 3NF.",
    suggestedPractice: "Given a set of FDs, practice drawing the dependency diagram and identifying which FDs violate each normal form.",
    prerequisites: ["Relational Model", "SQL Queries"]
  },
  "transactions-dbms": {
    title: "Confuses Serializability with Serial Execution",
    description: "Student believes all concurrent schedules must execute serially to be correct, missing the concept of conflict-equivalent interleaving.",
    suggestedPractice: "Construct precedence graphs for sample schedules and determine conflict serializability without converting to serial order.",
    prerequisites: ["Relational Model", "SQL Queries"]
  }
};

export const INITIAL_REFLECTIONS: Reflection[] = [
  {
    id: "ref-1",
    topicId: "mole-concept",
    topicName: "Mole Concept",
    question: "What was the hardest part of solving the stoichiometry problem today?",
    answer: "I kept mixing up the formulas of grams and moles. I initially thought the heavier object would displace more water simply because of its mass, ignoring volume entirely.",
    feedback: "A crucial realization. You successfully shifted your mental model from mass-dependency to volume-dependency in buoyancy. This marks significant progress in conceptualizing density.",
    date: "2026-05-27T19:49:08Z"
  }
];

export const SUBJECT_COGNITIVE_friction: Record<SubjectName, Array<{ concept: string; impact: "High Impact" | "Moderate" | "Emerging"; percentage: number; color: string }>> = {
  Chemistry: [
    { concept: "Unit Conversion (Moles to Grams)", impact: "High Impact", percentage: 75, color: "bg-red-500" },
    { concept: "Limiting Reactant Determination", impact: "Moderate", percentage: 45, color: "bg-purple-500" },
    { concept: "Molar Excess Ratios", impact: "Emerging", percentage: 20, color: "bg-gray-400" }
  ],
  Physics: [
    { concept: "Vertical Normal Force Balance", impact: "High Impact", percentage: 70, color: "bg-red-500" },
    { concept: "Conservation of Mechanical Energy", impact: "Moderate", percentage: 45, color: "bg-purple-500" },
    { concept: "Fluid Statics (Buoyancy principles)", impact: "Emerging", percentage: 20, color: "bg-gray-400" }
  ],
  Mathematics: [
    { concept: "Removable Jump Discontinuities", impact: "High Impact", percentage: 80, color: "bg-red-500" },
    { concept: "One-Sided Vertical Bound Limits", impact: "Moderate", percentage: 50, color: "bg-purple-500" },
    { concept: "Infinite Bounds of Conjugate Ratios", impact: "Emerging", percentage: 15, color: "bg-gray-400" }
  ],
  DSA: [
    { concept: "BST Insertion Order Invariant", impact: "High Impact", percentage: 72, color: "bg-red-500" },
    { concept: "Graph Cycle Detection (Visited Set)", impact: "Moderate", percentage: 48, color: "bg-purple-500" },
    { concept: "DP State Transition Formulation", impact: "Emerging", percentage: 18, color: "bg-gray-400" }
  ],
  DBMS: [
    { concept: "Partial vs Transitive FD Confusion", impact: "High Impact", percentage: 68, color: "bg-red-500" },
    { concept: "Conflict Serializability Analysis", impact: "Moderate", percentage: 42, color: "bg-purple-500" },
    { concept: "B+ Tree Fanout Estimation", impact: "Emerging", percentage: 12, color: "bg-gray-400" }
  ]
};

export const INITIAL_CHAT: Record<string, string> = {
  "mole-concept": "Before we calculate the moles of this substance, can you explain what a mole represents in chemistry? Think about how we relate mass to the number of particles.",
  "newtons-second-law": "Excellent. To calculate acceleration, we must state how mass aggregates forces. If an object is placed on an incline, which forces comprise the net force sum?",
  "limits-math": "As a variable x approaches a value c, why does the value of the function f(x) not necessarily have to equal f(c)? Consider what a hole in a graph represents.",
  "trees-dsa": "When we insert a new value into a Binary Search Tree, what invariant must hold at every node? Walk me through inserting the value 7 into a BST containing [5, 3, 8, 1, 4].",
  "graphs-dsa": "If you run BFS on a graph with cycles but forget to track visited nodes, what happens? Can you trace through a simple 4-node cyclic graph to show me?",
  "normalization-dbms": "Consider a relation R(A, B, C, D) with FDs {A→B, B→C, A→D}. Is this in 2NF? What about 3NF? Walk me through your reasoning step by step.",
  "transactions-dbms": "Two transactions T1 and T2 both read and write to items X and Y in an interleaved schedule. How do you determine if this schedule is conflict-serializable without actually running it serially?"
};

// ─── NEW: AI Assessment Engine Data ─────────────────────────────────────────

export const QUESTION_BANK: Record<string, AssessmentQuestion[]> = {
  "arrays-dsa": [
    {
      id: "q_arr_recall",
      topicId: "arrays-dsa",
      level: "recall",
      question: "What is an array in programming?",
      expectedAnswer: "An array is a data structure consisting of a collection of elements, each identified by at least one array index or key.",
      hints: ["Think about how multiple items are stored together.", "How are items accessed in a list?"]
    },
    {
      id: "q_arr_understanding",
      topicId: "arrays-dsa",
      level: "understanding",
      question: "What happens when you call `push()` on an array?",
      codeSnippet: "const nums = [1, 2, 3];\nnums.push(4);",
      expectedAnswer: "[1, 2, 3, 4] - The item is added to the end of the array.",
      hints: ["Where does the new element go?", "Does it change the original array?"]
    },
    {
      id: "q_arr_application",
      topicId: "arrays-dsa",
      level: "application",
      question: "How would you add 'React' to this array?",
      codeSnippet: "const skills = ['HTML', 'CSS'];",
      expectedAnswer: "skills.push('React');",
      hints: ["Use an array method to append an item."]
    },
    {
      id: "q_arr_analysis",
      topicId: "arrays-dsa",
      level: "analysis",
      question: "What is wrong with this code if the intent is to remove 'CSS'?",
      codeSnippet: "const skills = ['HTML', 'CSS'];\nskills.pop('CSS');",
      expectedAnswer: "pop() removes the last element and takes no arguments, so passing 'CSS' is ignored.",
      hints: ["Look up the documentation for pop()", "Does pop() take arguments?"]
    },
    {
      id: "q_arr_reflection",
      topicId: "arrays-dsa",
      level: "reflection",
      question: "Which array operations do you find most confusing and why?",
      hints: ["Reflect honestly on your struggles."]
    }
  ]
};

export const INITIAL_TRACKED_MISCONCEPTIONS: TrackedMisconception[] = [
  {
    id: "misc-1",
    topicId: "mole-concept",
    concept: "Mole Concept",
    type: "Mass vs Moles",
    description: "Equating macroscopic property (weight/mass) directly with discrete particle count.",
    severity: 0.8,
    occurrences: 2,
    firstSeen: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastSeen: new Date().toISOString(),
    resolved: false
  }
];

export const KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = [
  // Chemistry
  { from: "algebra-chem", to: "mole-concept", weight: 0.9 },
  { from: "mole-concept", to: "limiting-chem", weight: 1.0 },
  { from: "mole-concept", to: "percent-yield-chem", weight: 0.8 },
  // Physics
  { from: "vector-addition", to: "newtons-laws-intro", weight: 0.9 },
  { from: "mass-weight", to: "newtons-laws-intro", weight: 0.7 },
  { from: "newtons-laws-intro", to: "newtons-second-law", weight: 1.0 },
  { from: "newtons-laws-intro", to: "fluid-mechanics", weight: 0.5 },
  // Math
  { from: "functions-math", to: "limits-math", weight: 0.9 },
  { from: "limits-math", to: "derivatives-math", weight: 1.0 },
  { from: "limits-math", to: "integrals-math", weight: 0.8 },
  // DSA
  { from: "arrays-dsa", to: "linked-lists-dsa", weight: 0.6 },
  { from: "arrays-dsa", to: "trees-dsa", weight: 0.4 },
  { from: "linked-lists-dsa", to: "trees-dsa", weight: 0.8 },
  { from: "trees-dsa", to: "graphs-dsa", weight: 0.9 },
  { from: "trees-dsa", to: "dp-dsa", weight: 0.3 },
  // DBMS
  { from: "relational-model-dbms", to: "sql-queries-dbms", weight: 0.7 },
  { from: "relational-model-dbms", to: "normalization-dbms", weight: 0.9 },
  { from: "sql-queries-dbms", to: "normalization-dbms", weight: 0.4 },
  { from: "normalization-dbms", to: "transactions-dbms", weight: 0.3 },
  { from: "normalization-dbms", to: "indexing-dbms", weight: 0.5 }
];
