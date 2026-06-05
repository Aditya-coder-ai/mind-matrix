import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, 
  User, 
  GraduationCap, 
  Sliders, 
  Volume2, 
  Globe, 
  Cpu, 
  Save, 
  CheckCircle,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { SubjectName, StudentProfile } from "../types";
import { useTheme } from "./theme-provider";

interface SettingsScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
}

export default function SettingsScreen({
  profile,
  onUpdateProfile
}: SettingsScreenProps) {
  const [studentName, setStudentName] = useState(profile.name);
  const [studentRole, setStudentRole] = useState(profile.role);
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>(profile.currentSubject);
  const [mentorVoice, setMentorVoice] = useState("Zephyr");
  const [searchGrounding, setSearchGrounding] = useState(true);
  const [ttsPlayback, setTtsPlayback] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    onUpdateProfile({
      name: studentName,
      role: studentRole,
      currentSubject: selectedSubject
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const subjects: SubjectName[] = ["Chemistry", "Physics", "Mathematics", "DSA", "DBMS"];
  const roles: Array<StudentProfile["role"]> = ["Student", "Scholar", "Researcher"];
  const voices = [
    { id: "Zephyr", name: "Zephyr (Classic Socratic)" },
    { id: "Kore", name: "Kore (Modern Academic)" },
    { id: "Charon", name: "Charon (Philosophical Inquirer)" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8 bg-dot-pattern min-h-screen text-left"
    >
      <header className="mb-4">
        <h2 className="font-sans text-3xl font-extrabold text-primary-navy uppercase tracking-tighter">
          Cognitive Configurations
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffffff]/50 mt-1">
          Calibrate Socratic AI's pedagogical parameters, cognitive curriculum models, and AI engine behaviors.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: General Profile Setup Card */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Profile Card */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-6 flex flex-col gap-6">
            <h3 className="font-mono font-bold text-xs text-primary-navy uppercase tracking-widest flex items-center gap-2 border-b border-outline-variant pb-3">
              <User size={16} className="text-primary-container" />
              <span>Student Profile Settings</span>
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-mono font-bold text-primary-navy/50 uppercase tracking-[0.2em] mb-2">
                  Full Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-none border border-outline-variant focus:border-primary-container focus:ring-0 outline-none font-sans text-sm text-primary-navy"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-primary-navy/50 uppercase tracking-[0.2em] mb-2">
                  Academic Designation
                </label>
                <div className="flex gap-2">
                  {roles.map((designation) => (
                    <button
                      key={designation}
                      onClick={() => setStudentRole(designation)}
                      className={`flex-1 py-3 px-3 border rounded-none font-mono text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${
                        studentRole === designation
                          ? "bg-primary-container text-black border-primary-container"
                          : "border-outline-variant text-primary-navy/60 bg-surface-container-low hover:bg-primary-navy/5"
                      }`}
                    >
                      {designation}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Subject (DYNAMIC curriculum switcher) */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-6 flex flex-col gap-6">
            <h3 className="font-mono font-bold text-xs text-primary-navy uppercase tracking-widest flex items-center gap-2 border-b border-outline-variant pb-3">
              <GraduationCap size={16} className="text-primary-container" />
              <span>Cognitive Curriculum Switcher</span>
            </h3>
            
            <p className="font-serif text-sm text-primary-navy/70 leading-relaxed italic">
              Dynamically recalibrate the Socratic mentor. Swapping changes all dialogue queues, diagnostic trackers, and concept landscape maps.
            </p>

            <div className="flex flex-col gap-2">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`w-full py-3.5 px-4 border rounded-none flex justify-between items-center cursor-pointer transition-all duration-200 ${
                    selectedSubject === subj
                      ? "bg-primary-container/10 text-primary-container border-primary-container font-bold"
                      : "border-outline-variant text-primary-navy/60 bg-surface-container-low hover:bg-primary-navy/5"
                  }`}
                >
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">{subj} Curriculum</span>
                  {selectedSubject === subj && (
                    <CheckCircle size={16} className="text-primary-container animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Socratic Mentor Auditory Tone Settings */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-6 flex flex-col gap-6">
            <h3 className="font-mono font-bold text-xs text-primary-navy uppercase tracking-widest flex items-center gap-2 border-b border-outline-variant pb-3">
              <Volume2 size={16} className="text-primary-container" />
              <span>Socratic Mentor Auditory Settings</span>
            </h3>

            <div>
              <label className="block text-[9px] font-mono font-bold text-primary-navy/50 uppercase tracking-[0.2em] mb-2">
                Prebuilt Voice Speaker Mode
              </label>
              <select
                value={mentorVoice}
                onChange={(e) => setMentorVoice(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-3 rounded-none border border-outline-variant focus:border-primary-container focus:ring-0 outline-none font-mono text-xs uppercase tracking-wider font-bold text-primary-navy cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id} className="bg-surface-container-low text-primary-navy">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch sliders */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ttsPlayback}
                  onChange={(e) => setTtsPlayback(e.target.checked)}
                  className="rounded-none border-outline-variant text-primary-container bg-surface-container-low focus:ring-0 h-4 w-4"
                />
                <span className="font-sans text-xs text-primary-navy/70">
                  Trigger TTS Text-to-Speech audio response playback (Gemini Indian/Zephyr)
                </span>
              </label>
            </div>
          </div>

          {/* Socratic Mentor Appearance Theme Settings */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-6 flex flex-col gap-6">
            <h3 className="font-mono font-bold text-xs text-primary-navy uppercase tracking-widest flex items-center gap-2 border-b border-outline-variant pb-3">
              <Sliders size={16} className="text-primary-container" />
              <span>Appearance Configurations</span>
            </h3>

            <p className="font-serif text-sm text-primary-navy/70 leading-relaxed italic">
              Dynamically switch Socratic AI's visual atmosphere. Choose between light, dark, or sync with your operating system settings.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 py-4 px-2 border rounded-none font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  theme === "light"
                    ? "bg-primary-container text-black border-primary-container font-black"
                    : "border-outline-variant text-primary-navy/60 bg-surface-container-low hover:bg-primary-navy/5"
                }`}
              >
                <Sun size={18} />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 py-4 px-2 border rounded-none font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  theme === "dark"
                    ? "bg-primary-container text-black border-primary-container font-black"
                    : "border-outline-variant text-primary-navy/60 bg-surface-container-low hover:bg-primary-navy/5"
                }`}
              >
                <Moon size={18} />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 py-4 px-2 border rounded-none font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  theme === "system"
                    ? "bg-primary-container text-black border-primary-container font-black"
                    : "border-outline-variant text-primary-navy/60 bg-surface-container-low hover:bg-primary-navy/5"
                }`}
              >
                <Laptop size={18} />
                <span>System Sync</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Engine & Workspace Configurations */}
        <div className="md:col-span-1 flex flex-col gap-8">
          
          {/* Gemini AI Settings */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-5 flex flex-col gap-4">
            <h3 className="font-mono font-bold text-[10px] text-primary-navy flex items-center gap-2 border-b border-outline-variant pb-3 uppercase tracking-widest">
              <Cpu size={14} className="text-primary-container" />
              <span>Gemini AI Engine Settings</span>
            </h3>

            <div className="flex flex-col gap-4 text-xs font-medium text-primary-navy/90">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchGrounding}
                  onChange={(e) => setSearchGrounding(e.target.checked)}
                  className="rounded-none border-outline-variant text-primary-container bg-surface-container-low focus:ring-0 h-4 w-4 shrink-0 mt-0.5"
                />
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary-navy">Google Search Grounding</span>
                  <span className="text-[10px] text-primary-navy/50 font-normal mt-1 leading-normal">
                    Queries the latest web context dynamically to enrich Stoichiometry & Newton calculations.
                  </span>
                </div>
              </label>

              <div className="flex flex-col text-left border-t border-outline-variant pt-4">
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-primary-navy/40 mb-2">Assigned Model</span>
                <span className="font-mono text-xs font-black bg-primary-container text-black px-2.5 py-1.5 rounded-none inline-block text-center uppercase tracking-wider">
                  gemini-2.0-flash
                </span>
                <span className="text-[10px] text-primary-navy/50 mt-2 leading-relaxed">
                  Premium fast translation and reasoning for logical STEM dialogues.
                </span>
              </div>
            </div>
          </div>

          {/* Technical Container Information */}
          <div className="bg-[#0c0c0c] border border-outline-variant rounded-none p-5 flex flex-col gap-4">
            <h3 className="font-mono font-bold text-[10px] text-primary-navy flex items-center gap-2 border-b border-outline-variant pb-3 uppercase tracking-widest">
              <Info size={14} className="text-primary-container" />
              <span>Workspace Stack</span>
            </h3>

            <div className="flex flex-col gap-3.5 text-[10px] font-mono uppercase tracking-wider text-primary-navy/60 text-left">
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span>Frontend:</span>
                <span className="font-bold text-primary-navy">React 19 + TS</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span>Bundler:</span>
                <span className="font-bold text-primary-navy">Vite + ESBuild</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>AI Handler:</span>
                <span className="font-bold text-primary-navy">@google/generative-ai</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Save Button */}
      <footer className="mt-4 flex items-center justify-between border-t border-outline-variant bg-[#0c0c0c] p-6 rounded-none">
        <span className="text-xs text-primary-navy/50 font-medium font-serif italic">
          Calibrate fully. Socratic AI remembers configurations across tabs.
        </span>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-academic-green-light font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider"
              >
                <CheckCircle size={14} />
                <span>Calibrations Saved!</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            className="px-6 py-3.5 bg-primary-container hover:bg-primary-container/80 text-black font-mono font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save size={15} />
            <span>Save Calibrations</span>
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
