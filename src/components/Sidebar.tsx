import React from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Network, 
  BrainCircuit, 
  Settings, 
  Lightbulb, 
  GraduationCap,
  BarChart3,
  LogOut
} from "lucide-react";
import { SubjectName, StudentProfile } from "../types";
import { useAuth } from "../AuthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  onRequestHint: () => void;
  misconceptionCount?: number;
}

export default function Sidebar({ activeTab, setActiveTab, profile, onRequestHint, misconceptionCount = 0 }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "knowledge-profile", label: "Knowledge Profile", icon: BarChart3 },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "mastery-map", label: "Mastery Map", icon: Network },
    { id: "reflections", label: "Reflections", icon: BrainCircuit },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-card border-r border-outline-variant flex flex-col py-6 px-4 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-none bg-primary-container text-on-primary flex items-center justify-center font-bold font-mono text-lg tracking-tighter">
          SA
        </div>
        <div>
          <h1 className="font-sans text-lg tracking-tight font-black uppercase text-primary-navy">
            Socratic AI
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] text-primary-navy/50 font-semibold font-mono">
            COGNITIVE.MENTOR
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-none text-left font-sans text-xs uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-primary-navy/5 text-primary-navy font-bold border-l-4 border-primary-container"
                  : "text-primary-navy/60 hover:bg-primary-navy/5 hover:text-primary-navy"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  size={16} 
                  className={`${isActive ? "text-primary-container" : "text-primary-navy/40"}`} 
                />
                <span>{item.label}</span>
              </div>
              {item.id === "knowledge-profile" && misconceptionCount > 0 && (
                <span className="bg-academic-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {misconceptionCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Primary Action Button (Hint Callout) */}
      <div className="mt-auto flex flex-col gap-4">
        {activeTab !== "settings" && (
          <button
            onClick={onRequestHint}
            className="w-full py-3 px-4 rounded-xl border border-primary-container/40 hover:border-primary-container text-primary-container font-mono font-bold tracking-widest text-[10px] uppercase hover:bg-primary-container hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Lightbulb size={14} className="text-primary-container" />
            <span>Request Hint</span>
          </button>
        )}

        {/* Student Profile Card */}
        <div className="flex flex-col gap-2 border-t border-outline-variant pt-4 mt-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-none bg-surface-container-high overflow-hidden border border-outline-variant">
              <img
                src={user?.photoURL || profile.avatarUrl}
                alt={user?.displayName || profile.name}
                className="w-full h-full object-cover grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 flex flex-col text-left overflow-hidden">
              <span className="font-sans font-bold text-xs uppercase text-primary-navy tracking-wide leading-tight truncate">
                {user?.displayName || profile.name}
              </span>
              <span className="font-mono text-[9px] text-primary-navy/40 uppercase tracking-widest font-semibold">
                {profile.role}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-1.5 text-primary-navy/40 hover:text-academic-red transition-colors"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
