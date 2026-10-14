"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { StudyLog } from "@/types/app";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Filter, 
  HelpCircle, 
  FileText, 
  Clock, 
  Layers,
  ChevronDown,
  ChevronRight,
  Code
} from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/Modal";
import { COLOR_MAP } from "@/components/TargetsView";

export const StudyView: React.FC = () => {
  const { store, addStudyLog, deleteStudyLog, searchQuery } = useStore();
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterSubtopic, setFilterSubtopic] = useState("All");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formSubject, setFormSubject] = useState("Distributed Systems");
  const [formSubtopic, setFormSubtopic] = useState("Consensus Algorithms");
  const [formTopic, setFormTopic] = useState("");
  const [formProofOrExample, setFormProofOrExample] = useState("");
  const [formDuration, setFormDuration] = useState(45);
  const [formColor, setFormColor] = useState("blue");
  const [formNotes, setFormNotes] = useState("");

  const courses = Array.from(new Set(store.studyLogs.map((l) => l.course)));
  const subtopics = Array.from(
    new Set(
      store.studyLogs
        .filter((l) => filterCourse === "All" || l.course === filterCourse)
        .map((l) => l.subtopic)
        .filter(Boolean)
    )
  );

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formTopic.trim()) return;

    addStudyLog({
      course: formSubject.trim(),
      subtopic: formSubtopic.trim() || "General",
      topic: formTopic.trim(),
      proofOrExample: formProofOrExample.trim() || undefined,
      durationMinutes: Number(formDuration),
      date: new Date().toISOString().split("T")[0],
      notes: formNotes.trim() || "Focused curriculum study log",
      color: formColor,
    });

    setFormTopic("");
    setFormProofOrExample("");
    setFormNotes("");
    setIsAddModalOpen(false);
  };

  const filteredLogs = store.studyLogs.filter((l) => {
    if (filterCourse !== "All" && l.course !== filterCourse) return false;
    if (filterSubtopic !== "All" && l.subtopic !== filterSubtopic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.course.toLowerCase().includes(q) ||
        (l.subtopic && l.subtopic.toLowerCase().includes(q)) ||
        l.topic.toLowerCase().includes(q) ||
        (l.proofOrExample && l.proofOrExample.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalMinutes = filteredLogs.reduce((acc, l) => acc + l.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-[#D1D5DB] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="sub-label">Academic Curriculum Architecture</span>
          <h2 className="text-lg font-bold text-black mt-0.5">
            Subject & Subtopic Curriculum with Proofs & Examples
          </h2>
          <p className="text-xs text-[#374151] mt-0.5 leading-relaxed">
            Organized hierarchy: <strong>Subject (Main)</strong> → <strong>Subtopic</strong> → <strong>Question / Proof / Example</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="font-mono text-xs border border-[#D1D5DB] px-3 py-1.5 bg-[#F9FAFB] text-black font-bold">
            Total Focus: <span className="text-[#2563EB]">{(totalMinutes / 60).toFixed(1)}h</span> ({totalMinutes}m)
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 bg-black text-white text-xs font-bold hover:bg-[#1F2937] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Subject Session</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-[#D1D5DB]">
        {/* Filter Controls Bar */}
        <div className="p-3.5 border-b border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 bg-[#F9FAFB]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Subject (Main) Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="sub-label text-black">Subject:</span>
              <select
                value={filterCourse}
                onChange={(e) => {
                  setFilterCourse(e.target.value);
                  setFilterSubtopic("All");
                }}
                className="h-8 border border-[#D1D5DB] text-xs px-2.5 bg-white text-black font-semibold"
              >
                <option value="All">All Subjects</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtopic Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="sub-label text-black">Subtopic:</span>
              <select
                value={filterSubtopic}
                onChange={(e) => setFilterSubtopic(e.target.value)}
                className="h-8 border border-[#D1D5DB] text-xs px-2.5 bg-white text-black font-semibold"
              >
                <option value="All">All Subtopics</option>
                {subtopics.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-xs font-mono text-[#374151] font-semibold">
            {filteredLogs.length} Curriculum Units
          </span>
        </div>

        {/* Structured Table */}
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D1D5DB] bg-white text-black font-mono">
              <th className="p-3.5 w-12 text-center uppercase tracking-wider text-xs font-bold">Details</th>
              <th className="p-3.5 w-44 uppercase tracking-wider text-xs font-bold">Subject (Main)</th>
              <th className="p-3.5 w-44 uppercase tracking-wider text-xs font-bold">Subtopic</th>
              <th className="p-3.5 uppercase tracking-wider text-xs font-bold">Question / Proof / Concept</th>
              <th className="p-3.5 w-28 uppercase tracking-wider text-xs font-bold">Duration</th>
              <th className="p-3.5 w-32 uppercase tracking-wider text-xs font-bold">Date</th>
              <th className="p-3.5 w-16 text-right uppercase tracking-wider text-xs font-bold">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1D5DB]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-[#374151] text-sm">
                  No study logs found for this filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const theme = COLOR_MAP[log.color || "blue"] || COLOR_MAP.blue;

                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-[#F9FAFB] transition-colors cursor-pointer ${isExpanded ? "bg-[#F9FAFB]" : ""}`}
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      {/* Expand Toggle */}
                      <td className="p-3.5 text-center text-[#374151]">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-black mx-auto" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#6B7280] mx-auto" />
                        )}
                      </td>

                      {/* Subject (Main) with Visual Accent Border */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-0.5 border ${theme.badge}`}>
                          <span className={`w-2 h-2 ${theme.dot}`} />
                          {log.course}
                        </span>
                      </td>

                      {/* Subtopic */}
                      <td className="p-3.5 font-mono text-xs font-bold text-black">
                        <span className="border border-[#D1D5DB] px-2 py-0.5 bg-white text-black">
                          {log.subtopic || "General"}
                        </span>
                      </td>

                      {/* Topic & Question / Proof Preview */}
                      <td className="p-3.5">
                        <div className="font-bold text-black text-sm">{log.topic}</div>
                        {log.proofOrExample && (
                          <div className="text-xs text-[#374151] mt-0.5 font-mono truncate max-w-xl">
                            {log.proofOrExample}
                          </div>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="p-3.5 font-mono font-bold text-black tabular-nums text-sm">
                        {log.durationMinutes} min
                      </td>

                      {/* Date */}
                      <td className="p-3.5 font-mono text-xs text-[#374151] font-semibold">
                        {log.date}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteTargetId(log.id)}
                          className="p-1.5 text-[#374151] hover:text-black border border-transparent hover:border-[#D1D5DB]"
                          title="Delete log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Proof / Example / Deep Technical Notes Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#FAF5FF]/30 border-b border-[#D1D5DB]">
                        <td colSpan={7} className="p-4 pl-12 space-y-3 bg-[#F9FAFB]">
                          {log.proofOrExample && (
                            <div className="border border-[#D1D5DB] bg-white p-3 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-black uppercase tracking-wider">
                                <Code className="w-3.5 h-3.5 text-[#6B21A8]" />
                                <span>Specific Question / Proof / Formal Example</span>
                              </div>
                              <p className="font-mono text-xs text-black leading-relaxed whitespace-pre-wrap bg-[#F9FAFB] p-2.5 border border-[#E5E7EB]">
                                {log.proofOrExample}
                              </p>
                            </div>
                          )}

                          {log.notes && (
                            <div className="border border-[#D1D5DB] bg-white p-3 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-black uppercase tracking-wider">
                                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                                <span>Key Findings & Research Takeaways</span>
                              </div>
                              <p className="text-xs text-[#1F2937] leading-relaxed">
                                {log.notes}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Modal for Adding Subject Curriculum Unit */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Subject Curriculum Session"
      >
        <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sub-label block mb-1">Subject (Main Topic)</label>
              <input
                type="text"
                required
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="w-full h-8 px-2.5 border border-[#D1D5DB] text-xs bg-white text-black font-semibold"
                autoFocus
              />
            </div>

            <div>
              <label className="sub-label block mb-1">Subtopic</label>
              <input
                type="text"
                required
                value={formSubtopic}
                onChange={(e) => setFormSubtopic(e.target.value)}
                placeholder="e.g. Consensus Algorithms"
                className="w-full h-8 px-2.5 border border-[#D1D5DB] text-xs bg-white text-black font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Specific Question / Concept / Theorem</label>
            <input
              type="text"
              required
              value={formTopic}
              onChange={(e) => setFormTopic(e.target.value)}
              placeholder="e.g. Paxos Lease Correctness & Quorum Intersections"
              className="w-full h-8 px-2.5 border border-[#D1D5DB] text-xs bg-white text-black font-semibold"
            />
          </div>

          <div>
            <label className="sub-label block mb-1">Specific Proof / Example / Formula</label>
            <textarea
              rows={3}
              value={formProofOrExample}
              onChange={(e) => setFormProofOrExample(e.target.value)}
              placeholder="Proof statement, mathematical formula, code snippet, or detailed example..."
              className="w-full p-2.5 border border-[#D1D5DB] font-mono text-xs bg-white text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sub-label block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                step={5}
                required
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full h-8 px-2.5 border border-[#D1D5DB] text-xs font-mono bg-white text-black font-bold"
              />
            </div>

            <div>
              <label className="sub-label block mb-1">Visual Color Accent</label>
              <select
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
                className="w-full h-8 px-2 border border-[#D1D5DB] text-xs font-semibold bg-white text-black"
              >
                <option value="blue">Blue (Systems)</option>
                <option value="emerald">Emerald (Databases)</option>
                <option value="purple">Purple (Theory & Proofs)</option>
                <option value="amber">Amber (Math & Stats)</option>
                <option value="rose">Rose (Algorithms)</option>
                <option value="cyan">Cyan (Networking)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Technical Notes / Review Points (Optional)</label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Takeaways, edge cases, reference papers..."
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
              Save Curriculum Session
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Curriculum Unit"
        description="Are you sure you want to delete this study duration record?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteStudyLog(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
