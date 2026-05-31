import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import { Message, KnowledgeLevelKey, DifficultyTier } from "./shared/types";
import { INITIAL_CHAT } from "./shared/data";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Global Error Handler for Express
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error in Express:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

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

let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    logger.info("Secure Server-Side Gemini API Client Initialized successfully.");
  } catch (e) {
    logger.error("Failed to initialize server-side Gemini client wrapper.", e);
  }
} else {
  logger.warn("No custom Gemini API Key located. Fallback intelligent cognitive responses engaged.");
}

app.post("/api/chat", async (req, res) => {
  const { topicId, message, history, currentLevel, activeMisconceptions } = req.body;
  const lowerMsg = (message || "").toLowerCase();

  logger.info("Chat request received", { topicId, currentLevel, messageLength: message?.length });

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

      const historyContents = (history || []).map((h: any) => ({
        role: h.sender === "ai" ? "model" : "user",
        parts: [{ text: h.text }]
      }));

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "user", parts: [{ text: contextMsg }] },
          ...historyContents
        ],
        config: {
          systemInstruction: systemInstruction,
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

      if (result.text) {
        const payload = JSON.parse(result.text.trim());
        logger.info("AI response generated", { topicId, newMastery: payload.conceptMastery });
        return res.json(payload);
      }
    } catch (e: any) {
      logger.error("AI Generation Failed", { topicId, error: e.message });
    }
  }

  // Fallback Logic
  logger.warn("Using pedagogical fallback", { topicId });
  const fallbacks = PEDAGOGICAL_FALLBACKS[topicId] || [];
  const match = fallbacks.find(f => f.userKeywords.some(kw => lowerMsg.includes(kw)));

  if (match) {
    return res.json(match.response);
  }

  const fallbackPrompt = INITIAL_CHAT[topicId] 
    ? `Regarding ${topicId}: ${INITIAL_CHAT[topicId]} How does your statement align with this?`
    : `Could you elaborate further? How does your reasoning apply to ${topicId}?`;

  return res.json({
    mentorPrompt: fallbackPrompt,
    conceptMastery: 50,
    knowledgeLevelUpdate: { level: currentLevel || "understanding", delta: 2 },
    detectedMisconceptions: [],
    socraticQuestions: ["Can you elaborate on your reasoning?", "What happens if we change the variables?"],
    difficultyRecommendation: "beginner",
    suggestedPractice: "Review the fundamental concepts.",
    prerequisites: []
  });
});

app.post("/api/hint", async (req, res) => {
  const { topicId, currentLevel } = req.body;

  if (ai) {
    try {
      const hintPrompt = `The student is stuck on topic ${topicId} at cognitive level ${currentLevel || "understanding"}. Provide a single, extremely brief guidance hint (1-3 lines) in a warm, encouraging Socratic tone pointing them towards a self-realization. Do not solve it for them! Use Source Serif style.`;
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: hintPrompt,
      });
      if (result.text) return res.json({ hint: result.text.trim() });
    } catch (e) {
      logger.error("Hint generation failed, using standard fallback", e);
    }
  }

  return res.json({ hint: "Think about the foundational concepts: how do the parts relate to the whole?" });
});

app.post("/api/generate-question", async (req, res) => {
  const { topicId, level, difficultyTier, misconceptionContext } = req.body;

  if (ai) {
    try {
      const prompt = `Generate a single assessment question for topic '${topicId}' targeting the '${level}' cognitive level at a '${difficultyTier}' difficulty.
      ${misconceptionContext ? `The student previously struggled with: ${misconceptionContext}. Target this misconception.` : ""}
      Return a JSON object with: question (string), codeSnippet (optional string), expectedAnswer (string), and hints (array of strings).`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              expectedAnswer: { type: Type.STRING },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["question", "hints"]
          }
        }
      });

      if (result.text) return res.json(JSON.parse(result.text.trim()));
    } catch (e) {
      logger.error("Question generation failed", e);
    }
  }

  return res.json({
    question: `What is the core principle of ${topicId}?`,
    hints: ["Review the fundamental definition."]
  });
});

app.post("/api/assess", async (req, res) => {
  const { topicId, sessionData } = req.body;

  if (ai) {
    try {
      const prompt = `Analyze the student's recent session data for topic '${topicId}' and generate a structured evaluation report.
      Session data: ${JSON.stringify(sessionData)}
      Return a JSON object matching the AIEvaluationOutput structure.`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING },
              mastery: { type: Type.INTEGER },
              knowledgeLevels: {
                type: Type.OBJECT,
                properties: {
                  recall: { type: Type.INTEGER },
                  understanding: { type: Type.INTEGER },
                  application: { type: Type.INTEGER },
                  analysis: { type: Type.INTEGER },
                  reflection: { type: Type.INTEGER }
                }
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              misconceptions: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextFocus: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["concept", "mastery", "knowledgeLevels", "strengths", "weaknesses", "misconceptions", "nextFocus"]
          }
        }
      });

      if (result.text) return res.json(JSON.parse(result.text.trim()));
    } catch (e) {
      logger.error("Assessment generation failed", e);
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

// Mount the express app as a Firebase Cloud Function!
export const api = onRequest({ region: "us-central1", secrets: ["GEMINI_API_KEY"] }, app);
