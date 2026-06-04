import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, KnowledgeLevelKey, DifficultyTier } from "./src/types";
import { INITIAL_CHAT } from "./src/data";

dotenv.config();

console.log("[BOOT] NODE_ENV:", process.env.NODE_ENV);
console.log("[BOOT] GEMINI_API_KEY present:", !!(process.env.GEMINI_API_KEY));
console.log("[BOOT] VITE_GEMINI_API_KEY present:", !!(process.env.VITE_GEMINI_API_KEY));
console.log("[BOOT] PORT:", process.env.PORT || "3000 (default)");

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

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // CORS support for Render deployments
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Health check endpoint for Render
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      aiEnabled: !!ai,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 6) + "..." : "MISSING",
      timestamp: new Date().toISOString()
    });
  });

  // Debug endpoint - tests actual Gemini API call
  app.get("/api/debug", async (req, res) => {
    if (!ai) {
      return res.json({ success: false, error: "AI client not initialized - API key missing or invalid" });
    }
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: "Reply with just: OK" }] }],
      });
      const text = result.response.text();
      return res.json({ success: true, response: text?.trim() });
    } catch (e: any) {
      return res.json({
        success: false,
        error: e.message,
        code: e.code || e.status || "unknown",
        details: e.errorDetails || e.statusText || null
      });
    }
  });

  let ai: GoogleGenerativeAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.length > 10) {
    try {
      ai = new GoogleGenerativeAI(apiKey);
      console.log("Secure Server-Side Gemini API Client Initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize server-side Gemini client wrapper.", e);
    }
  } else {
    console.log("No custom Gemini API Key located. Fallback intelligent cognitive responses engaged.");
  }

  // ─── 1. Socratic Dialogues API Endpoint ──────────────────────────────────
  app.post("/api/chat", async (req, res) => {
    const { topicId, message, history, currentLevel, activeMisconceptions } = req.body as { 
      topicId: string, 
      message: string, 
      history: Message[],
      currentLevel: string,
      activeMisconceptions?: any[]
    };
    const lowerMsg = (message || "").toLowerCase();

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

        let contextMsg = `Student is learning topic: ${topicId}\nTarget Cognitive Level: ${currentLevel || "understanding"}`;
        if (activeMisconceptions && activeMisconceptions.length > 0) {
          contextMsg += `\n\nActive misconceptions to address:\n${activeMisconceptions.map((m: any) => `- ${m.type}: ${m.description} (severity: ${m.severity})`).join('\n')}`;
        }

        const historyContents = (history || []).map((h) => ({
          role: h.sender === "ai" ? "model" : "user",
          parts: [{ text: h.text }]
        }));

        const model = ai.getGenerativeModel({
          model: "gemini-2.0-flash",
          systemInstruction: systemInstruction,
        });

        const result = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: contextMsg }] },
            ...historyContents,
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
            topP: 0.95,
            topK: 40
          }
        });

        const textResponse = result.response.text();
        if (textResponse) {
          const parsed = JSON.parse(textResponse.trim());
          return res.json(parsed);
        }
      } catch (error) {
        console.error("Gemini invocation failed, leveraging pedagogical fallback model.", error);
      }
    }

    // Back up Socratic Pedagogical Fallback Mode
    const fallbackList = PEDAGOGICAL_FALLBACKS[topicId] || [];
    let match = fallbackList.find(item => 
      item.userKeywords.some(keyword => lowerMsg.includes(keyword))
    );

    if (match) return res.json(match.response);

    const fallbackPrompt = INITIAL_CHAT[topicId] 
      ? `Regarding ${topicId}: ${INITIAL_CHAT[topicId]} How does your statement align with this?`
      : `Could you elaborate further? How does your reasoning apply to ${topicId}?`;

    return res.json({
      mentorPrompt: fallbackPrompt,
      conceptMastery: 42,
      knowledgeLevelUpdate: { level: currentLevel || "understanding", delta: 2 },
      detectedMisconceptions: [{
        type: "Requires Elaboration",
        description: "Student needs to provide more specific operational details for this topic.",
        severity: 0.3
      }],
      socraticQuestions: ["What would happen in the opposite scenario?", "Can you break down the steps?"],
      difficultyRecommendation: "beginner",
      suggestedPractice: "Rethink your formulation step-by-step.",
      prerequisites: []
    });
  });

  // ─── 2. Socratic Hint API Endpoint ───────────────────────────────────────
  app.post("/api/hint", async (req, res) => {
    const { topicId, history, currentLevel } = req.body;

    if (ai) {
      try {
        const hintPrompt = `The student is stuck on topic ${topicId} at cognitive level ${currentLevel || "understanding"}. Provide a single, extremely brief guidance hint (1-3 lines) in a warm, encouraging Socratic tone pointing them towards a self-realization. Do not solve it for them! Use Source Serif style.`;
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: hintPrompt }] }],
          generationConfig: { temperature: 0.8 }
        });
        const text = result.response.text();
        if (text) return res.json({ hint: text.trim() });
      } catch (e) {
        console.error("Hint generation failed, using standard fallback", e);
      }
    }

    return res.json({ hint: "Think about the foundational concepts: how do the parts relate to the whole?" });
  });

  // ─── 3. Generate Assessment Question Endpoint ─────────────────────────────
  app.post("/api/generate-question", async (req, res) => {
    const { topicId, level, difficultyTier, misconceptionContext } = req.body;

    if (ai) {
      try {
        const prompt = `Generate a single assessment question for topic '${topicId}' targeting the '${level}' cognitive level at a '${difficultyTier}' difficulty.
        ${misconceptionContext ? `The student previously struggled with: ${misconceptionContext}. Target this misconception.` : ""}
        Return a JSON object with: question (string), codeSnippet (optional string), expectedAnswer (string), and hints (array of strings).`;

        const model = ai.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
            topP: 0.95,
            topK: 40
          }
        });

        const text = result.response.text();
        if (text) return res.json(JSON.parse(text.trim()));
      } catch (e) {
        console.error("Question generation failed", e);
      }
    }

    return res.json({
      question: `What is the core principle of ${topicId}?`,
      hints: ["Review the fundamental definition."]
    });
  });

  // ─── 4. Assess Topic Mastery Endpoint ──────────────────────────────────────
  app.post("/api/assess", async (req, res) => {
    const { topicId, sessionData } = req.body;

    if (ai) {
      try {
        const prompt = `Analyze the student's recent session data for topic '${topicId}' and generate a structured evaluation report.
        Session data: ${JSON.stringify(sessionData)}
        Return a JSON object matching the AIEvaluationOutput structure.`;

        const model = ai.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            topP: 0.9,
            topK: 30
          }
        });

        const text = result.response.text();
        if (text) return res.json(JSON.parse(text.trim()));
      } catch (e) {
        console.error("Assessment generation failed", e);
      }
    }

    return res.json({
      concept: topicId,
      mastery: 50,
      knowledgeLevels: { recall: 50, understanding: 50, application: 50, analysis: 50, reflection: 50 },
      strengths: ["Basic definitions"],
      weaknesses: ["Complex application"],
      misconceptions: [],
      nextFocus: ["Practice problems"]
    });
  });

  // Global Error Handler (must be AFTER routes)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  // Vite development vs production serving (Skip if deployed on Vercel)
  if (!process.env.VERCEL) {
    (async () => {
      if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), "dist");
        console.log("[BOOT] Serving static files from:", distPath);
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }

      const startListening = (port: number) => {
        const server = app.listen(port, "0.0.0.0", () => {
          console.log(`Socratic AI Node server booted successfully on http://localhost:${port}`);
          console.log(`[BOOT] AI Enabled: ${!!ai}`);
        });
        server.on('error', (e: any) => {
          if (e.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying ${port + 1}...`);
            startListening(port + 1);
          } else {
            console.error(e);
          }
        });
      };
      startListening(PORT);
    })();
  }

export default app;
