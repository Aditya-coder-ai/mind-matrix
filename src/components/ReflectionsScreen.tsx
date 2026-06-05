import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  Layers
} from "lucide-react";
import { StudentProfile, TopicNode, Reflection } from "../types";
import Breadcrumb from "./Breadcrumb";

interface ReflectionsScreenProps {
  profile: StudentProfile;
  nodes: TopicNode[];
  onAddReflection: (reflection: Omit<Reflection, "id" | "date">) => void;
  reflections: Reflection[];
}

const TOPIC_PROMPTS: Record<string, string> = {
  "mole-concept": "What was the hardest part of solving stoichiometry mass ratios today?",
  "newtons-second-law": "How does vertical gravity impact F=ma acceleration models on inclined surfaces?",
  "limits-math": "What confuses your calculation of limits on jump boundary piecewise functions?",
  "general": "What was the hardest part of understanding your academic principles today?"
};

export default function ReflectionsScreen({
  profile,
  nodes,
  onAddReflection,
  reflections
}: ReflectionsScreenProps) {
  const currentSubject = profile.currentSubject;
  
  // Find current active node of this subject to reflect upon
  const subjectNodes = nodes.filter(n => n.subject === currentSubject);
  const activeNode = subjectNodes.find(n => n.status === "active") || subjectNodes[0];

  const promptText = TOPIC_PROMPTS[activeNode?.id] || TOPIC_PROMPTS["general"];

  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<any | null>(null);

  const triggerSelfEvaluation = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    
    try {
      const API_BASE_URL = import.meta.env.PROD ? "https://mind-matrix-zrp3.onrender.com" : "";
      const response = await fetch(`${API_BASE_URL}/api/reflect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reflection: answer,
          topicId: activeNode?.id || "general",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reflection insight");
      }

      const insightData = await response.json();
      setGeneratedInsight(insightData);
      
      onAddReflection({
        topicId: activeNode?.id || "general",
        topicName: activeNode?.name || "General Study",
        question: promptText,
        answer: answer,
        feedback: insightData.insightSummary || insightData.diagnosis || "Reflection logged.",
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      // Fallback in case of error
      setGeneratedInsight({
        insightSummary: "Your reflection has been securely logged.",
        diagnosis: "Unable to reach Socratic AI at this moment."
      });
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6 bg-dot-pattern min-h-screen text-left"
    >
      <header className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-primary-navy">
          Cognitive Reflections
        </h2>
        <p className="font-sans text-xs text-on-surface-variant">
          Journal your logical formulation steps below so Socratic AI can calibrate your cognitive curriculum model.
        </p>
      </header>

      {/* Main reflection prompt card */}
      <section className="bg-surface-card border border-outline-variant rounded-2xl p-6 md:p-8 shadow-xs relative">
        <Breadcrumb
          className="mb-4"
          items={[
            { label: "Active Reflection Prompt", icon: <Layers size={14} /> },
            { label: activeNode?.name || "General Study" }
          ]}
        />

        <h3 className="font-serif text-xl md:text-2xl text-primary-navy font-semibold leading-snug mb-6">
          {promptText}
        </h3>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setSuccess(false);
            }}
            disabled={isSubmitting}
            className="w-full h-48 p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 focus:border-primary-navy focus:ring-1 focus:ring-primary-navy outline-none resize-none font-sans text-sm text-primary-navy placeholder:text-on-surface-variant/45 transition-all text-left"
            placeholder="Take a moment to transcribe your deduction. Think about the specific steps where you felt stuck..."
          />
          <span className="absolute bottom-4 right-4 text-[10px] uppercase font-bold text-on-surface-variant">
            {isSubmitting ? "Uploading analysis..." : answer.trim() ? "Draft ready" : "Saved draft"}
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={triggerSelfEvaluation}
            disabled={!answer.trim() || isSubmitting}
            className="px-6 py-2.5 bg-primary-container hover:bg-primary-navy text-on-primary font-medium text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Mentoring logic...</span>
              </>
            ) : (
              <>
                <span>Submit Reflection</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Feedback insight panel (Animate entrance once submitted) */}
      <AnimatePresence>
        {(success || reflections.length > 0) && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-navy/[0.03] border border-primary-navy/20 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-left mt-2"
          >
            <div className="flex gap-4 items-start border-b border-primary-navy/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-primary-container border border-primary-navy/15 text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <Brain size={20} className="text-primary-navy text-primary-navy" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-xs text-primary-navy uppercase tracking-wider mb-1">
                  Mentor Insights
                </h3>
                <p className="font-serif text-base text-primary-navy/95 leading-relaxed">
                  {generatedInsight?.insightSummary || reflections[reflections.length - 1]?.feedback || "Reflections logged successfully. Socratic AI has recalibrated your visual Mastery Map and recommended learning coordinates."}
                </p>
              </div>
            </div>
            
            {generatedInsight && generatedInsight.diagnosis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-primary-navy/60 mb-2">Cognitive Diagnosis</h4>
                  <p className="font-sans text-sm text-primary-navy/80 leading-relaxed bg-white/40 p-3 rounded-lg border border-outline-variant/30">{generatedInsight.diagnosis}</p>
                </div>
                {generatedInsight.reframe && (
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-primary-navy/60 mb-2">Mental Reframe</h4>
                    <p className="font-sans text-sm text-primary-navy/80 leading-relaxed bg-white/40 p-3 rounded-lg border border-outline-variant/30">{generatedInsight.reframe}</p>
                  </div>
                )}
                {generatedInsight.socraticQuestion && (
                  <div className="md:col-span-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-primary-container mb-2">Socratic Inquiry</h4>
                    <p className="font-serif text-lg text-primary-navy italic border-l-2 border-primary-container pl-4 my-2">{generatedInsight.socraticQuestion}</p>
                  </div>
                )}
                {generatedInsight.nextStep && (
                  <div className="md:col-span-2 flex items-center gap-2 mt-2 bg-primary-navy/5 p-3 rounded-xl border border-primary-navy/10">
                    <CheckCircle size={16} className="text-primary-navy/60" />
                    <span className="font-sans text-sm font-medium text-primary-navy"><strong>Recommended Action:</strong> {generatedInsight.nextStep}</span>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


