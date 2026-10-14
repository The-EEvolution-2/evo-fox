"use client";

import React, { useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { 
  CheckSquare, 
  BookOpen, 
  Sparkles, 
  CalendarClock, 
  ArrowUpRight, 
  Clock, 
  Flame,
  CheckCircle2,
  Circle
} from "lucide-react";

export const OverviewView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { store, toggleHabit, updateTask } = useStore();

  // Metrics (Stat cards row - 4 max)
  const totalStudyMinutes = store.studyLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  const pendingTasks = store.tasks.filter((t) => t.status !== "Completed");
  const completedTasks = store.tasks.filter((t) => t.status === "Completed");
  const taskCompletionRate = store.tasks.length > 0 
    ? Math.round((completedTasks.length / store.tasks.length) * 100) 
    : 0;

  const topStreak = store.habits.reduce((acc, h) => Math.max(acc, h.streakDays), 0);
  const upcomingDeadlinesCount = store.deadlines.filter((d) => d.status !== "Completed").length;

  // Chart data: Study duration by day (flat, monochrome, zero rounded corners)
  const studyDays = useMemo(() => {
    const daysMap: Record<string, number> = {};
    // Last 7 days keys
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - 86400000 * i).toISOString().split("T")[0];
      daysMap[d] = 0;
    }
    store.studyLogs.forEach((log) => {
      if (daysMap[log.date] !== undefined) {
        daysMap[log.date] += log.durationMinutes;
      }
    });
    return Object.entries(daysMap).map(([date, minutes]) => {
      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
      return { date, dayName, minutes };
    });
  }, [store.studyLogs]);

  const maxMinutes = Math.max(...studyDays.map((d) => d.minutes), 60);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 4 Stat Cards Row - Compact 2x2 Grid on Mobile for Instant Scannability */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 bg-white border border-[#D1D5DB] rounded-xl p-2.5 sm:p-2 divide-y-0 divide-x-0 sm:divide-x divide-[#D1D5DB]">
        {/* Card 1 - Study */}
        <div className="p-2.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#2563EB]">Study</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-center justify-center text-[#2563EB]">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black font-mono tracking-tight text-black tabular-nums">
              {totalStudyHours}h
            </span>
            <span className="text-[10px] sm:text-xs text-[#2563EB] font-mono font-bold">({totalStudyMinutes}m)</span>
          </div>
          <div className="hidden sm:flex text-xs text-[#4B5563] pt-2 items-center justify-between font-medium">
            <span>{store.studyLogs.length} sessions</span>
            <span className="text-[#2563EB] font-bold uppercase font-mono text-[11px] bg-[#EFF6FF] px-1.5 py-0.5 border border-[#BFDBFE]">Active</span>
          </div>
        </div>

        {/* Card 2 - Tasks */}
        <div className="p-2.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#059669]">Tasks</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex items-center justify-center text-[#059669]">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-black font-mono tracking-tight text-black tabular-nums">
              {taskCompletionRate}%
            </span>
            <span className="text-[10px] sm:text-xs text-[#059669] font-mono font-bold">
              ({completedTasks.length}/{store.tasks.length})
            </span>
          </div>
          <div className="hidden sm:flex text-xs text-[#4B5563] pt-2 items-center justify-between font-medium">
            <span>{pendingTasks.length} pending</span>
            <span className="text-[#059669] font-bold uppercase font-mono text-[11px] bg-[#ECFDF5] px-1.5 py-0.5 border border-[#A7F3D0]">Tasks</span>
          </div>
        </div>

        {/* Card 3 - Habits */}
        <div className="p-2.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#D97706]">Streak</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg flex items-center justify-center text-[#D97706]">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-black font-mono tracking-tight text-black tabular-nums">
              {topStreak}d
            </span>
            <span className="text-[10px] sm:text-xs text-[#D97706] font-bold uppercase">streak</span>
          </div>
          <div className="hidden sm:flex text-xs text-[#4B5563] pt-2 items-center justify-between font-medium">
            <span>{store.habits.filter((h) => h.completedToday).length} done today</span>
            <span className="text-[#D97706] font-bold uppercase font-mono text-[11px] bg-[#FFFBEB] px-1.5 py-0.5 border border-[#FDE68A]">Streak</span>
          </div>
        </div>

        {/* Card 4 - Deadlines */}
        <div className="p-2.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#9333EA]">Events</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#FAF5FF] border border-[#E9D5FF] rounded-lg flex items-center justify-center text-[#9333EA]">
              <CalendarClock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-black font-mono tracking-tight text-black tabular-nums">
              {upcomingDeadlinesCount}
            </span>
            <span className="text-[10px] sm:text-xs text-[#9333EA] font-bold uppercase">due</span>
          </div>
          <div className="hidden sm:flex text-xs text-[#4B5563] pt-2 items-center justify-between font-medium">
            <span className="truncate">Next: {store.deadlines[0]?.title.slice(0, 15) || "None"}...</span>
            <span className="text-[#9333EA] font-bold uppercase font-mono text-[11px] bg-[#FAF5FF] px-1.5 py-0.5 border border-[#E9D5FF]">Sync</span>
          </div>
        </div>
      </div>

      {/* Main Flat Minimal Chart: Weekly Study Log Output */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <span className="sub-label text-slate-500">Productivity Telemetry</span>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Study Focus Allocation (7-Day Trend)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Minutes / Day</span>
        </div>

        <div className="h-44 flex items-end gap-3 pt-4">
          {studyDays.map((day) => {
            const heightPct = Math.round((day.minutes / maxMinutes) * 100);
            const isToday = day.date === new Date().toISOString().split("T")[0];
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-blue-600 tabular-nums">
                  {day.minutes > 0 ? `${day.minutes}m` : "0"}
                </span>
                <div className="w-full bg-slate-100 rounded-t-md h-28 flex items-end overflow-hidden">
                  <div
                    style={{ height: `${Math.max(6, heightPct)}%` }}
                    className={`w-full rounded-t-md transition-all duration-150 ${
                      isToday ? "bg-blue-600" : "bg-slate-800 group-hover:bg-blue-500"
                    }`}
                  />
                </div>
                <span className={`text-xs font-mono uppercase font-bold ${
                  isToday ? "text-blue-600" : "text-slate-500"
                }`}>
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Activity & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Activity Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="h-12 border-b border-slate-100 px-5 flex items-center justify-between bg-slate-50/50">
            <span className="sub-label text-slate-700">Recent Curriculum Logs</span>
            <button
              onClick={() => onNavigate("study")}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 font-mono"
            >
              Full curriculum <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {store.studyLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5 truncate pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold border border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {log.course}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">• {log.subtopic || "General"}</span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium truncate max-w-xs">{log.topic}</div>
                </div>
                <div className="text-right font-mono shrink-0 ml-3">
                  <div className="font-black text-sm text-slate-900 tabular-nums">{log.durationMinutes} min</div>
                  <div className="text-xs text-slate-500 font-semibold">{log.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks & Deadlines */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="h-12 border-b border-slate-100 px-5 flex items-center justify-between bg-slate-50/50">
            <span className="sub-label text-slate-700">Priority Queue</span>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 font-mono"
            >
              Task operations <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateTask(task.id, { status: "Completed" })}
                    className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-slate-600 flex items-center justify-center shrink-0 bg-white transition-colors"
                    title="Mark completed"
                  >
                    <Circle className="w-3.5 h-3.5 text-transparent" />
                  </button>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{task.title}</div>
                    <div className="text-xs text-slate-500 font-mono font-semibold uppercase mt-0.5">
                      {task.module} • Due {task.dueDate}
                    </div>
                  </div>
                </div>

                <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded-full border font-bold shrink-0 ${
                  task.priority === "High"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : task.priority === "Medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Targets & Milestones (Short-term & Long-term) */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="h-12 border-b border-slate-100 px-5 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="sub-label text-slate-700">Active Target Horizons</span>
            <span className="font-mono text-xs text-slate-700 font-bold border border-slate-200 px-2 py-0.5 rounded-full bg-white">
              {(store.targets || []).filter((t) => t.status !== "Achieved").length} pending
            </span>
          </div>
          <button
            onClick={() => onNavigate("targets")}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 font-mono"
          >
            Manage all targets <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {(store.targets || []).slice(0, 2).map((tgt) => (
            <div key={tgt.id} className="p-5 space-y-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded-full border font-bold ${
                  tgt.horizon === "Short-term"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-purple-200 bg-purple-50 text-purple-700"
                }`}>
                  {tgt.horizon} • {tgt.category}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">{tgt.progress}%</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {tgt.title}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, tgt.progress)}%` }}
                  className={`h-2 rounded-full ${tgt.horizon === "Short-term" ? "bg-blue-600" : "bg-purple-600"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
