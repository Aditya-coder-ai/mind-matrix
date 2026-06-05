import React, { Suspense } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  RefreshCw, 
  Lock, 
  Award, 
  AlertTriangle,
  Brain,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { SubjectName, StudentProfile, TopicNode, Reflection, TrackedMisconception } from "../types";
import { SUBJECT_COGNITIVE_friction } from "../data";

// Lazy load the heavy 3D background
const ParticleField3D = React.lazy(() => import("./ParticleField3D"));

interface DashboardScreenProps {
  profile: StudentProfile;
  nodes: TopicNode[];
  reflections: Reflection[];
  trackedMisconceptions: TrackedMisconception[];
  onNavigateToTopic: (topicId: string) => void;
  onNavigateToReflections: () => void;
}

const SUBJECT_THEMES: Record<SubjectName, { subtitle: string; badge: string; curvePts: string }> = {
  Chemistry: {
    subtitle: "Your cognitive model indicates active development in Stoichiometric models, with localized friction points in molecular conversions. Let's review your learning orbit.",
    badge: "Chemistry Theory",
    curvePts: "M 0,85 Q 25,75 50,45 T 75,35 T 100,5"
  },
  Physics: {
    subtitle: "Your cognitive model indicates strong synthesis in Newtonian mechanics, but reveals emerging friction points in thermodynamic principles. Let us review your trajectory.",
    badge: "Newtonian Physics",
    curvePts: "M 0,80 Q 20,70 40,50 T 70,30 T 100,10"
  },
  Mathematics: {
    subtitle: "Your cognitive model indicates advanced computational limit derivation, but reveals minor misalignments upon discontinous piecewise boundaries. Let us explore your vector map.",
    badge: "Limits & Integrals",
    curvePts: "M 0,90 Q 30,80 50,60 T 80,40 T 100,15"
  },
  DSA: {
    subtitle: "Your cognitive model reveals solid linear structure fluency but identifies friction in tree traversal invariants and graph cycle management. Let us trace your algorithmic growth.",
    badge: "Algorithms & Structures",
    curvePts: "M 0,88 Q 20,72 45,55 T 70,35 T 100,12"
  },
  DBMS: {
    subtitle: "Your cognitive model shows strong relational algebra foundations but flags emerging friction in normalization decomposition and concurrency control paradigms.",
    badge: "Database Systems",
    curvePts: "M 0,82 Q 25,70 48,52 T 72,38 T 100,18"
  }
};

export default function DashboardScreen({
  profile,
  nodes,
  reflections,
  trackedMisconceptions,
  onNavigateToTopic,
  onNavigateToReflections
}: DashboardScreenProps) {
  const currentSubject = profile.currentSubject;
  const theme = SUBJECT_THEMES[currentSubject];
  
  const subjectNodes = nodes.filter(n => n.subject === currentSubject);
  const frictionAreas = trackedMisconceptions
    .filter(m => subjectNodes.some(n => n.id === m.topicId) && !m.resolved)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);

  // Filter nodes relevant to current subject
  const activeNodes = subjectNodes.filter(n => n.status === "active");
  const masteredNodes = subjectNodes.filter(n => n.status === "mastered");
  const pendingNodes = subjectNodes.filter(n => n.status === "pending");

  // Sum average mastery
  const averageMastery = Math.round(
    subjectNodes.reduce((acc, curr) => acc + curr.mastery, 0) / (subjectNodes.length || 1)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="relative p-8 max-w-7xl mx-auto w-full flex flex-col gap-8 min-h-screen overflow-hidden"
    >
      {/* 3D Background - Loaded asynchronously */}
      <Suspense fallback={null}>
        <ParticleField3D />
      </Suspense>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col gap-8 w-full">
      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant p-8 rounded-none bg-surface-card backdrop-blur-md">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-container font-bold">
              Cognitive Profile
            </span>
            <div className="w-1.5 h-1.5 bg-primary-container" />
            <span className="font-mono text-[10px] text-primary-navy/50 uppercase tracking-[0.15em]">Avg Mastery: {averageMastery}%</span>
          </div>
          <h2 className="font-sans text-4xl font-extrabold text-primary-navy tracking-tighter uppercase mb-3">
            Welcome back, {profile.name}.
          </h2>
          <p className="font-serif text-sm text-primary-navy/70 max-w-3xl leading-relaxed">
            {theme.subtitle}
          </p>
        </div>
        
        {/* Quick subject indicator stat card */}
        <div className="flex items-center gap-4 bg-primary-navy/5 p-4 rounded-none border border-outline-variant shrink-0 self-start md:self-center">
          <div className="w-10 h-10 rounded-none bg-primary-container flex items-center justify-center text-on-primary font-mono font-bold">
            <Award size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-mono uppercase tracking-widest text-primary-navy/40">Active Area</span>
            <span className="text-sm font-bold uppercase tracking-wider text-primary-navy">{currentSubject}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Graph Trajectory (Wide Card) */}
        <div className="lg:col-span-8 bg-surface-card border border-outline-variant rounded-none p-6 flex flex-col min-h-[340px]">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-primary-navy">
                Mastery Trajectory
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary-navy/40">
                Cognitive consolidation over the last 30 days
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-primary-container/10 text-primary-container border border-primary-container/20 font-mono font-bold text-[9px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-primary-container" />
              {theme.badge}
            </span>
          </div>

          {/* Custom SVG Line Graph */}
          <div className="flex-1 w-full relative min-h-[180px] border-b border-l border-outline-variant mt-4">
            {/* Horizontal background helper lines */}
            <div className="absolute left-0 right-0 top-0 border-t border-dashed border-outline-variant text-[9px] font-mono uppercase tracking-widest text-primary-navy/30 pl-2">90% (Master)</div>
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-outline-variant text-[9px] font-mono uppercase tracking-widest text-primary-navy/30 pl-2">50% (Active)</div>
            <div className="absolute left-0 right-0 bottom-1 border-t border-dashed border-outline-variant text-[9px] font-mono uppercase tracking-widest text-primary-navy/30 pl-2">10% (Novice)</div>

            {/* Simulated graph elements */}
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                className="text-primary-container" 
                d={theme.curvePts} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Nodes along the path */}
              <circle className="text-primary-navy/40" cx="0" cy="83" fill="currentColor" r="3.5" />
              <circle className="text-primary-navy/60" cx="33" cy="65" fill="currentColor" r="3.5" />
              <circle className="text-primary-navy/80" cx="66" cy="40" fill="currentColor" r="3.5" />
              <circle className="text-primary-container" cx="100" cy="12" fill="currentColor" r="5" />
            </svg>
          </div>

          <div className="flex justify-between mt-3 font-mono text-[9px] uppercase tracking-widest text-primary-navy/40 font-semibold">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Current Progress</span>
          </div>
        </div>

        {/* Cognitive Friction areas (Radial Friction Card) */}
        <div className="lg:col-span-4 bg-surface-card border border-outline-variant rounded-none p-6 flex flex-col justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2 text-academic-red">
              <AlertTriangle size={18} />
              <h3 className="font-sans font-bold text-lg uppercase tracking-wider text-primary-navy">
                Cognitive Friction
              </h3>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary-navy/40 leading-relaxed">
              Conceptual misalignments flagged in discussions.
            </p>
          </div>

          <div className="flex flex-col gap-5 my-6 text-left">
            {frictionAreas.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-primary-navy truncate max-w-[200px] uppercase tracking-wide">{item.concept}</span>
                  <span className={`text-[9px] uppercase tracking-wider ${
                    item.severity > 0.6 ? "text-academic-red" : "text-primary-container"
                  }`}>{item.severity > 0.6 ? "High Impact" : "Moderate"}</span>
                </div>
                
                {/* Horizontal scale metric */}
                <div className="w-full bg-primary-navy/5 rounded-none h-1.5 overflow-hidden border border-outline-variant">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.severity * 100}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                    className={`h-full ${
                      item.severity > 0.6 ? "bg-academic-red" : "bg-primary-container"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigateToTopic(activeNodes[0]?.id || subjectNodes[0]?.id)}
            className="w-full py-3 px-4 bg-primary-container hover:bg-primary-container/80 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Resolve Friction</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Personalized Learning Pathway (Wide horizontal) */}
        <div className="lg:col-span-12 text-left">
          <h3 className="font-sans text-xl font-black uppercase tracking-wider text-primary-navy mb-4 mt-2">
            Recommended Pathway
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Active / Review card */}
            {activeNodes.slice(0, 1).map((node) => (
              <div 
                key={node.id}
                onClick={() => onNavigateToTopic(node.id)}
                className="bg-surface-card border border-outline-variant hover:border-primary-container rounded-none p-6 shadow-sm transition-all cursor-pointer group hover:bg-white/[0.02] flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="w-9 h-9 rounded-none bg-primary-container/10 border border-primary-container/30 flex items-center justify-center mb-4">
                    <RefreshCw size={16} className="text-primary-container animate-spin-slow" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-primary-container mb-1 block">Active Study</span>
                  <h4 className="font-sans font-extrabold text-primary-navy text-base uppercase tracking-tight mb-2 group-hover:text-primary-container transition-colors">
                    {node.name}
                  </h4>
                  <p className="font-sans text-xs text-primary-navy/50 line-clamp-2">
                    {node.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant/30 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-primary-container group-hover:text-primary-navy transition-colors flex items-center justify-center gap-2">
                  <Sparkles size={12} /> Launch Quick Assessment
                </div>
              </div>
            ))}

            {/* Challenge Node Card */}
            {pendingNodes.slice(0, 1).map((node) => (
              <div 
                key={node.id}
                onClick={() => onNavigateToTopic(node.id)}
                className="bg-surface-card border border-outline-variant hover:border-outline-variant rounded-xl p-6 shadow-sm transition-all cursor-pointer group hover:bg-surface-container flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-primary-navy/5 border border-outline-variant flex items-center justify-center mb-4">
                    <Sparkles size={16} className="text-primary-navy" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-primary-navy/60 mb-1 block">Intelligent Challenge</span>
                  <h4 className="font-sans font-extrabold text-primary-navy text-base uppercase tracking-tight mb-2 group-hover:text-primary-container transition-colors">
                    {node.name}
                  </h4>
                  <p className="font-sans text-xs text-primary-navy/50 line-clamp-2">
                    {node.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Locked Node Card */}
            <div className="bg-white/[0.02] border border-outline-variant border-dashed rounded-none p-6 flex flex-col justify-between min-h-[160px] opacity-50">
              <div>
                <div className="w-9 h-9 rounded-none bg-primary-navy/5 border border-outline-variant flex items-center justify-center mb-4">
                  <Lock size={16} className="text-primary-navy/40" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-primary-navy/40 mb-1 block">Future Core</span>
                <h4 className="font-sans font-extrabold text-primary-navy/70 text-base uppercase tracking-tight mb-2">
                  Advanced Adaptations
                </h4>
                <p className="font-sans text-xs text-primary-navy/40">
                  Complete pending stoichiometric excess ratios to unlock dynamic system models.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Reflections section */}
        <div className="lg:col-span-12 mt-4 text-left">
          <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-4">
            <h3 className="font-sans text-xl font-black uppercase tracking-wider text-primary-navy">
              Recent reflections
            </h3>
            <button 
              onClick={onNavigateToReflections}
              className="text-xs font-mono uppercase tracking-wider font-bold text-primary-container hover:underline cursor-pointer rounded-xl"
            >
              Take Reflection Journal
            </button>
          </div>

          <div className="space-y-6">
            {reflections.length === 0 ? (
              <div className="text-center p-8 bg-surface-card rounded-none border border-outline-variant text-primary-navy/40 text-xs font-mono uppercase tracking-widest">
                No reflections logged yet. Jump in the Reflections tab to submit your first analysis!
              </div>
            ) : (
              reflections.map((ref) => (
                <div key={ref.id} className="bg-surface-card border border-outline-variant rounded-none p-6 flex flex-col md:flex-row gap-6">
                  {/* Icon Indicator columns */}
                  <div className="hidden md:flex flex-col items-center mt-1 shrink-0">
                    <div className="w-9 h-9 rounded-none bg-primary-navy/5 border border-outline-variant flex items-center justify-center text-primary-navy">
                      <Brain size={18} />
                    </div>
                    <div className="w-[1px] h-full bg-primary-navy/10 my-2" />
                  </div>

                  {/* Reflection & Socratic synthesis content block */}
                  <div className="flex-1 flex flex-col gap-4">
                    {/* User thoughts */}
                    <div className="bg-primary-navy/5 p-6 rounded-none relative border border-outline-variant text-left">
                      <p className="font-serif text-base text-primary-navy mb-3 italic">
                        "{ref.answer}"
                      </p>
                      <div className="flex justify-between items-center text-[9px] font-mono text-primary-navy/40 font-bold tracking-widest uppercase">
                        <span>Student Log • {ref.topicName}</span>
                        <span>{new Date(ref.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Socratic response evaluation */}
                    <div className="bg-primary-container/[0.03] p-6 rounded-none ml-2 md:ml-6 text-left border border-primary-container/20">
                      <h4 className="text-[9px] font-mono uppercase tracking-widest font-bold text-primary-container mb-2">Mentor Synthesis</h4>
                      <p className="font-sans text-sm text-primary-navy/90 leading-relaxed">
                        {ref.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      </div>
    </motion.div>
  );
}
