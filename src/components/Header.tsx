import React from "react";
import { ChevronRight, Bell, HelpCircle, GraduationCap, Sun, Moon } from "lucide-react";
import { SubjectName } from "../types";
import { useTheme } from "./theme-provider";

interface HeaderProps {
  currentSubject: SubjectName;
  activeCategory: string;
  activeTopicName: string;
  onSubjectChangeClick?: () => void;
}

export default function Header({ 
  currentSubject, 
  activeCategory, 
  activeTopicName,
  onSubjectChangeClick
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const isDarkActive = React.useMemo(() => {
    if (theme === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }, [theme]);

  const toggleTheme = () => {
    if (isDarkActive) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="bg-surface-card/90 backdrop-blur-md border-b border-outline-variant w-full sticky top-0 z-40 flex justify-between items-center px-8 h-[72px]">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center gap-2 font-mono text-[10px] text-primary-navy/50 uppercase tracking-widest font-medium">
        <button 
          onClick={onSubjectChangeClick}
          className="hover:text-primary-container transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-primary-navy text-xs rounded-xl"
        >
          <GraduationCap size={15} className="text-primary-container" />
          <span>{currentSubject}</span>
        </button>
        <ChevronRight size={12} className="text-primary-navy/30" />
        <span className="text-primary-navy/40">{activeCategory}</span>
        <ChevronRight size={12} className="text-primary-navy/30" />
        <span className="text-primary-container font-mono font-bold bg-primary-container/10 border border-primary-container/20 px-2.5 py-1 text-[10px] rounded-none tracking-widest uppercase">
          {activeTopicName}
        </span>
      </div>

      {/* Trailing Controls */}
      <div className="flex items-center gap-4 text-primary-navy/60">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDarkActive ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 border border-outline-variant/60 hover:border-outline-variant bg-surface-card hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer flex items-center justify-center rounded-xl text-primary-navy"
        >
          {isDarkActive ? (
            <Sun size={16} className="hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon size={16} className="hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        <button className="p-2 border border-outline-variant/60 hover:border-outline-variant bg-surface-card hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer relative rounded-xl">
          <Bell size={16} className="text-primary-navy/80" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-container rounded-none" />
        </button>
        <button 
          title="Cognitive Mentor Core"
          className="p-2 border border-outline-variant/60 hover:border-outline-variant bg-surface-card hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer rounded-xl"
        >
          <HelpCircle size={16} className="text-primary-navy/80" />
        </button>
      </div>
    </header>
  );
}
