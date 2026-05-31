import React, { useMemo } from "react";
import { motion } from "motion/react";
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
  Layers,
  Award
} from "lucide-react";
import { StudentProfile, TopicNode, TrackedMisconception, KnowledgeLevels } from "../types";

interface KnowledgeProfileScreenProps {
  profile: StudentProfile;
  nodes: TopicNode[];
  trackedMisconceptions: TrackedMisconception[];
}

export default function KnowledgeProfileScreen({
  profile,
  nodes,
  trackedMisconceptions
}: KnowledgeProfileScreenProps) {
  const currentSubject = profile.currentSubject;
  const subjectNodes = nodes.filter(n => n.subject === currentSubject);
  const subjectMisconceptions = trackedMisconceptions.filter(m => 
    subjectNodes.some(n => n.id === m.topicId)
  );

  // SVG Radar Chart for average knowledge levels
  const radarData = useMemo(() => {
    if (subjectNodes.length === 0) return { recall: 0, understanding: 0, application: 0, analysis: 0, reflection: 0 };
    
    const sums = subjectNodes.reduce((acc, node) => ({
      recall: acc.recall + node.knowledgeLevels.recall,
      understanding: acc.understanding + node.knowledgeLevels.understanding,
      application: acc.application + node.knowledgeLevels.application,
      analysis: acc.analysis + node.knowledgeLevels.analysis,
      reflection: acc.reflection + node.knowledgeLevels.reflection,
    }), { recall: 0, understanding: 0, application: 0, analysis: 0, reflection: 0 });

    return {
      recall: sums.recall / subjectNodes.length,
      understanding: sums.understanding / subjectNodes.length,
      application: sums.application / subjectNodes.length,
      analysis: sums.analysis / subjectNodes.length,
      reflection: sums.reflection / subjectNodes.length,
    };
  }, [subjectNodes]);

  // Points for radar polygon (radius = 100, center = 120,120)
  const getRadarPoint = (value: number, angleOffset: number) => {
    const r = (value / 100) * 80; // max radius 80
    const x = 120 + r * Math.cos(angleOffset - Math.PI / 2);
    const y = 120 + r * Math.sin(angleOffset - Math.PI / 2);
    return `${x},${y}`;
  };

  const polyPoints = [
    getRadarPoint(radarData.recall, 0),
    getRadarPoint(radarData.understanding, Math.PI * 2 * 0.2),
    getRadarPoint(radarData.application, Math.PI * 2 * 0.4),
    getRadarPoint(radarData.analysis, Math.PI * 2 * 0.6),
    getRadarPoint(radarData.reflection, Math.PI * 2 * 0.8),
  ].join(" ");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 bg-dot-pattern min-h-screen text-left"
    >
      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant p-8 rounded-none bg-surface-card backdrop-blur-md">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-container font-bold">
              Multi-Dimensional Profile
            </span>
          </div>
          <h2 className="font-sans text-4xl font-extrabold text-primary-navy tracking-tighter uppercase mb-3">
            Knowledge Dimensions
          </h2>
          <p className="font-serif text-sm text-primary-navy/70 max-w-3xl leading-relaxed">
            A comprehensive breakdown of your cognitive models across Recall, Understanding, Application, Analysis, and Reflection for {currentSubject}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Chart Card */}
        <div className="lg:col-span-4 bg-surface-card border border-outline-variant rounded-none p-6 flex flex-col items-center">
          <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-primary-navy self-start mb-6">
            Cognitive Axis
          </h3>
          
          <div className="relative w-[240px] h-[240px]">
            <svg width="240" height="240" viewBox="0 0 240 240">
              {/* Background Web */}
              {[20, 40, 60, 80].map((r, i) => (
                <polygon 
                  key={i}
                  points={`
                    ${120 + r * Math.cos(-Math.PI/2)},${120 + r * Math.sin(-Math.PI/2)}
                    ${120 + r * Math.cos(Math.PI*2*0.2 - Math.PI/2)},${120 + r * Math.sin(Math.PI*2*0.2 - Math.PI/2)}
                    ${120 + r * Math.cos(Math.PI*2*0.4 - Math.PI/2)},${120 + r * Math.sin(Math.PI*2*0.4 - Math.PI/2)}
                    ${120 + r * Math.cos(Math.PI*2*0.6 - Math.PI/2)},${120 + r * Math.sin(Math.PI*2*0.6 - Math.PI/2)}
                    ${120 + r * Math.cos(Math.PI*2*0.8 - Math.PI/2)},${120 + r * Math.sin(Math.PI*2*0.8 - Math.PI/2)}
                  `}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-outline-variant"
                />
              ))}
              
              {/* Axis Lines */}
              {[0, 0.2, 0.4, 0.6, 0.8].map((angle, i) => (
                <line 
                  key={i}
                  x1="120" y1="120"
                  x2={120 + 80 * Math.cos(Math.PI*2*angle - Math.PI/2)}
                  y2={120 + 80 * Math.sin(Math.PI*2*angle - Math.PI/2)}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-outline-variant"
                />
              ))}

              {/* Data Polygon */}
              <polygon 
                points={polyPoints}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary-container fill-primary-container/20"
              />
            </svg>
            
            {/* Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 font-mono text-[9px] uppercase font-bold text-primary-navy">Recall</div>
            <div className="absolute top-[35%] -right-8 font-mono text-[9px] uppercase font-bold text-primary-navy">Understanding</div>
            <div className="absolute bottom-[10%] -right-4 font-mono text-[9px] uppercase font-bold text-primary-navy">Application</div>
            <div className="absolute bottom-[10%] -left-4 font-mono text-[9px] uppercase font-bold text-primary-navy">Analysis</div>
            <div className="absolute top-[35%] -left-8 font-mono text-[9px] uppercase font-bold text-primary-navy">Reflection</div>
          </div>
        </div>

        {/* Misconception Tracker */}
        <div className="lg:col-span-8 bg-surface-card border border-outline-variant rounded-none p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={18} className="text-academic-red" />
            <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-primary-navy">
              Active Misconceptions
            </h3>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
            {subjectMisconceptions.length === 0 ? (
              <div className="text-center p-8 bg-surface-container-low border border-outline-variant/50 text-primary-navy/40 text-xs font-mono uppercase tracking-widest">
                No active misconceptions detected for {currentSubject}.
              </div>
            ) : (
              subjectMisconceptions.map(misc => (
                <div key={misc.id} className="bg-academic-red-container border border-academic-red/20 p-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-academic-red tracking-wider">
                      {misc.type} ({misc.occurrences} occurrences)
                    </span>
                    <span className="text-[9px] font-mono uppercase text-academic-red/60">
                      Severity: {Math.round(misc.severity * 100)}%
                    </span>
                  </div>
                  <p className="font-sans text-sm text-primary-navy/90 mb-2">
                    {misc.description}
                  </p>
                  <div className="w-full bg-academic-red/10 h-1 mt-2">
                    <div className="bg-academic-red h-full" style={{ width: `${misc.severity * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mastery Heatmap Table */}
        <div className="lg:col-span-12 bg-surface-card border border-outline-variant rounded-none p-6 overflow-x-auto">
          <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-primary-navy mb-6">
            Level-by-Level Breakdown
          </h3>
          <table className="w-full text-left font-mono text-xs uppercase tracking-wider">
            <thead>
              <tr className="border-b border-outline-variant text-primary-navy/40">
                <th className="py-3 px-2 font-medium">Topic</th>
                <th className="py-3 px-2 font-medium">Recall</th>
                <th className="py-3 px-2 font-medium">Understanding</th>
                <th className="py-3 px-2 font-medium">Application</th>
                <th className="py-3 px-2 font-medium">Analysis</th>
                <th className="py-3 px-2 font-medium">Reflection</th>
              </tr>
            </thead>
            <tbody>
              {subjectNodes.map(node => (
                <tr key={node.id} className="border-b border-outline-variant/30 hover:bg-primary-navy/5">
                  <td className="py-4 px-2 font-bold text-primary-navy">{node.name}</td>
                  {(['recall', 'understanding', 'application', 'analysis', 'reflection'] as const).map(level => {
                    const val = node.knowledgeLevels[level];
                    let color = "text-primary-navy/40";
                    if (val >= 80) color = "text-academic-green-light font-bold";
                    else if (val >= 50) color = "text-primary-container font-bold";
                    else if (val < 30) color = "text-academic-red font-bold";
                    
                    return (
                      <td key={level} className={`py-4 px-2 ${color}`}>
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </motion.div>
  );
}
