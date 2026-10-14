"use client";

import React, { useState } from "react";
import { useTracker } from "@/context/TrackerContext";
import { DailyTask } from "@/types/tracker";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Flame, 
  RotateCcw, 
  Tag, 
  Calendar, 
  AlertCircle,
  Filter,
  CheckCircle2
} from "lucide-react";
import confetti from "canvas-confetti";

export const DailyTasksView: React.FC = () => {
  const { state, addTask, toggleTask, deleteTask } = useTracker();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DailyTask["category"]>("routine");
  const [priority, setPriority] = useState<DailyTask["priority"]>("medium");
  const [recurring, setRecurring] = useState(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      category,
      priority,
      completed: false,
      recurring,
    });

    setTitle("");
    setIsAdding(false);
  };

  const filteredTasks = state.tasks.filter((t) => {
    if (filterCategory === "all") return true;
    return t.category === filterCategory;
  });

  const completedCount = state.tasks.filter((t) => t.completed).length;
  const totalCount = state.tasks.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityBadge = (p: DailyTask["priority"]) => {
    switch (p) {
      case "urgent":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "low":
        return "bg-slate-700/20 text-slate-400 border-slate-700/50";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            Daily Routine & Habits Tracker
          </h2>
          <p className="text-sm text-slate-400">
            Build unshakeable daily consistency, maintain streaks, and categorize day-to-day priorities.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Daily Task
        </button>
      </div>

      {/* Routine Progress Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Today's Progress
          </span>
          <h3 className="text-2xl font-black text-white">
            {completedCount} of {totalCount} Tasks Completed ({completionPct}%)
          </h3>
          <p className="text-xs text-slate-400 max-w-lg">
            {completionPct === 100
              ? "🔥 Outstanding! You crushed all your routine tasks today!"
              : "Keep moving through your routine. Each checkmark builds lasting discipline."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { id: "all", label: "All Items" },
          { id: "routine", label: "Daily Routine" },
          { id: "study", label: "Study & Practice" },
          { id: "work", label: "Work / Projects" },
          { id: "personal", label: "Personal" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterCategory === tab.id
                ? "bg-slate-800 text-white font-semibold shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
            No tasks found under this category. Click "+ Add Daily Task" to create one.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg"
              }`}
            >
              <div
                className="flex items-center gap-3.5 cursor-pointer flex-1"
                onClick={() => {
                  toggleTask(task.id);
                  if (!task.completed) {
                    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 w-5 h-5 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold transition ${
                        task.completed ? "line-through text-slate-500" : "text-slate-100"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="capitalize">{task.category}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.2 rounded-full border text-[10px] uppercase font-semibold ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.recurring && <span>• Daily Recurring</span>}
                  </div>
                </div>
              </div>

              {/* Right Side: Streaks & Delete */}
              <div className="flex items-center gap-4 shrink-0">
                {task.streak > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{task.streak}d streak</span>
                  </div>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Task */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Add Daily Routine Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Read 1 research paper / chapter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="routine">Daily Routine</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recurringCheck"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="recurringCheck" className="text-xs text-slate-300 cursor-pointer">
                  Repeat daily (Habit building)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition shadow"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
