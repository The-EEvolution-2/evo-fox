"use client";

import React, { useState, useEffect } from "react";
import { useTracker } from "@/context/TrackerContext";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Flame, 
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ListTodo,
  AlertTriangle
} from "lucide-react";
import confetti from "canvas-confetti";

export const DashboardView: React.FC = () => {
  const { state, setActiveTab, toggleTask, logSession } = useTracker();

  // Metrics computation
  const totalCourses = state.courses.length;
  const totalHoursLogged = state.courses.reduce((acc, c) => acc + c.loggedHours, 0);
  const targetHours = state.courses.reduce((acc, c) => acc + c.targetHours, 0);
  const courseCompletionPct = targetHours > 0 ? Math.round((totalHoursLogged / targetHours) * 100) : 0;

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const taskCompletionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const topStreak = state.tasks.reduce((acc, t) => Math.max(acc, t.streak), 0);
  const upcomingEvents = [...state.events]
    .filter((e) => !e.completed)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);

  // Quick Pomodoro Widget on Dashboard
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(
    state.courses[0]?.title || "Focus Study"
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      logSession(selectedSubject, 25);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      alert(`🎉 Awesome! You completed 25 minutes of focused study on: ${selectedSubject}`);
      setTimerSeconds(25 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds, selectedSubject, logSession]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getUrgencyBadge = (dateTimeStr: string) => {
    const diffHours = (new Date(dateTimeStr).getTime() - Date.now()) / (1000 * 60 * 60);
    if (diffHours < 0) return { label: "Overdue", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    if (diffHours < 24) return { label: "Due Today", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    if (diffHours < 72) return { label: `In ${Math.ceil(diffHours / 24)}d`, bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
    return { label: `In ${Math.ceil(diffHours / 24)}d`, bg: "bg-slate-700/30 text-slate-400 border-slate-700/50" };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Personal Mastery Center
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Ready to excel today, <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">{state.userName}</span>?
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              You have <strong className="text-white">{upcomingEvents.length}</strong> upcoming milestones and <strong className="text-white">{totalTasks - completedTasks}</strong> pending daily tasks. Let's make every hour count!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("study")}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Study Station
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Progress</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalHoursLogged}h</span>
            <span className="text-xs text-slate-400">/ {targetHours}h goal</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, courseCompletionPct)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>{totalCourses} active courses</span>
            <span className="text-indigo-400 font-semibold">{courseCompletionPct}% complete</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Daily Task Routine</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {completedTasks}/{totalTasks}
            </span>
            <span className="text-xs text-slate-400">done today</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${taskCompletionPct}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>{totalTasks - completedTasks} remaining</span>
            <span className="text-emerald-400 font-semibold">{taskCompletionPct}% rate</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Consistency Streak</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{topStreak} Days</span>
            <span className="text-xs text-amber-400 font-medium">Active fire</span>
          </div>
          <p className="mt-3 text-xs text-slate-400 leading-tight">
            Consistency beats intensity. Keep ticking off your daily routine checklists!
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Skills Tracked</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{state.skills.length}</span>
            <span className="text-xs text-slate-400">competencies</span>
          </div>
          <p className="mt-3 text-xs text-slate-400 leading-tight">
            {state.skills.reduce((acc, s) => acc + s.milestones.filter(m => m.completed).length, 0)} milestones completed across all tracks.
          </p>
        </div>
      </div>

      {/* Middle Interactive Section: Quick Pomodoro & Urgent Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Focus Pomodoro Widget */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-100">Deep Work Pomodoro</h3>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                25 Min Focus
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Select a target subject and start a distraction-free study session.
            </p>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Focus Subject / Course
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {state.courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
                <option value="General Study & Review">General Study & Review</option>
                <option value="Skill Practice">Skill Practice</option>
              </select>
            </div>

            {/* Timer Display */}
            <div className="my-6 text-center">
              <div className="text-5xl font-black tracking-wider text-slate-100 font-mono">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isRunning ? "Session in progress — stay in flow..." : "Ready to focus"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause Timer" : "Start Focus Session"}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines & Meetings Box */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">Next Deadlines & Meetings</h3>
                  <p className="text-xs text-slate-400">Upcoming milestone countdowns</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("calendar")}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
              >
                Full Calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
                  No upcoming deadlines or meetings scheduled. Add some in the Deadlines tab!
                </div>
              ) : (
                upcomingEvents.map((evt) => {
                  const badge = getUrgencyBadge(evt.dateTime);
                  const dateObj = new Date(evt.dateTime);
                  return (
                    <div
                      key={evt.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[11px] font-medium uppercase text-slate-400 tracking-wider">
                            {evt.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-100">{evt.title}</h4>
                        {evt.linkOrLocation && (
                          <p className="text-xs text-slate-400 truncate max-w-sm">
                            📍 {evt.linkOrLocation}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-slate-300">
                          {dateObj.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {dateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Keep your notifications synced</span>
            <button
              onClick={() => setActiveTab("calendar")}
              className="text-slate-300 hover:text-white font-medium"
            >
              + Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Quick Daily Tasks Checklist on Dashboard */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Today's Quick Checklist</h3>
              <p className="text-xs text-slate-400">Instant toggle your primary daily habits</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("tasks")}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
          >
            Manage Routine & Tasks <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {state.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                task.completed
                  ? "bg-slate-950/40 border-slate-800/60 opacity-60 line-through text-slate-400"
                  : "bg-slate-950/90 border-slate-800 hover:border-slate-700 text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="rounded text-indigo-600 focus:ring-0 bg-slate-800 border-slate-700 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium">{task.title}</span>
              </div>
              {task.streak > 0 && (
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {task.streak}d
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
