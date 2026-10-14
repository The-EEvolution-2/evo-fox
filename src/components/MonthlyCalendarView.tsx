"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { MeetingDeadline, TaskItem, StudyLog } from "@/types/app";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  BookOpen, 
  CheckSquare, 
  AlertCircle
} from "lucide-react";

export function MonthlyCalendarView() {
  const { store } = useStore();
  const { deadlines, tasks, studyLogs } = store;
  
  // Track currently viewed month and year
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [filterType, setFilterType] = useState<"all" | "deadlines" | "tasks" | "study">("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month days filler
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Next month days filler to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Aggregate items mapped by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: Record<string, {
      deadlines: MeetingDeadline[];
      tasks: TaskItem[];
      studyLogs: StudyLog[];
    }> = {};

    const getBucket = (key: string) => {
      if (!map[key]) {
        map[key] = { deadlines: [], tasks: [], studyLogs: [] };
      }
      return map[key];
    };

    // Deadlines
    (deadlines || []).forEach((dl: MeetingDeadline) => {
      if (!dl.dueDateTime) return;
      const key = dl.dueDateTime.split("T")[0];
      getBucket(key).deadlines.push(dl);
    });

    // Tasks (matching dueDate or createdAt)
    (tasks || []).forEach((t: TaskItem) => {
      const key = t.dueDate || (t.createdAt ? t.createdAt.split("T")[0] : "");
      if (key) {
        getBucket(key).tasks.push(t);
      }
    });

    // Study logs
    (studyLogs || []).forEach((sl: StudyLog) => {
      if (!sl.date) return;
      getBucket(sl.date).studyLogs.push(sl);
    });

    return map;
  }, [deadlines, tasks, studyLogs]);

  // Active selected day items
  const selectedDayEvents = eventsByDate[selectedDateStr] || { deadlines: [], tasks: [], studyLogs: [] };

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header & Month Controller */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <h1 className="text-xl font-bold tracking-tight text-[#111827]">
              Monthly Calendar & Schedules
            </h1>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Visual month planner mapping exams, deadlines, task operations, and logged study routines.
          </p>
        </div>

        {/* Month Navigation & Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E7EB]">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white rounded-md text-[#4B5563] transition-colors hover:text-[#111827]"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-xs px-3 min-w-[130px] text-center text-[#1F2937]">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white rounded-md text-[#4B5563] transition-colors hover:text-[#111827]"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={jumpToToday}
            className="h-8 px-3 text-xs font-semibold rounded-lg bg-white border border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#374151] transition-colors"
          >
            Today
          </button>

          {/* Filter Pill */}
          <div className="flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-lg border border-[#E5E7EB] text-xs">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                filterType === "all" ? "bg-white text-[#2563EB] shadow-xs font-bold" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("deadlines")}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                filterType === "deadlines" ? "bg-white text-[#DC2626] shadow-xs font-bold" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Deadlines
            </button>
            <button
              onClick={() => setFilterType("tasks")}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                filterType === "tasks" ? "bg-white text-[#D97706] shadow-xs font-bold" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setFilterType("study")}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                filterType === "study" ? "bg-white text-[#2563EB] shadow-xs font-bold" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Study
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 7-Day Calendar Grid (3 Columns on Large screens) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center py-2.5 text-xs font-semibold text-[#64748B]">
            <span className="text-[#EF4444]">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-[#2563EB]">Sat</span>
          </div>

          {/* Month Days Matrix */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E5E7EB]">
            {calendarDays.map((cell) => {
              const dayData = eventsByDate[cell.dateStr] || { deadlines: [], tasks: [], studyLogs: [] };
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;

              const showDeadlines = filterType === "all" || filterType === "deadlines";
              const showTasks = filterType === "all" || filterType === "tasks";
              const showStudy = filterType === "all" || filterType === "study";

              const dCount = showDeadlines ? dayData.deadlines.length : 0;
              const tCount = showTasks ? dayData.tasks.length : 0;
              const sCount = showStudy ? dayData.studyLogs.length : 0;
              const totalItems = dCount + tCount + sCount;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[105px] p-2 flex flex-col justify-between cursor-pointer transition-all ${
                    !cell.isCurrentMonth
                      ? "bg-[#FAFAFA] text-[#9CA3AF]"
                      : "bg-white text-[#111827] hover:bg-[#F0FDF4]/40"
                  } ${
                    isSelected
                      ? "ring-2 ring-[#2563EB] ring-inset bg-[#EFF6FF]/60"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday
                          ? "bg-[#2563EB] text-white font-bold"
                          : isSelected
                          ? "bg-[#DBEAFE] text-[#1E40AF]"
                          : ""
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {totalItems > 0 && (
                      <span className="text-[10px] font-bold text-[#6B7280]">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </span>
                    )}
                  </div>

                  {/* Day Content Badges Preview */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {/* Deadlines Preview */}
                    {showDeadlines && dayData.deadlines.slice(0, 2).map((dl: MeetingDeadline) => (
                      <div
                        key={dl.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded-sm bg-[#FEE2E2] text-[#991B1B] font-medium flex items-center gap-1 border border-[#FECACA]"
                        title={dl.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
                        <span className="truncate">{dl.title}</span>
                      </div>
                    ))}

                    {/* Tasks Preview */}
                    {showTasks && dayData.tasks.slice(0, 1).map((t: TaskItem) => (
                      <div
                        key={t.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded-sm bg-[#FEF3C7] text-[#92400E] font-medium flex items-center gap-1 border border-[#FDE68A]"
                        title={t.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}

                    {/* Study Log Preview */}
                    {showStudy && dayData.studyLogs.slice(0, 1).map((sl: StudyLog) => (
                      <div
                        key={sl.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded-sm bg-[#EFF6FF] text-[#1E40AF] font-medium flex items-center gap-1 border border-[#BFDBFE]"
                        title={`${sl.course} (${sl.durationMinutes}m)`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                        <span className="truncate">{sl.course}: {sl.durationMinutes}m</span>
                      </div>
                    ))}

                    {/* Overflow Indicator */}
                    {totalItems > 3 && (
                      <div className="text-[9px] text-[#6B7280] font-semibold text-right pr-1">
                        +{totalItems - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Side-Panel */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#E5E7EB] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                Day Schedule Inspector
              </span>
              <h2 className="text-base font-bold text-[#111827] mt-0.5">
                {new Date(selectedDateStr + "T00:00:00").toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </h2>
              {selectedDateStr === todayStr && (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                  Today
                </span>
              )}
            </div>

            {/* List of items scheduled on this day */}
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {/* Deadlines Section */}
              {selectedDayEvents.deadlines.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wide flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Deadlines & Exams ({selectedDayEvents.deadlines.length})
                  </div>
                  {selectedDayEvents.deadlines.map((dl: MeetingDeadline) => (
                    <div
                      key={dl.id}
                      className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] space-y-1"
                    >
                      <div className="font-semibold text-xs text-[#991B1B]">{dl.title}</div>
                      <div className="text-[10px] text-[#7F1D1D] flex items-center justify-between">
                        <span>{dl.kind}</span>
                        <span className="font-mono">{dl.dueDateTime?.split("T")[1]?.slice(0, 5) || "Anytime"}</span>
                      </div>
                      {dl.locationOrUrl && (
                        <p className="text-[11px] text-[#991B1B]/80 pt-1">{dl.locationOrUrl}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks Section */}
              {selectedDayEvents.tasks.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#D97706] uppercase tracking-wide flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Tasks Assigned ({selectedDayEvents.tasks.length})
                  </div>
                  {selectedDayEvents.tasks.map((t: TaskItem) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-1"
                    >
                      <div className="font-semibold text-xs text-[#92400E] flex items-center justify-between">
                        <span>{t.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#B45309] border border-[#FDE68A]">
                          {t.priority}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#B45309]">
                        {t.module} • Due: {t.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Study Sessions Logged */}
              {selectedDayEvents.studyLogs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wide flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Study Sessions ({selectedDayEvents.studyLogs.length})
                  </div>
                  {selectedDayEvents.studyLogs.map((sl: StudyLog) => (
                    <div
                      key={sl.id}
                      className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] space-y-1"
                    >
                      <div className="font-semibold text-xs text-[#1E40AF] flex items-center justify-between">
                        <span>{sl.course}</span>
                        <span className="font-mono text-[10px] font-bold text-[#1D4ED8]">
                          {sl.durationMinutes} mins
                        </span>
                      </div>
                      {sl.subtopic && (
                        <div className="text-[10px] text-[#3B82F6]">{sl.subtopic} - {sl.topic}</div>
                      )}
                      {sl.notes && (
                        <div className="text-[11px] text-[#1E3A8A]/80">{sl.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {selectedDayEvents.deadlines.length === 0 &&
                selectedDayEvents.tasks.length === 0 &&
                selectedDayEvents.studyLogs.length === 0 && (
                  <div className="py-8 text-center text-[#9CA3AF] text-xs">
                    <CalendarIcon className="w-8 h-8 mx-auto text-[#D1D5DB] mb-2" />
                    No deadlines or study sessions logged for this day.
                  </div>
                )}
            </div>
          </div>

          {/* Quick Legend at footer */}
          <div className="border-t border-[#E5E7EB] pt-3 mt-4 space-y-1.5 text-[11px] text-[#4B5563]">
            <div className="font-bold text-[10px] uppercase text-[#6B7280] tracking-wide mb-1">
              Legend Codes
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span>Deadlines, Milestones & Exams</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>Task Action Operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span>Study Curriculum Sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
