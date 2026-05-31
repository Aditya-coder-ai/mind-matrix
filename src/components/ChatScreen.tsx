import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Paperclip, 
  Send, 
  Brain, 
  AlertTriangle, 
  Activity, 
  Sparkles,
  CheckCircle,
  Lightbulb,
  CornerDownLeft,
  X,
  Mic,
  Target
} from "lucide-react";
import { 
  TopicNode, 
  Message, 
  MisconceptionState, 
  StudentProfile,
  KnowledgeLevelKey,
  KnowledgeLevels
} from "../types";

interface ChatScreenProps {
  currentNode: TopicNode;
  profile: StudentProfile;
  messages: Message[];
  conceptMastery: number;
  knowledgeLevels?: KnowledgeLevels;
  currentLevel?: KnowledgeLevelKey;
  activeMisconception: MisconceptionState | null;
  analyzingLogic: boolean;
  onSendMessage: (text: string) => void;
  onRequestHint: () => void;
  hintText: string | null;
  onClearHint: () => void;
  socraticQuestions?: string[];
}

export default function ChatScreen({
  currentNode,
  profile,
  messages,
  conceptMastery,
  knowledgeLevels,
  currentLevel = "understanding",
  activeMisconception,
  analyzingLogic,
  onSendMessage,
  onRequestHint,
  hintText,
  onClearHint,
  socraticQuestions = []
}: ChatScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputText(prev => (prev ? prev + " " + finalTranscript : finalTranscript));
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start speech recognition", e);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, analyzingLogic]);

  const handleSend = () => {
    if (!inputText.trim() || analyzingLogic) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentLevelLabel = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen bg-dot-pattern">
      <section className="flex-1 flex flex-col relative px-8 py-6 max-w-[900px] mx-auto w-full h-[calc(100vh-72px)] overflow-hidden">
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 pb-6">
          <div className="flex justify-center mb-2 shrink-0 gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold text-primary-navy/50 bg-surface-card px-4 py-2 rounded-none border border-outline-variant flex items-center gap-2">
              <Brain size={12} className="text-primary-container" />
              <span>Socratic Concept: {currentNode.name}</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold text-primary-container bg-surface-container px-4 py-2 rounded-none border border-primary-container flex items-center gap-2">
              <Target size={12} />
              <span>Target Level: {currentLevelLabel}</span>
            </span>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isAI = msg.sender === "ai";
              return (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col ${isAI ? "items-start" : "items-end"} max-w-[85%] ${
                    isAI ? "self-start" : "self-end"
                  } gap-2`}
                >
                  <div className={`flex items-center gap-1.5 ml-1 mr-1 text-[9px] font-mono tracking-widest font-semibold uppercase`}>
                    {isAI ? (
                      <>
                        <Brain size={12} className="text-primary-container" />
                        <span className="text-primary-container font-mono">Socratic AI</span>
                      </>
                    ) : (
                      <>
                        <span className="text-primary-navy/40">You</span>
                      </>
                    )}
                  </div>

                  <div className={`p-5 rounded-none border ${
                    isAI 
                      ? "bg-surface-card border-outline-variant text-left"
                      : "bg-surface-container-low text-primary-navy border-outline-variant text-left"
                  }`}>
                    {isAI ? (
                      <p className="font-serif text-[17px] text-primary-navy/95 leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    ) : (
                      <p className="font-sans text-sm text-primary-navy/80 leading-relaxed">
                        {msg.text}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {analyzingLogic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="flex flex-col items-start max-w-[85%] gap-1.5 self-start"
            >
              <div className="flex items-center gap-1.5 ml-1 text-[9px] font-mono tracking-widest font-bold text-primary-container uppercase">
                <Brain size={12} className="text-primary-container animate-pulse" />
                <span className="animate-pulse">Analyzing Logic...</span>
              </div>
              <div className="bg-surface-card border border-outline-variant rounded-none px-5 py-3.5 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-none bg-primary-container animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-none bg-primary-container animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-none bg-primary-container animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {socraticQuestions.length > 0 && !analyzingLogic && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 p-4 border border-primary-container/20 bg-primary-container/[0.02] mb-3 text-left shrink-0 rounded-none"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-primary-container flex items-center gap-1.5">
              <Brain size={12} />
              Socratic Exploration Paths
            </span>
            <div className="flex flex-col gap-2 mt-2">
              {socraticQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="text-xs font-sans text-primary-navy/80 hover:text-primary-navy hover:border-primary-container/50 hover:bg-primary-container/5 bg-surface-card border border-outline-variant px-4 py-2.5 text-left cursor-pointer transition-all w-full leading-relaxed"
                >
                  <span className="font-mono font-bold text-primary-container/50 mr-2">{idx + 1}.</span> {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {hintText && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-primary-container/5 border border-primary-container/20 p-4 rounded-none flex justify-between items-start text-left shrink-0"
          >
            <div className="flex gap-2.5">
              <Lightbulb size={20} className="text-primary-container shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-primary-container mb-0.5">Socratic Hint</h4>
                <p className="font-serif text-[15px] text-primary-navy/85 leading-relaxed italic">{hintText}</p>
              </div>
            </div>
            <button 
              onClick={onClearHint}
              className="text-primary-navy/40 hover:text-primary-navy transition-colors p-1 rounded-xl"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <div className="mt-auto shrink-0 bg-transparent pt-3 relative z-10">
          <div className="relative group border border-outline-variant bg-surface-card rounded-none overflow-hidden hover:border-outline-variant transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={analyzingLogic}
              rows={2}
              className="w-full bg-transparent font-sans text-sm text-primary-navy placeholder:text-primary-navy/30 px-4 py-3.5 pr-20 resize-none outline-none focus:ring-0 focus:outline-none"
              placeholder="Formulate your reasoning step-by-step..."
            />
            <div className="absolute right-3.5 bottom-3.5 flex gap-2">
              <button 
                title="Voice Input"
                onClick={toggleRecording}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                  isRecording 
                    ? "bg-academic-red/10 border-academic-red/30 text-academic-red animate-pulse" 
                    : "bg-primary-navy/5 border-outline-variant text-primary-navy/40 hover:text-primary-navy"
                }`}
              >
                <Mic size={16} />
              </button>
              <button 
                title="Attach Document/Diagram"
                className="w-8 h-8 rounded-xl bg-primary-navy/5 border border-outline-variant flex items-center justify-center text-primary-navy/40 hover:text-primary-navy transition-colors cursor-pointer"
              >
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || analyzingLogic}
                className="w-8 h-8 rounded-xl bg-primary-container text-white flex items-center justify-center hover:bg-primary-container/80 transition-all cursor-pointer shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2.5 px-1.5 font-mono">
            <span className="text-[9px] text-primary-navy/40 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
              <CornerDownLeft size={11} className="text-primary-navy/30" />
              Press Enter to submit, Shift+Enter for newline.
            </span>
            <button
              onClick={onRequestHint}
              className="text-[10px] font-bold text-primary-container hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors rounded-xl"
            >
              <Sparkles size={11} className="text-primary-container animate-pulse" />
              <span>I'm stuck</span>
            </button>
          </div>
        </div>
      </section>

      <aside className="w-[320px] bg-surface-card border-l border-outline-variant flex flex-col p-6 z-10 h-[calc(100vh-72px)] overflow-y-auto text-left">
        <div className="flex items-center gap-2 mb-6 border-b border-outline-variant pb-3 shrink-0">
          <Activity size={16} className="text-primary-container" />
          <h2 className="font-mono font-bold text-xs text-primary-navy uppercase tracking-widest">
            Cognitive Diagnostics
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeMisconception ? (
              <motion.div
                key={activeMisconception.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border border-academic-red/20 rounded-none p-5 relative overflow-hidden bg-academic-red-container"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-academic-red" />
                <h3 className="font-mono font-bold text-[10px] uppercase tracking-wider text-academic-red mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  Active Misconception
                </h3>
                <p className="font-sans font-bold text-primary-navy text-sm mb-1 leading-snug">
                  "{activeMisconception.title}"
                </p>
                <p className="font-sans text-xs text-primary-navy/60 mt-2 leading-relaxed">
                  {activeMisconception.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="no-friction"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border border-academic-green-light/20 rounded-none p-5 relative overflow-hidden bg-[#064e3b]/30"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-academic-green-light" />
                <h3 className="font-mono font-bold text-[10px] uppercase tracking-wider text-academic-green-light mb-2 flex items-center gap-1.5">
                  <CheckCircle size={15} />
                  Zero Friction Detected
                </h3>
                <p className="font-sans font-bold text-primary-navy text-sm mb-1 leading-snug">
                  No active misalignments.
                </p>
                <p className="font-sans text-xs text-primary-navy/60 mt-2 leading-relaxed">
                  Excellent. Your current reasoning exhibits stable conceptual bridges. You are ready to deepen your inquiry.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Multi-Level Mastery Bars */}
          <div className="border border-outline-variant rounded-none p-5 bg-white/[0.02]">
            <h3 className="font-mono font-bold text-[9px] uppercase tracking-widest text-primary-navy/50 flex items-center gap-1.5 mb-4">
              <Target size={14} className="text-primary-container" />
              Cognitive Level Mastery
            </h3>
            
            <div className="flex flex-col gap-3">
              {(['recall', 'understanding', 'application', 'analysis', 'reflection'] as const).map(level => {
                const val = knowledgeLevels ? knowledgeLevels[level] : 0;
                const isCurrent = level === currentLevel;
                return (
                  <div key={level} className="flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                      <span className={`font-mono text-[9px] uppercase tracking-wider ${isCurrent ? 'text-primary-container font-bold' : 'text-primary-navy/60'}`}>
                        {level}
                      </span>
                      <span className="font-mono text-[9px] text-primary-navy/40">{val}%</span>
                    </div>
                    <div className="h-1 w-full bg-primary-navy/5 relative border border-outline-variant/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        className={`h-full ${isCurrent ? 'bg-primary-container' : 'bg-primary-navy/30'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
}
