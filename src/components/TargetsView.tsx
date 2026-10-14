"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { TargetGoal } from "@/types/app";
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/Modal";

// Distinct Swiss editorial color palettes
export const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; bar: string }> = {
  blue: {
    bg: "bg-[#EFF6FF]",
    border: "border-[#93C5FD]",
    text: "text-[#1E40AF]",
    badge: "bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
    bar: "bg-[#2563EB]",
  },
  emerald: {
    bg: "bg-[#ECFDF5]",
    border: "border-[#A7F3D0]",
    text: "text-[#065F46]",
    badge: "bg-[#D1FAE5] text-[#064E3B] border-[#A7F3D0]",
    dot: "bg-[#059669]",
    bar: "bg-[#059669]",
  },
  purple: {
    bg: "bg-[#FAF5FF]",
    border: "border-[#E9D5FF]",
    text: "text-[#6B21A8]",
    badge: "bg-[#F3E8FF] text-[#581C87] border-[#E9D5FF]",
    dot: "bg-[#9333EA]",
    bar: "bg-[#9333EA]",
  },
  amber: {
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
    text: "text-[#92400E]",
    badge: "bg-[#FEF3C7] text-[#78350F] border-[#FDE68A]",
    dot: "bg-[#D97706]",
    bar: "bg-[#D97706]",
  },
  rose: {
    bg: "bg-[#FFF1F2]",
    border: "border-[#FECDD3]",
    text: "text-[#9F1239]",
    badge: "bg-[#FFE4E6] text-[#881337] border-[#FECDD3]",
    dot: "bg-[#E11D48]",
    bar: "bg-[#E11D48]",
  },
  cyan: {
    bg: "bg-[#ECFEFF]",
    border: "border-[#A5F3FC]",
    text: "text-[#155E75]",
    badge: "bg-[#CFFAFE] text-[#164E63] border-[#A5F3FC]",
    dot: "bg-[#0891B2]",
    bar: "bg-[#0891B2]",
  },
};

export const TargetsView: React.FC = () => {
  const { store, addTarget, updateTarget, deleteTarget, searchQuery } = useStore();
  const [horizonFilter, setHorizonFilter] = useState<"All" | "Short-term" | "Long-term">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [horizon, setHorizon] = useState<"Short-term" | "Long-term">("Short-term");
  const [category, setCategory] = useState<any>("Study");
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]);
  const [progress, setProgress] = useState(25);
  const [color, setColor] = useState("blue");
  const [notes, setNotes] = useState("");

  const targets = store.targets || [];

  const filteredTargets = targets.filter((t) => {
    if (horizonFilter !== "All" && t.horizon !== horizonFilter) return false;
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const shortTermCount = targets.filter((t) => t.horizon === "Short-term").length;
  const longTermCount = targets.filter((t) => t.horizon === "Long-term").length;
  const achievedCount = targets.filter((t) => t.status === "Achieved").length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTarget({
      title: title.trim(),
      horizon,
      category,
      targetDate,
      progress: Number(progress),
      status: Number(progress) >= 100 ? "Achieved" : "In Progress",
      color,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setNotes("");
    setProgress(25);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Short Term */}
        <div className="bg-white border border-[#D1D5DB] p-5 border-l-4 border-l-[#2563EB]">
          <div className="flex items-center justify-between text-black">
            <span className="sub-label">Short-Term Targets</span>
            <span className="font-mono text-xs px-2 py-0.5 border border-[#BFDBFE] bg-[#EFF6FF] text-[#1E3A8A] font-bold">
              1-4 Weeks
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-black tabular-nums">{shortTermCount}</span>
            <span className="text-sm text-[#374151] font-semibold">Active tactical sprints</span>
          </div>
          <div className="mt-3 text-xs text-[#374151] border-t border-[#D1D5DB] pt-2.5 flex justify-between font-medium">
            <span>Sprint Execution</span>
            <span className="font-bold text-[#2563EB] uppercase font-mono">Short Horizon</span>
          </div>
        </div>

        {/* Long Term */}
        <div className="bg-white border border-[#D1D5DB] p-5 border-l-4 border-l-[#9333EA]">
          <div className="flex items-center justify-between text-black">
            <span className="sub-label">Long-Term Targets</span>
            <span className="font-mono text-xs px-2 py-0.5 border border-[#E9D5FF] bg-[#FAF5FF] text-[#581C87] font-bold">
              1-12 Months
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-black tabular-nums">{longTermCount}</span>
            <span className="text-sm text-[#374151] font-semibold">Strategic milestones</span>
          </div>
          <div className="mt-3 text-xs text-[#374151] border-t border-[#D1D5DB] pt-2.5 flex justify-between font-medium">
            <span>Career & Core Mastery</span>
            <span className="font-bold text-[#9333EA] uppercase font-mono">Long Horizon</span>
          </div>
        </div>

        {/* Achieved */}
        <div className="bg-white border border-[#D1D5DB] p-5 border-l-4 border-l-[#059669]">
          <div className="flex items-center justify-between text-black">
            <span className="sub-label">Achieved Milestones</span>
            <span className="font-mono text-xs px-2 py-0.5 border border-[#A7F3D0] bg-[#ECFDF5] text-[#064E3B] font-bold">
              Milestone
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-black tabular-nums">{achievedCount}</span>
            <span className="text-sm text-[#374151] font-semibold">Completed targets</span>
          </div>
          <div className="mt-3 text-xs text-[#374151] border-t border-[#D1D5DB] pt-2.5 flex justify-between font-medium">
            <span>Target Velocity</span>
            <span className="font-bold text-[#059669] uppercase font-mono">Accomplished</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-[#D1D5DB]">
        {/* Header Action Bar */}
        <div className="p-4 border-b border-[#D1D5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex flex-wrap items-center gap-2">
            {/* Horizon Filter Tabs */}
            <div className="flex border border-[#D1D5DB]">
              {(["All", "Short-term", "Long-term"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizonFilter(h)}
                  className={`h-8 px-3 text-xs font-mono font-bold uppercase transition-colors ${
                    horizonFilter === h
                      ? "bg-black text-white"
                      : "bg-white text-[#374151] hover:text-black hover:bg-[#F3F4F6]"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 border border-[#D1D5DB] text-xs px-2.5 bg-white text-black font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Study">Study</option>
              <option value="Skill">Skill</option>
              <option value="Career">Career</option>
              <option value="Financial">Financial</option>
              <option value="General">General</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-4 bg-black text-white text-xs font-bold hover:bg-[#1F2937] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Target Goal</span>
          </button>
        </div>

        {/* Target Cards Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTargets.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-[#374151] text-sm">
              No targets found for the active filter. Click <strong>"New Target Goal"</strong> to register one.
            </div>
          ) : (
            filteredTargets.map((target) => {
              const theme = COLOR_MAP[target.color || "blue"] || COLOR_MAP.blue;
              const isAchieved = target.status === "Achieved" || target.progress >= 100;

              return (
                <div
                  key={target.id}
                  className={`border border-[#D1D5DB] p-5 space-y-4 bg-white relative hover:border-black transition-colors`}
                >
                  {/* Top Bar with Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`font-mono text-xs font-bold uppercase px-2 py-0.5 border ${theme.badge}`}>
                        {target.horizon}
                      </span>
                      <span className="font-mono text-xs border border-[#D1D5DB] px-2 py-0.5 bg-[#F9FAFB] text-black font-semibold">
                        {target.category}
                      </span>
                      {isAchieved && (
                        <span className="font-mono text-xs border border-[#A7F3D0] bg-[#ECFDF5] text-[#064E3B] px-2 py-0.5 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                          Achieved
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDeleteTargetId(target.id)}
                        className="p-1.5 text-[#374151] hover:text-black border border-transparent hover:border-[#D1D5DB]"
                        title="Delete target"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className={`text-base font-bold ${isAchieved ? "line-through text-[#6B7280]" : "text-black"}`}>
                      {target.title}
                    </h3>
                    {target.notes && (
                      <p className="text-xs text-[#374151] mt-1 leading-relaxed">
                        {target.notes}
                      </p>
                    )}
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#374151] font-medium">Completion Progress</span>
                      <span className="font-bold text-black tabular-nums">{target.progress}%</span>
                    </div>

                    <div className="w-full bg-[#E5E7EB] h-2.5">
                      <div
                        style={{ width: `${Math.min(100, target.progress)}%` }}
                        className={`${theme.bar} h-2.5`}
                      />
                    </div>
                  </div>

                  {/* Quick Stepper & Target Date Footer */}
                  <div className="flex items-center justify-between border-t border-[#D1D5DB] pt-3 text-xs font-mono">
                    <span className="text-[#374151] flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      Target: <strong className="text-black">{target.targetDate}</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      {[25, 50, 75, 100].map((step) => (
                        <button
                          key={step}
                          onClick={() =>
                            updateTarget(target.id, {
                              progress: step,
                              status: step === 100 ? "Achieved" : "In Progress",
                            })
                          }
                          className={`h-6 px-2 text-xs border font-bold transition-colors ${
                            target.progress >= step
                              ? `${theme.bg} ${theme.text} ${theme.border}`
                              : "border-[#D1D5DB] bg-white text-[#374151] hover:border-black"
                          }`}
                        >
                          {step}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Custom Modal for Creating Targets */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Target Goal (Short or Long Term)"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="sub-label block mb-1">Target Horizon</label>
            <div className="grid grid-cols-2 border border-[#D1D5DB]">
              <button
                type="button"
                onClick={() => setHorizon("Short-term")}
                className={`h-8 font-bold font-mono uppercase transition-colors ${
                  horizon === "Short-term"
                    ? "bg-black text-white"
                    : "bg-white text-[#374151] hover:text-black hover:bg-[#F3F4F6]"
                }`}
              >
                Short-term (Weeks)
              </button>
              <button
                type="button"
                onClick={() => setHorizon("Long-term")}
                className={`h-8 font-bold font-mono uppercase transition-colors ${
                  horizon === "Long-term"
                    ? "bg-black text-white"
                    : "bg-white text-[#374151] hover:text-black hover:bg-[#F3F4F6]"
                }`}
              >
                Long-term (Months)
              </button>
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Target Milestone / Objective</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Distributed Systems Consensus Proofs"
              className="w-full h-8 px-2.5 border border-[#D1D5DB] text-xs bg-white text-black font-medium"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sub-label block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-8 px-2 border border-[#D1D5DB] text-xs bg-white text-black font-medium"
              >
                <option value="Study">Study Curriculum</option>
                <option value="Skill">Skill Competency</option>
                <option value="Career">Career & Placement</option>
                <option value="Financial">Financial Surplus</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="sub-label block mb-1">Target Due Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full h-8 px-2 border border-[#D1D5DB] text-xs font-mono bg-white text-black font-semibold"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Visual Accent Palette</label>
            <div className="grid grid-cols-6 gap-1.5 border border-[#D1D5DB] p-2 bg-[#F9FAFB]">
              {Object.keys(COLOR_MAP).map((cKey) => {
                const cObj = COLOR_MAP[cKey];
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`h-7 text-xs font-mono font-bold capitalize flex items-center justify-center gap-1 border transition-colors ${
                      color === cKey ? "border-black ring-1 ring-black bg-white" : "border-[#D1D5DB] bg-white hover:border-black"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 ${cObj.dot}`} />
                    <span className="text-[11px]">{cKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="sub-label">Initial Progress</label>
              <span className="font-mono font-bold text-xs text-black">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-[#E5E7EB] accent-black cursor-pointer"
            />
          </div>

          <div>
            <label className="sub-label block mb-1">Strategic Strategy & Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key sub-deliverables or reference standards..."
              className="w-full p-2.5 border border-[#D1D5DB] text-xs bg-white text-black"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D1D5DB]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-8 px-3 border border-[#D1D5DB] text-xs font-medium text-[#374151] hover:text-black hover:bg-[#F3F4F6]"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-black text-white text-xs font-bold hover:bg-[#1F2937]"
            >
              Save Target
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Target Goal"
        description="Are you sure you want to delete this target milestone?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteTarget(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
