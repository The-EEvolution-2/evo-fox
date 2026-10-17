"use client";

import React, { useEffect, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, Calendar, Timer, LogOut } from "lucide-react";

interface TopBarProps {
  onQuickAdd: () => void;
  onOpenPomodoro: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onQuickAdd, onOpenPomodoro }) => {
  const { activeView, searchQuery, setSearchQuery } = useStore();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getPageTitle = (view: string) => {
    switch (view) {
      case "overview":
        return "Command Overview";
      case "terms":
        return "Learning Terms (Topic / Subtopic Roadmap)";
      case "money":
        return "Money Management & Pocket Allowance";
      case "tasks":
        return "Task Operations & Priorities";
      case "study":
        return "Study Curriculum & Logs";
      case "skills":
        return "Skill Competency Matrix";
      case "deadlines":
        return "Deadlines & Sync Calendar";
      case "calendar":
        return "Monthly Calendar & Agenda";
      case "notepad":
        return "Notepad & Study Notes";
      case "habits":
        return "Habit Cadence Tracker";
      case "profile":
        return "Scholar Profile & Identity";
      case "docs":
        return "System Manual & Documentation";
      default:
        return "Internal Dashboard";
    }
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input or textarea or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="hidden md:flex h-14 border-b border-[#D1D5DB] bg-white/90 backdrop-blur-xs px-5 items-center justify-between sticky top-0 z-20 print:hidden">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <h1 className="text-sm font-bold tracking-tight text-slate-900">
          {getPageTitle(activeView)}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records... (Press /)"
            className="h-9 pl-9 pr-10 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-52 sm:w-72 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-xs font-semibold text-slate-400 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Pomodoro Timer Trigger Button */}
        <button
          onClick={onOpenPomodoro}
          className="h-9 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          title="Open Focus Pomodoro Timer (Supports Fullscreen)"
        >
          <Timer className="w-4 h-4 text-red-600 animate-pulse" />
          <span className="hidden sm:inline">Pomodoro</span>
        </button>

        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-700 font-mono border border-slate-200 rounded-lg px-3 h-9 bg-slate-50">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>{todayFormatted}</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onQuickAdd}
          className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          title="Add new record"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        {/* User Sign Out Button */}
        {user && (
          <button
            onClick={() => logout()}
            className="h-9 px-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title={`Signed in as ${user.email}. Click to log out.`}
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
