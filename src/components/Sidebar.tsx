"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  BookMarked,
  Sparkles, 
  CalendarClock, 
  CalendarDays,
  Flame, 
  Wallet,
  ChevronLeft, 
  ChevronRight,
  Database,
  SlidersHorizontal,
  HelpCircle,
  StickyNote,
  UserCircle
} from "lucide-react";

interface SidebarProps {
  onOpenVaultModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenVaultModal }) => {
  const { activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed, store } = useStore();

  const pendingTasks = store.tasks.filter((t) => t.status !== "Completed").length;
  const upcomingDeadlines = store.deadlines.filter((d) => d.status !== "Completed").length;
  const activeHabits = store.habits.filter((h) => h.completedToday).length;
  const unlearnedTerms = (store.terms || []).filter((t) => !t.learned).length;
  const totalExpenses = (store.moneyRecords || [])
    .filter((r) => r.type === "Expense")
    .reduce((sum, r) => sum + r.amount, 0);

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
      color: "text-[#2563EB]",
      activeBg: "bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF]",
      badgeStyle: "bg-white text-[#2563EB] border-[#BFDBFE]",
    },
    {
      id: "terms",
      label: "Learning Terms",
      icon: BookMarked,
      badge: unlearnedTerms > 0 ? String(unlearnedTerms) : "✓",
      color: "text-[#059669]",
      activeBg: "bg-[#ECFDF5] border-[#059669] text-[#065F46]",
      badgeStyle: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
    },
    {
      id: "money",
      label: "Money & Pocket",
      icon: Wallet,
      badge: `₹${totalExpenses}`,
      color: "text-[#10B981]",
      activeBg: "bg-[#F0FDF4] border-[#10B981] text-[#166534]",
      badgeStyle: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    },
    {
      id: "tasks",
      label: "Task Operations",
      icon: CheckSquare,
      badge: pendingTasks > 0 ? String(pendingTasks) : null,
      color: "text-[#D97706]",
      activeBg: "bg-[#FFFBEB] border-[#D97706] text-[#92400E]",
      badgeStyle: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    },
    {
      id: "targets",
      label: "Targets & Goals",
      icon: SlidersHorizontal,
      badge: `${(store.targets || []).filter((t) => t.status !== "Achieved").length}`,
      color: "text-[#9333EA]",
      activeBg: "bg-[#FAF5FF] border-[#9333EA] text-[#6B21A8]",
      badgeStyle: "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]",
    },
    {
      id: "study",
      label: "Study Curriculum",
      icon: BookOpen,
      badge: `${store.studyLogs.length}`,
      color: "text-[#2563EB]",
      activeBg: "bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF]",
      badgeStyle: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
    },
    {
      id: "skills",
      label: "Skill Competencies",
      icon: Sparkles,
      badge: `${store.skills.length}`,
      color: "text-[#E11D48]",
      activeBg: "bg-[#FFF1F2] border-[#E11D48] text-[#9F1239]",
      badgeStyle: "bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]",
    },
    {
      id: "deadlines",
      label: "Deadlines & Sync",
      icon: CalendarClock,
      badge: upcomingDeadlines > 0 ? String(upcomingDeadlines) : null,
      color: "text-[#7C3AED]",
      activeBg: "bg-[#F5F3FF] border-[#7C3AED] text-[#5B21B6]",
      badgeStyle: "bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]",
    },
    {
      id: "calendar",
      label: "Monthly Calendar",
      icon: CalendarDays,
      badge: null,
      color: "text-[#2563EB]",
      activeBg: "bg-[#EFF6FF] border-[#2563EB] text-[#1E40AF]",
      badgeStyle: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
    },
    {
      id: "notepad",
      label: "Notepad & Notes",
      icon: StickyNote,
      badge: (store.notes || []).length > 0 ? `${(store.notes || []).length}` : null,
      color: "text-[#D97706]",
      activeBg: "bg-[#FFFBEB] border-[#D97706] text-[#92400E]",
      badgeStyle: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    },
    {
      id: "habits",
      label: "Habit Cadence",
      icon: Flame,
      badge: `${activeHabits}/${store.habits.length}`,
      color: "text-[#EA580C]",
      activeBg: "bg-[#FFF7ED] border-[#EA580C] text-[#9A3412]",
      badgeStyle: "bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]",
    },
    {
      id: "profile",
      label: "Scholar Profile",
      icon: UserCircle,
      badge: null,
      color: "text-[#4F46E5]",
      activeBg: "bg-[#EEF2FF] border-[#4F46E5] text-[#3730A3]",
      badgeStyle: "bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]",
    },
    {
      id: "docs",
      label: "About & Docs",
      icon: HelpCircle,
      badge: null,
      color: "text-[#0891B2]",
      activeBg: "bg-[#ECFEFF] border-[#0891B2] text-[#155E75]",
      badgeStyle: "bg-[#CFFAFE] text-[#155E75] border-[#A5F3FC]",
    },
  ];

  return (
    <aside
      className={`hidden md:flex h-screen sticky top-0 bg-[#F9FAFB] border-r border-[#D1D5DB] flex-col justify-between shrink-0 transition-all duration-150 z-30 select-none print:hidden ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Header */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-16 border-b border-[#D1D5DB] px-4 flex items-center justify-between shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="/logo.png"
                alt="EVOFOX Logo"
                className="w-8 h-8 rounded-lg object-cover shadow-xs border border-blue-200"
              />
              <span className="font-bold text-sm tracking-tight text-slate-900">
                EVOFOX
              </span>
            </div>
          )}

          {sidebarCollapsed && (
            <img
              src="/logo.png"
              alt="EVOFOX Logo"
              className="w-8 h-8 mx-auto rounded-lg object-cover shadow-xs border border-blue-200"
            />
          )}

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className={`h-8 w-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors ${
              sidebarCollapsed ? "hidden" : "block"
            }`}
            title="Toggle sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List - Scrollable when window is small */}
        <nav className="p-2 space-y-1 overflow-y-auto flex-1 min-h-0 [scrollbar-width:thin]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center text-left transition-all duration-150 h-10 px-3 rounded-lg shrink-0 ${
                  isActive
                    ? `${item.activeBg} font-bold shadow-xs`
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : "text-slate-500"}`} />

                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between ml-3 overflow-hidden">
                    <span className="text-sm truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-200 space-y-1.5">
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="w-full h-9 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenVaultModal}
          className={`w-full flex items-center h-9 px-3 text-xs text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 rounded-md transition-colors font-medium ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
          title="Storage Vault & Export"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" />
            {!sidebarCollapsed && <span className="font-semibold text-xs">Vault & JSON Backup</span>}
          </div>
          {!sidebarCollapsed && (
            <span className="text-[11px] uppercase font-bold text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-sm bg-emerald-50">Cloud</span>
          )}
        </button>
      </div>
    </aside>
  );
};
