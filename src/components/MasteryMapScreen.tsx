import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  CheckCircle, 
  HelpCircle, 
  Loader2, 
  AlertTriangle, 
  Lock, 
  BookOpen, 
  ArrowRight,
  Brain,
  Award,
  Zap,
  Target
} from "lucide-react";
import { TopicNode, SubjectName, StudentProfile, MisconceptionState } from "../types";
import { INITIAL_MISCONCEPTIONS, KNOWLEDGE_GRAPH_EDGES } from "../data";
import { AssessmentEngine } from "../AssessmentEngine";

interface MasteryMapScreenProps {
  profile: StudentProfile;
  nodes: TopicNode[];
  onDeepenInquiry: (topicId: string) => void;
}

export default function MasteryMapScreen({
  profile,
  nodes,
  onDeepenInquiry
}: MasteryMapScreenProps) {
  const currentSubject = profile.currentSubject;
  const subjectNodes = nodes.filter(n => n.subject === currentSubject);
  
  const defaultSelectedNode = subjectNodes.find(n => n.id === "newtons-second-law" || n.id === "mole-concept" || n.id === "limits-math" || n.id === "trees-dsa" || n.id === "normalization-dbms") || subjectNodes[0];
  const [selectedNode, setSelectedNode] = useState<TopicNode>(defaultSelectedNode);
  const [hoveredNode, setHoveredNode] = useState<TopicNode | null>(null);

  React.useEffect(() => {
    const defaultNode = subjectNodes.find(n => n.id === "newtons-second-law" || n.id === "mole-concept" || n.id === "limits-math" || n.id === "trees-dsa" || n.id === "normalization-dbms") || subjectNodes[0];
    if (defaultNode) setSelectedNode(defaultNode);
  }, [currentSubject]);

  const misconception: MisconceptionState | null = INITIAL_MISCONCEPTIONS[selectedNode.id] || null;

  // Render SVG links dynamically based on KNOWLEDGE_GRAPH_EDGES
  const renderSvgEdges = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
        {KNOWLEDGE_GRAPH_EDGES.map((edge, i) => {
          const fromNode = subjectNodes.find(n => n.id === edge.from);
          const toNode = subjectNodes.find(n => n.id === edge.to);
          
          if (!fromNode || !toNode) return null;

          // Cascading hover impact calculation
          const isImpacted = hoveredNode && edge.from === hoveredNode.id;
          const strokeWidth = isImpacted ? 3 : 2;
          let strokeColor = "rgba(79, 0, 255, 0.15)"; // outline variant

          // Color based on prerequisite mastery
          if (fromNode.mastery >= 80) strokeColor = "rgba(0, 230, 115, 0.6)"; // green
          else if (fromNode.mastery >= 40) strokeColor = "rgba(255, 179, 102, 0.6)"; // amber
          else strokeColor = "rgba(255, 51, 102, 0.6)"; // red

          return (
            <path 
              key={i}
              className={`transition-all duration-300 ${isImpacted ? "animate-pulse" : ""}`}
              d={`M ${fromNode.x} ${fromNode.y} C ${fromNode.x} ${(fromNode.y + toNode.y)/2}, ${toNode.x} ${(fromNode.y + toNode.y)/2}, ${toNode.x} ${toNode.y}`}
              fill="none" 
              stroke={strokeColor}
              strokeDasharray={edge.weight < 0.7 ? "4 4" : "none"}
              strokeWidth={strokeWidth} 
            />
          );
        })}
      </svg>
    );
  };

  // Mini radar component for tooltip
  const MiniRadar = ({ levels }: { levels: any }) => {
    const getPoint = (val: number, angle: number) => {
      const r = (val / 100) * 20;
      const x = 25 + r * Math.cos(angle - Math.PI / 2);
      const y = 25 + r * Math.sin(angle - Math.PI / 2);
      return `${x},${y}`;
    };
    const pts = [
      getPoint(levels.recall, 0),
      getPoint(levels.understanding, Math.PI * 2 * 0.2),
      getPoint(levels.application, Math.PI * 2 * 0.4),
      getPoint(levels.analysis, Math.PI * 2 * 0.6),
      getPoint(levels.reflection, Math.PI * 2 * 0.8),
    ].join(" ");

    return (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <polygon points="25,5 44,19 37,41 13,41 6,19" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <polygon points={pts} fill="rgba(79, 0, 255, 0.5)" stroke="#7033FF" strokeWidth="1" />
      </svg>
    );
  };

  const cascadeWarnings = AssessmentEngine.calculatePrerequisiteImpact(selectedNode.id, selectedNode.mastery, KNOWLEDGE_GRAPH_EDGES);

  return (
    <div className="flex-1 flex flex-col p-8 bg-dot-pattern h-[calc(100vh-72px)] overflow-hidden w-full max-w-7xl mx-auto gap-8 text-left">
      <header className="shrink-0 flex justify-between items-center bg-surface-card p-6 rounded-none border border-outline-variant backdrop-blur-xs">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-primary-navy uppercase tracking-tighter">
            Your Cognitive Landscape
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary-navy/50">
            Explore conceptual understanding of {currentSubject} and select nodes for inspection.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-mono font-bold uppercase tracking-wider">
          <span className="px-3 py-2 border border-outline-variant bg-primary-navy/5 text-primary-navy/80 rounded-none">
            {subjectNodes.length} nodes total
          </span>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
        
        <div className="flex-1 bg-surface-card border border-outline-variant rounded-none relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />

          {renderSvgEdges()}

          <div className="absolute w-full h-full pointer-events-auto" style={{ zIndex: 20 }}>
            {subjectNodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isMastered = node.status === "mastered";
              const isWarning = node.status === "active" && misalignmentList().includes(node.id);
              
              let colorClass = "border-outline-variant";
              if (isSelected) {
                if (isMastered) colorClass = "border-academic-green-light";
                else if (isWarning) colorClass = "border-academic-red";
                else colorClass = "border-primary-container";
              } else {
                if (isMastered) colorClass = "border-academic-green-light/40";
                else if (isWarning) colorClass = "border-academic-red/40";
                else if (node.status === "pending") colorClass = "border-outline-variant opacity-50";
                else colorClass = "border-outline-variant";
              }

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    isSelected ? "scale-105 z-30" : "hover:scale-105 z-20"
                  }`}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <div className={`relative ${isWarning ? "warning-pulse" : ""}`}>
                    <div className={`p-4 rounded-none bg-surface-container border-2 ${colorClass} ${
                      isSelected ? "shadow-lg bg-surface-container-low" : ""
                    } flex flex-col items-center justify-center h-28 w-28 text-center transition-all`}>
                      {isMastered ? (
                        <CheckCircle size={18} className="text-academic-green-light mb-2" />
                      ) : isWarning ? (
                        <AlertTriangle size={18} className="text-academic-red mb-2 animate-pulse" />
                      ) : (
                        <HelpCircle size={18} className="text-primary-navy/30 mb-2" />
                      )}
                      
                      <span className="font-mono font-bold text-[9px] text-primary-navy tracking-widest leading-normal px-1 uppercase block line-clamp-2">
                        {node.name}
                      </span>
                    </div>

                    {hoveredNode?.id === node.id && (
                      <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-surface-card border border-outline-variant p-2 shadow-xl z-50 flex items-center gap-3">
                        <MiniRadar levels={node.knowledgeLevels} />
                        <div className="flex flex-col text-left">
                          <span className="font-mono text-[9px] font-bold uppercase text-primary-navy">{node.name}</span>
                          <span className="font-mono text-[8px] text-primary-navy/50 uppercase">Mastery: {node.mastery}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="w-[360px] shrink-0 bg-surface-card border border-outline-variant rounded-none flex flex-col h-full">
          <div className="p-6 border-b border-outline-variant bg-surface-container flex flex-col items-start gap-1">
            <span className={`px-2 py-1 font-mono text-[9px] uppercase tracking-widest font-extrabold rounded-none flex items-center gap-1.5 ${
              selectedNode.status === "mastered" 
                ? "bg-academic-green-light/15 text-academic-green-light border border-academic-green-light/30"
                : misalignmentList().includes(selectedNode.id)
                ? "bg-academic-red-container text-academic-red border border-academic-red/30"
                : "bg-primary-navy/5 text-primary-navy/60 border border-outline-variant"
            }`}>
              {selectedNode.status === "mastered" ? (
                <><CheckCircle size={10} /> Mastered Principle</>
              ) : misalignmentList().includes(selectedNode.id) ? (
                <><AlertTriangle size={10} /> Friction Identified</>
              ) : (
                <><Loader2 size={10} className="animate-spin" /> Conceptualizing</>
              )}
            </span>
            <h3 className="font-sans text-xl font-black uppercase text-primary-navy mt-1 leading-tight tracking-wider">
              {selectedNode.name}
            </h3>
            <span className="text-[9px] font-mono uppercase tracking-widest text-primary-navy/40 font-semibold mt-1">
              Category: {selectedNode.category}
            </span>
          </div>

          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
            <div>
              <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-primary-navy/30 mb-1 border-b border-outline-variant pb-1">Concept Summary</h4>
              <p className="font-serif text-sm text-primary-navy/80 leading-relaxed text-left italic">
                {selectedNode.description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {misconception && misalignmentList().includes(selectedNode.id) ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-academic-red-container text-left border border-academic-red/20 rounded-none p-5"
                >
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-academic-red flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} /> Detected Misconception
                  </h4>
                  <p className="font-sans text-xs font-bold text-primary-navy leading-normal">
                    "{misconception.title}"
                  </p>
                  <p className="font-sans text-xs text-primary-navy/70 mt-2 leading-relaxed">
                    {misconception.description}
                  </p>
                </motion.div>
              ) : selectedNode.status === "mastered" ? (
                <div className="bg-academic-green-dark/20 border border-academic-green-light/25 rounded-none p-5 text-left">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-academic-green-light flex items-center gap-1.5 mb-2">
                    <CheckCircle size={14} className="text-academic-green-light" /> Cognitive Validation
                  </h4>
                  <p className="font-sans text-xs text-primary-navy/70 leading-relaxed">
                    Student exhibits full, robust understanding on this concept.
                  </p>
                </div>
              ) : (
                <div className="bg-surface-container border border-outline-variant rounded-none p-5 text-left">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-primary-navy/60 flex items-center gap-1.5 mb-2">
                    <BookOpen size={14} className="text-primary-navy/60" /> Prerequisite Clearance
                  </h4>
                  <p className="font-sans text-xs text-primary-navy/60 leading-relaxed">
                    Prerequisites met. Click below to begin Socratic formulation dialogues to build cognitive stability.
                  </p>
                </div>
              )}
            </AnimatePresence>

            {cascadeWarnings.length > 0 && (
              <div className="bg-academic-red-container/50 border border-academic-red/40 rounded-none p-5 text-left">
                <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-academic-red flex items-center gap-1.5 mb-2">
                  <Network size={14} /> Cascade Warnings
                </h4>
                <p className="font-sans text-xs text-primary-navy/80 leading-relaxed mb-2">
                  Poor understanding of {selectedNode.name} may negatively impact:
                </p>
                <ul className="flex flex-col gap-1">
                  {cascadeWarnings.map((warning, i) => (
                    <li key={i} className="text-[10px] font-mono font-bold text-academic-red uppercase">
                      • {nodes.find(n => n.id === warning.dependentTopic)?.name || warning.dependentTopic}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {misconception && misalignmentList().includes(selectedNode.id) && (
              <div className="bg-primary-container/5 border border-primary-container/20 rounded-none p-5 text-left">
                <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-primary-container flex items-center gap-1.5 mb-2">
                  <Zap size={14} /> Suggested Remediation
                </h4>
                <p className="font-sans text-xs text-primary-navy/80 leading-relaxed">
                  {misconception.suggestedPractice}
                </p>
              </div>
            )}

            <div className="border-t border-outline-variant pt-4">
              <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-primary-navy/30 mb-3 block">Prerequisites</h4>
              <ul className="flex flex-col gap-2.5">
                {KNOWLEDGE_GRAPH_EDGES.filter(e => e.to === selectedNode.id).length > 0 ? (
                  KNOWLEDGE_GRAPH_EDGES.filter(e => e.to === selectedNode.id).map((edge, idx) => {
                    const prereq = nodes.find(n => n.id === edge.from);
                    if (!prereq) return null;
                    const isStrong = prereq.mastery >= 80;
                    return (
                      <li key={idx} className="flex items-center gap-2 text-xs font-mono font-bold text-primary-navy uppercase tracking-wider">
                        {isStrong ? <CheckCircle size={14} className="text-academic-green-light" /> : <AlertTriangle size={14} className="text-amber-500" />}
                        <span>{prereq.name}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-xs text-primary-navy/40 font-mono italic uppercase tracking-wider">No immediate sub-dependencies.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-outline-variant bg-surface-container-high shrink-0">
            <button 
              onClick={() => onDeepenInquiry(selectedNode.id)}
              className="w-full py-3.5 px-4 bg-primary-container text-white hover:bg-primary-container/90 text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Brain size={15} />
              <span>Deepen Inquiry</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function misalignmentList() {
  return ["mole-concept", "newtons-second-law", "limits-math", "trees-dsa", "graphs-dsa", "normalization-dbms", "transactions-dbms"];
}
