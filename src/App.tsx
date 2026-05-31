import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_TOPIC_NODES, 
  INITIAL_REFLECTIONS, 
  INITIAL_MISCONCEPTIONS,
  INITIAL_CHAT,
  INITIAL_TRACKED_MISCONCEPTIONS
} from "./data";
import { 
  StudentProfile, 
  TopicNode, 
  Reflection, 
  Message, 
  SocraticSession,
  TrackedMisconception,
  DEFAULT_KNOWLEDGE_LEVELS
} from "./types";
import { AssessmentEngine } from "./AssessmentEngine";
import { db, socraticSessionConverter, topicNodeConverter, auth } from "./firebase";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from "./AuthContext";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardScreen from "./components/DashboardScreen";
import ChatScreen from "./components/ChatScreen";
import MasteryMapScreen from "./components/MasteryMapScreen";
import ReflectionsScreen from "./components/ReflectionsScreen";
import SettingsScreen from "./components/SettingsScreen";
import KnowledgeProfileScreen from "./components/KnowledgeProfileScreen";

// Standard Socratic Pedagogical Responses
const PEDAGOGICAL_FALLBACKS: Record<string, Array<{ userKeywords: string[]; response: any }>> = {
  "mole-concept": [
    {
      userKeywords: ["weight", "mass", "grams", "stuff", "just weight"],
      response: {
        mentorPrompt: "Mass tells us how heavy something is, which is important. But if you have 10 grams of feathers and 10 grams of gold, do they have the same number of individual atoms? How might we count items that are too small to see with a scale?",
        conceptMastery: 40,
        knowledgeLevelUpdate: { level: "understanding", delta: 5 },
        detectedMisconceptions: [{
          type: "Confuses Mass with Moles",
          description: "Student is equating mass (grams) directly with count.",
          severity: 0.8
        }],
        socraticQuestions: [
          "What is the difference between atomic mass and physical mass?",
          "How can we use Avogadro's number here?"
        ],
        difficultyRecommendation: "beginner",
        suggestedPractice: "Focus on unit mass conversions.",
        prerequisites: ["Algebra Basics", "Dimensional Analysis"]
      }
    }
  ]
};

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [dataLoading, setDataLoading] = useState(true);

  // Initialize Gemini AI Client (Client-Side for Spark Plan compatibility)
  const ai = React.useMemo(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
      return new GoogleGenAI(apiKey);
    }
    return null;
  }, []);
  
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [nodes, setNodes] = useState<TopicNode[]>(INITIAL_TOPIC_NODES);
  const [reflections, setReflections] = useState<Reflection[]>(INITIAL_REFLECTIONS);
  const [trackedMisconceptions, setTrackedMisconceptions] = useState<TrackedMisconception[]>(INITIAL_TRACKED_MISCONCEPTIONS);
  const [sessions, setSessions] = useState<Record<string, SocraticSession>>({});

  const [hintText, setHintText] = useState<string | null>(null);

  // Fetch data from Firestore on login
  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as StudentProfile);
        } else {
          const newProfile = { ...INITIAL_STUDENT_PROFILE, name: user.displayName || "Student" };
          await setDoc(doc(db, "users", user.uid), newProfile);
          setProfile(newProfile);
        }

        const nodesSnap = await getDocs(collection(db, "users", user.uid, "nodes"));
        if (!nodesSnap.empty) {
          setNodes(nodesSnap.docs.map(d => d.data() as TopicNode));
        }

        const reflectionsSnap = await getDocs(collection(db, "users", user.uid, "reflections"));
        if (!reflectionsSnap.empty) {
          setReflections(reflectionsSnap.docs.map(d => d.data() as Reflection));
        }

        const misconceptionsSnap = await getDocs(collection(db, "users", user.uid, "misconceptions"));
        if (!misconceptionsSnap.empty) {
          setTrackedMisconceptions(misconceptionsSnap.docs.map(d => d.data() as TrackedMisconception));
        }

        const sessionsSnap = await getDocs(collection(db, "users", user.uid, "sessions"));
        if (!sessionsSnap.empty) {
          const sessionsData: Record<string, SocraticSession> = {};
          sessionsSnap.docs.forEach(d => {
            sessionsData[d.id] = d.data() as SocraticSession;
          });
          setSessions(sessionsData);
        }
      } catch (e) {
        console.error("Error fetching data from Firestore", e);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Sync state changes to Firestore (Debounced or selective)
  useEffect(() => {
    if (!user || dataLoading) return;
    localStorage.setItem("mindmatrix_profile", JSON.stringify(profile));
    setDoc(doc(db, "users", user.uid), profile).catch(console.error);
  }, [profile, user, dataLoading]);

  useEffect(() => {
    if (!user || dataLoading) return;
    localStorage.setItem("mindmatrix_nodes", JSON.stringify(nodes));
    // Batch update nodes if needed, but for now we update individual ones in handlers
  }, [nodes, user, dataLoading]);

  useEffect(() => {
    if (!user || dataLoading) return;
    localStorage.setItem("mindmatrix_reflections", JSON.stringify(reflections));
  }, [reflections, user, dataLoading]);

  useEffect(() => {
    if (!user || dataLoading) return;
    localStorage.setItem("mindmatrix_misconceptions", JSON.stringify(trackedMisconceptions));
  }, [trackedMisconceptions, user, dataLoading]);

  useEffect(() => {
    if (!user || dataLoading) return;
    localStorage.setItem("mindmatrix_sessions", JSON.stringify(sessions));
  }, [sessions, user, dataLoading]);

  // Retrieves active node for subject
  const subjectNodes = nodes.filter(n => n.subject === profile.currentSubject);
  const activeNode = subjectNodes.find(n => n.id === "mole-concept" || n.id === "newtons-second-law" || n.id === "limits-math") || subjectNodes[0];
  const [activeTopicId, setActiveTopicId] = useState<string>(activeNode?.id || "mole-concept");

  // Sync activeTopicId when current subject updates
  useEffect(() => {
    const freshNode = nodes.find(n => n.subject === profile.currentSubject && n.status === "active") || nodes.find(n => n.subject === profile.currentSubject);
    if (freshNode) {
      setActiveTopicId(freshNode.id);
    }
    setHintText(null);
  }, [profile.currentSubject, nodes]);

  const currentTopicNode = nodes.find(n => n.id === activeTopicId) || nodes[0];

  // Retrieves or pre-populates session for any selected node
  const getSession = (topicId: string): SocraticSession => {
    if (sessions[topicId]) {
      return sessions[topicId];
    }
    const defaultText = INITIAL_CHAT[topicId] || "How does this concept connect to your core foundations? Let's analyze its proportions.";
    const node = nodes.find(n => n.id === topicId);
    const kl = node?.knowledgeLevels || { ...DEFAULT_KNOWLEDGE_LEVELS };

    return {
      topicId,
      messages: [
        {
          id: `ai-init-${topicId}`,
          sender: "ai",
          text: defaultText,
          timestamp: new Date().toISOString()
        }
      ],
      conceptMastery: node?.mastery || 30,
      knowledgeLevels: kl,
      currentLevel: AssessmentEngine.getTargetCognitiveLevel(kl),
      difficultyTier: AssessmentEngine.getAdaptiveDifficulty(node?.mastery || 30),
      activeMisconception: null,
      trackedMisconceptions: [],
      analyzingLogic: false,
      askedQuestionIds: [],
      socraticQuestions: []
    };
  };

  const currentSession = getSession(activeTopicId);

  // Sends message to Gemini AI (Client-Side for Spark Plan compatibility)
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    
    setSessions(prev => ({
      ...prev,
      [activeTopicId]: {
        ...(prev[activeTopicId] || currentSession),
        messages: [...(prev[activeTopicId]?.messages || currentSession.messages), userMsg],
        analyzingLogic: true
      }
    }));

    setHintText(null);

    let payload: any = null;

    if (ai) {
      try {
        const systemInstruction = 
          "You are Socratic AI, an intellectual STEM Socratic Mentor. " +
          "Your mission is to help students learn by asking guiding Socratic questions. " +
          "You must analyze their reasoning, detect any misconceptions, update their cognitive mastery level, " +
          "and provide follow-up Socratic questions based on their target cognitive level (Recall, Understanding, Application, Analysis, Reflection). " +
          "Return a JSON object with: mentorPrompt, conceptMastery (1-100), knowledgeLevelUpdate (object with level and delta), " +
          "detectedMisconceptions (array), socraticQuestions (array of strings), difficultyRecommendation (beginner|intermediate|advanced), " +
          "suggestedPractice, and prerequisites.";

        let contextMsg = `Student is learning topic: ${activeTopicId}\nTarget Cognitive Level: ${currentSession.currentLevel || "understanding"}`;
        if (currentSession.trackedMisconceptions && currentSession.trackedMisconceptions.length > 0) {
          contextMsg += `\n\nActive misconceptions to address:\n${currentSession.trackedMisconceptions.map((m: any) => `- ${m.type}: ${m.description} (severity: ${m.severity})`).join('\n')}`;
        }

        const historyContents = updatedMessages.map((h) => ({
          role: h.sender === "ai" ? "model" : "user",
          parts: [{ text: h.text }]
        }));

        const model = ai.getGenerativeModel({
          model: "gemini-3.5-flash",
          systemInstruction: systemInstruction,
        });

        const result = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: contextMsg }] },
            ...historyContents
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mentorPrompt: { type: Type.STRING },
                conceptMastery: { type: Type.INTEGER },
                knowledgeLevelUpdate: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING, enum: ["recall", "understanding", "application", "analysis", "reflection"] },
                    delta: { type: Type.INTEGER }
                  }
                },
                detectedMisconceptions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      description: { type: Type.STRING },
                      severity: { type: Type.NUMBER }
                    }
                  }
                },
                socraticQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                difficultyRecommendation: { type: Type.STRING },
                suggestedPractice: { type: Type.STRING },
                prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["mentorPrompt", "conceptMastery"]
            }
          }
        });

        const responseText = result.response.text();
        if (responseText) {
          payload = JSON.parse(responseText.trim());
        }
      } catch (e) {
        console.error("Gemini AI failed", e);
      }
    }

    // Fallback if AI fails or key is missing
    if (!payload) {
      const lowerMsg = text.toLowerCase();
      const fallbacks = PEDAGOGICAL_FALLBACKS[activeTopicId] || [];
      const match = fallbacks.find(f => f.userKeywords.some(kw => lowerMsg.includes(kw)));
      
      if (match) {
        payload = match.response;
      } else {
        payload = {
          mentorPrompt: INITIAL_CHAT[activeTopicId] 
            ? `Regarding ${activeTopicId}: ${INITIAL_CHAT[activeTopicId]} How does your statement align with this?`
            : `Could you elaborate further? How does your reasoning apply to ${activeTopicId}?`,
          conceptMastery: 42,
          knowledgeLevelUpdate: { level: currentSession.currentLevel || "understanding", delta: 2 },
          detectedMisconceptions: [],
          socraticQuestions: ["What would happen in the opposite scenario?", "Can you break down the steps?"],
          difficultyRecommendation: "beginner",
          suggestedPractice: "Rethink your formulation step-by-step.",
          prerequisites: []
        };
      }
    }

    const aiMsg: Message = {
      id: Math.random().toString(),
      sender: "ai",
      text: payload.mentorPrompt,
      timestamp: new Date().toISOString()
    };

    // Update Knowledge Levels & Mastery using AssessmentEngine
    let newLevels = { ...currentSession.knowledgeLevels };
    let newMastery = payload.conceptMastery || currentSession.conceptMastery;
    
    if (payload.knowledgeLevelUpdate) {
      const result = AssessmentEngine.applyKnowledgeUpdate(newLevels, payload.knowledgeLevelUpdate);
      newLevels = result.newLevels;
      newMastery = result.newMastery;
    }

    // Add detected misconceptions to global tracker
    if (payload.detectedMisconceptions && Array.isArray(payload.detectedMisconceptions)) {
      setTrackedMisconceptions(prev => {
        const next = [...prev];
        payload.detectedMisconceptions.forEach((dm: any) => {
          const existing = next.find(m => m.topicId === activeTopicId && m.type === dm.type);
          if (existing) {
            existing.occurrences += 1;
            existing.lastSeen = new Date().toISOString();
            existing.severity = Math.min(1.0, existing.severity + 0.1);
            
            if (user) {
              setDoc(doc(db, "users", user.uid, "misconceptions", existing.id), existing).catch(console.error);
            }
          } else {
            const newMisc: TrackedMisconception = {
              id: `misc-${Math.random()}`,
              topicId: activeTopicId,
              concept: currentTopicNode.name,
              type: dm.type,
              description: dm.description,
              severity: dm.severity || 0.5,
              occurrences: 1,
              firstSeen: new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              resolved: false
            };
            next.push(newMisc);
            
            if (user) {
              setDoc(doc(db, "users", user.uid, "misconceptions", newMisc.id), newMisc).catch(console.error);
            }
          }
        });
        return next;
      });
    }

    const newTargetLevel = AssessmentEngine.getTargetCognitiveLevel(newLevels);
    const newDifficulty = payload.difficultyRecommendation || AssessmentEngine.getAdaptiveDifficulty(newMastery);

    // Get seed question on level change or mastery completion
    let seedQuestion = null;
    if (newTargetLevel !== currentSession.currentLevel || newMastery >= 90) {
      seedQuestion = AssessmentEngine.getSeedQuestion(
        activeTopicId,
        newTargetLevel,
        currentSession.trackedMisconceptions,
        currentSession.askedQuestionIds
      );
    }

    // Sync node mastery
    setNodes(prevNodes => 
      prevNodes.map(n => 
        n.id === activeTopicId 
          ? { ...n, mastery: newMastery, knowledgeLevels: newLevels, status: newMastery >= 90 ? "mastered" : "active" }
          : n
      )
    );

    setSessions(prev => {
      const latestSession = prev[activeTopicId] || currentSession;

      const seedMsg = seedQuestion
        ? { id: `seed-${seedQuestion.id}`, sender: "ai" as const, text: seedQuestion.question, timestamp: new Date().toISOString() }
        : null;

      const nextSession = {
        ...latestSession,
        messages: seedMsg
          ? [...latestSession.messages, aiMsg, seedMsg]
          : [...latestSession.messages, aiMsg],
        conceptMastery: newMastery,
        knowledgeLevels: newLevels,
        currentLevel: newTargetLevel,
        difficultyTier: newDifficulty,
        activeMisconception: payload.detectedMisconceptions?.length > 0 ? {
          title: payload.detectedMisconceptions[0].type,
          description: payload.detectedMisconceptions[0].description,
          suggestedPractice: payload.suggestedPractice || "Re-examine the core principle.",
          prerequisites: payload.prerequisites || []
        } : null,
        analyzingLogic: false,
        socraticQuestions: payload.socraticQuestions || [],
        askedQuestionIds: seedQuestion
          ? [...latestSession.askedQuestionIds, seedQuestion.id]
          : latestSession.askedQuestionIds
      };

      // Background sync to Firestore (no-await)
      if (user) {
        setDoc(
          doc(db, "users", user.uid, "sessions", activeTopicId).withConverter(socraticSessionConverter),
          nextSession
        ).catch(e => console.warn("Firestore sync failed, local state persists.", e));

        // Also sync node update
        const updatedNode = { 
          ...currentTopicNode, 
          mastery: newMastery, 
          knowledgeLevels: newLevels, 
          status: newMastery >= 90 ? "mastered" : "active" 
        };
        setDoc(
          doc(db, "users", user.uid, "nodes", activeTopicId).withConverter(topicNodeConverter),
          updatedNode
        ).catch(console.error);
      }

      return {
        ...prev,
        [activeTopicId]: nextSession
      };
    });
  };

  const handleRequestHint = async () => {
    if (ai) {
      try {
        const hintPrompt = `The student is stuck on topic ${activeTopicId} at cognitive level ${currentSession.currentLevel || "understanding"}. Provide a single, extremely brief guidance hint (1-3 lines) in a warm, encouraging Socratic tone pointing them towards a self-realization. Do not solve it for them! Use Source Serif style.`;
        const model = ai.getGenerativeModel({ model: "gemini-3.5-flash" });
        const result = await model.generateContent(hintPrompt);
        const text = result.response.text();
        if (text) {
          setHintText(text.trim());
          return;
        }
      } catch (err) {
        console.error("Hint generation failed", err);
      }
    }
    setHintText("Focus on unit dimensions and fundamental relations.");
  };

  const handleNavigateToTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setActiveTab("chat");
  };

  const handleUpdateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleAddReflection = (newRef: Omit<Reflection, "id" | "date">) => {
    const logged: Reflection = {
      ...newRef,
      id: `ref-${Math.random()}`,
      date: new Date().toISOString()
    };
    setReflections(prev => [logged, ...prev]);

    if (user) {
      setDoc(doc(db, "users", user.uid, "reflections", logged.id), logged).catch(console.error);
    }

    // Update reflection knowledge level for that topic
    setNodes(prev => prev.map(n => {
      if (n.id === newRef.topicId) {
        const updatedLevels = { ...n.knowledgeLevels, reflection: Math.min(100, n.knowledgeLevels.reflection + 15) };
        const updatedNode = { ...n, knowledgeLevels: updatedLevels };
        
        if (user) {
          setDoc(doc(db, "users", user.uid, "nodes", n.id), updatedNode).catch(console.error);
        }
        
        return updatedNode;
      }
      return n;
    }));
  };

  const currentSubjectMisconceptionsCount = trackedMisconceptions.filter(m => 
    nodes.filter(n => n.subject === profile.currentSubject).some(n => n.id === m.topicId) && !m.resolved
  ).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardScreen
            profile={profile}
            nodes={nodes}
            reflections={reflections}
            trackedMisconceptions={trackedMisconceptions}
            onNavigateToTopic={handleNavigateToTopic}
            onNavigateToReflections={() => setActiveTab("reflections")}
          />
        );
      case "knowledge-profile":
        return (
          <KnowledgeProfileScreen
            profile={profile}
            nodes={nodes}
            trackedMisconceptions={trackedMisconceptions.filter(m => !m.resolved)}
          />
        );
      case "chat":
        return (
          <ChatScreen
            currentNode={currentTopicNode}
            profile={profile}
            messages={currentSession.messages}
            conceptMastery={currentSession.conceptMastery}
            knowledgeLevels={currentSession.knowledgeLevels}
            currentLevel={currentSession.currentLevel}
            activeMisconception={currentSession.activeMisconception}
            analyzingLogic={currentSession.analyzingLogic}
            onSendMessage={handleSendMessage}
            onRequestHint={handleRequestHint}
            hintText={hintText}
            onClearHint={() => setHintText(null)}
            socraticQuestions={currentSession.socraticQuestions}
          />
        );
      case "mastery-map":
        return (
          <MasteryMapScreen
            profile={profile}
            nodes={nodes}
            onDeepenInquiry={handleNavigateToTopic}
          />
        );
      case "reflections":
        return (
          <ReflectionsScreen
            profile={profile}
            nodes={nodes}
            reflections={reflections}
            onAddReflection={handleAddReflection}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Initializing Mind Matrix...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-bg text-primary-navy font-sans antialiased">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onRequestHint={handleRequestHint}
        misconceptionCount={currentSubjectMisconceptionsCount}
      />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Header
          currentSubject={profile.currentSubject}
          activeCategory={currentTopicNode.category}
          activeTopicName={currentTopicNode.name}
          onSubjectChangeClick={() => setActiveTab("settings")}
        />
        <main className="flex-1 overflow-y-auto relative bg-dot-pattern">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
