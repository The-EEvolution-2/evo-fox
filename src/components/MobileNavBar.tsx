"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { 
  LayoutDashboard, 
  BookMarked, 
  Wallet, 
  CalendarDays, 
  StickyNote, 
  UserCircle,
  Plus,
  Flame,
  CheckSquare,
  Sparkles,
  BookOpen,
  HelpCircle,
  X,
  Timer
} from "lucide-react";

interface MobileAppChromeProps {
  onQuickAdd: () => void;
  onOpenPomodoro: () => void;
}

export function MobileNavBar({ onQuickAdd, onOpenPomodoro }: MobileAppChromeProps) {
  const { activeView, setActiveView, store } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Primary 4 tabs for standard mobile app tab bar
  const mainTabs = [
    { id: "overview", label: "Home", icon: LayoutDashboard },
    { id: "terms", label: "Terms", icon: BookMarked },
    { id: "money", label: "Money", icon: Wallet },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "notepad", label: "Notes", icon: StickyNote },
  ];

  // Secondary views inside the mobile drawer
  const moreViews = [
    { id: "tasks", label: "Tasks & Priorities", icon: CheckSquare, count: store.tasks.filter(t => t.status !== "Completed").length },
    { id: "study", label: "Study Curriculum", icon: BookOpen, count: store.studyLogs.length },
    { id: "targets", label: "Targets & Goals", icon: Sparkles, count: store.targets.filter(t => t.status !== "Achieved").length },
    { id: "habits", label: "Habit Tracker", icon: Flame, count: `${store.habits.filter(h => h.completedToday).length}/${store.habits.length}` },
    { id: "profile", label: "Scholar Profile", icon: UserCircle },
    { id: "docs", label: "Documentation", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 h-14 flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="FoxLogo"
            className="w-7 h-7 rounded-lg object-contain bg-blue-600 p-0.5 shadow-xs"
          />
          <div>
            <div className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
              AuraEdu
            </div>
            <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
              {activeView}
            </div>
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Action */}
          <button
            onClick={onOpenPomodoro}
            className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center active:scale-95 transition-transform"
            title="Pomodoro Timer"
          >
            <Timer className="w-4 h-4" />
          </button>

          {/* Quick Add Action */}
          <button
            onClick={onQuickAdd}
            className="h-8 px-3 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>

          {/* More Drawer Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95"
            title="All Modules"
          >
            <span className="text-xs font-bold leading-none">•••</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Native App Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg print:hidden safe-area-bottom">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 flex-1 active:scale-95 ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-slate-500"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Drawer for Other Modules */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs">
          <div 
            className="absolute inset-0" 
            onClick={() => setDrawerOpen(false)} 
          />
          <div className="relative bg-white rounded-t-2xl p-5 shadow-2xl border-t border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">All Modules & Views</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreViews.map((mv) => {
                const Icon = mv.icon;
                const isActive = activeView === mv.id;
                return (
                  <button
                    key={mv.id}
                    onClick={() => {
                      setActiveView(mv.id);
                      setDrawerOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isActive
                        ? "bg-blue-50/80 border-blue-300 text-blue-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs truncate">{mv.label}</div>
                      {mv.count !== undefined && (
                        <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                          {mv.count} active
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
