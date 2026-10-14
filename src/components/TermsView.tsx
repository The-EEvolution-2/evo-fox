"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { LearningTerm } from "@/types/app";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Layers, 
  FolderTree, 
  Upload, 
  CheckCircle2,
  ChevronRight,
  Filter,
  FileCode,
  BookOpen
} from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/Modal";

export const TermsView: React.FC = () => {
  const { store, toggleTerm, addTerm, deleteTerm, importTermsJSON, searchQuery } = useStore();

  // Navigation states: Master-Detail selection
  const [selectedTopic, setSelectedTopic] = useState<string>("Web Dev");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unlearned" | "Learned">("All");

  // Custom Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Add Term Form
  const [newTerm, setNewTerm] = useState("");
  const [newTopic, setNewTopic] = useState(selectedTopic || "Web Dev");
  const [newSubtopic, setNewSubtopic] = useState("Backend");
  const [newNotes, setNewNotes] = useState("");

  // Bulk JSON Import Form
  const sampleJSON = `[
  {
    "topic": "Web Dev",
    "subtopic": "Authentication",
    "term": "OAuth2 Proof Key for Code Exchange (PKCE)",
    "notes": "Prevents authorization code interception in public clients"
  },
  {
    "topic": "Web Dev",
    "subtopic": "Security",
    "term": "Content Security Policy (CSP)",
    "notes": "HTTP header mitigating XSS and data injection attacks"
  },
  {
    "topic": "Databases",
    "subtopic": "Indexing",
    "term": "B+ Tree Leaf Node Pointer Chaining",
    "notes": "Enables fast sequential range scans in disk-oriented engines"
  }
]`;
  const [jsonInput, setJsonInput] = useState(sampleJSON);
  const [jsonError, setJsonError] = useState("");

  // Build hierarchical structure of all available topics and their subtopics
  const topicMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    store.terms.forEach((t) => {
      if (!map[t.topic]) map[t.topic] = new Set();
      map[t.topic].add(t.subtopic);
    });
    return map;
  }, [store.terms]);

  const allTopics = Object.keys(topicMap);

  // Keep selectedTopic valid if terms changed
  const activeTopic = allTopics.includes(selectedTopic)
    ? selectedTopic
    : allTopics[0] || "Web Dev";

  const subtopicsForActiveTopic = Array.from(topicMap[activeTopic] || []);

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newTopic.trim() || !newSubtopic.trim()) return;

    addTerm({
      term: newTerm.trim(),
      topic: newTopic.trim(),
      subtopic: newSubtopic.trim(),
      notes: newNotes.trim() || undefined,
      learned: false,
    });

    setNewTerm("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setJsonError("JSON must be an array of term objects: [{ topic, subtopic, term, notes? }]");
        return;
      }
      const importedCount = importTermsJSON(parsed);
      if (importedCount === 0) {
        setJsonError("No valid terms found. Each item must have 'topic', 'subtopic', and 'term'.");
        return;
      }
      setIsBulkImportOpen(false);
    } catch (err: any) {
      setJsonError("Invalid JSON syntax: " + (err?.message || "Please check formatting"));
    }
  };

  // Filtered terms for the currently active topic
  const termsInActiveTopic = useMemo(() => {
    return store.terms
      .filter((t) => t.topic === activeTopic)
      .filter((t) => {
        if (selectedSubtopic !== "All" && t.subtopic !== selectedSubtopic) return false;
        if (statusFilter === "Learned" && !t.learned) return false;
        if (statusFilter === "Unlearned" && t.learned) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            t.term.toLowerCase().includes(q) ||
            t.subtopic.toLowerCase().includes(q) ||
            (t.notes && t.notes.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [store.terms, activeTopic, selectedSubtopic, statusFilter, searchQuery]);

  // Group terms by subtopic within the active topic
  const subtopicGrouped = useMemo(() => {
    const grouped: Record<string, LearningTerm[]> = {};
    termsInActiveTopic.forEach((t) => {
      if (!grouped[t.subtopic]) grouped[t.subtopic] = [];
      grouped[t.subtopic].push(t);
    });
    return grouped;
  }, [termsInActiveTopic]);

  // Overall statistics for top bar
  const totalTermsCount = store.terms.length;
  const learnedCount = store.terms.filter((t) => t.learned).length;
  const progressPct = totalTermsCount > 0 ? Math.round((learnedCount / totalTermsCount) * 100) : 0;

  return (
    <div className="space-y-3.5">
      {/* Top Header Card - Clean & Focused on Mobile */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#09090B]">
            Learning Terms
          </h2>
          <p className="hidden sm:block text-xs text-[#6B7280] mt-0.5">
            Categorized strictly by Topic & Subtopic. Switch topics without excessive scrolling.
          </p>
          <div className="sm:hidden text-[11px] text-blue-600 font-semibold mt-0.5">
            {learnedCount}/{totalTermsCount} learned ({progressPct}%)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold font-mono text-[#09090B] tabular-nums">
              {learnedCount} / {totalTermsCount} Learned
            </div>
            <div className="text-[10px] font-mono text-[#71717A] uppercase">
              {progressPct}% Completed
            </div>
          </div>

          {/* Bulk Import hidden on mobile to eliminate clutter */}
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="hidden sm:flex h-8 px-3 border border-[#D1D5DB] hover:border-[#18181B] bg-white rounded-lg text-xs font-medium text-[#09090B] hover:bg-[#FAFAFA] items-center gap-1.5 transition-colors"
            title="Bulk import terms via JSON format"
          >
            <FileCode className="w-3.5 h-3.5 text-[#18181B]" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => {
              setNewTopic(activeTopic);
              setIsAddModalOpen(true);
            }}
            className="h-8 px-3 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A] rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      {/* Two-Column Master / Detail Layout (Zero long scroll required to change topics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Mobile Topic Pill Scroller (Visible on mobile, hidden on lg screens) */}
        <div className="lg:hidden bg-white border border-[#E5E7EB] rounded-xl p-2.5 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0">Topic:</span>
          {allTopics.map((topicName) => {
            const isSelected = activeTopic === topicName;
            const topicTerms = store.terms.filter((t) => t.topic === topicName);
            const topicLearned = topicTerms.filter((t) => t.learned).length;

            return (
              <button
                key={topicName}
                onClick={() => {
                  setSelectedTopic(topicName);
                  setSelectedSubtopic("All");
                }}
                className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{topicName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-white text-slate-600"
                }`}>
                  {topicLearned}/{topicTerms.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Left Column: Topics & Subtopics Selector Navigation (Master Panel - Desktop only) */}
        <div className="hidden lg:block lg:col-span-4 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
          <div className="h-9 border-b border-[#E5E7EB] px-3.5 flex items-center justify-between bg-[#F8FAFC]">
            <span className="sub-label text-[11px]">Topics ({allTopics.length})</span>
            <span className="text-[10px] text-[#71717A] font-semibold">Master Selector</span>
          </div>

          <div className="divide-y divide-[#E4E4E7]">
            {allTopics.map((topicName) => {
              const isSelected = activeTopic === topicName;
              const topicTerms = store.terms.filter((t) => t.topic === topicName);
              const topicLearned = topicTerms.filter((t) => t.learned).length;
              const subCount = topicMap[topicName]?.size || 0;

              return (
                <button
                  key={topicName}
                  onClick={() => {
                    setSelectedTopic(topicName);
                    setSelectedSubtopic("All");
                  }}
                  className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-[#ECFDF5] font-bold text-[#065F46] border-l-4 border-l-[#059669]"
                      : "text-[#374151] hover:text-black hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="text-xs uppercase tracking-tight truncate font-bold">
                      {topicName}
                    </div>
                    <div className="font-mono text-xs text-[#4B5563]">
                      {subCount} Subtopics • {topicTerms.length} Terms
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-mono text-xs px-2 py-0.5 font-bold border ${
                      topicLearned === topicTerms.length
                        ? "bg-[#D1FAE5] text-[#064E3B] border-[#A7F3D0]"
                        : "bg-white text-black border-[#D1D5DB]"
                    }`}>
                      {topicLearned}/{topicTerms.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Terms List for Selected Topic (Detail Panel) */}
        <div className="lg:col-span-8 space-y-3.5">
          {/* Subtopic Filter Bar for Active Topic */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="sub-label mr-1 text-[11px]">Subtopic:</span>
              <button
                onClick={() => setSelectedSubtopic("All")}
                className={`h-7 px-2.5 font-mono text-[11px] rounded-lg uppercase transition-colors ${
                  selectedSubtopic === "All"
                    ? "bg-[#18181B] text-white"
                    : "border border-[#E5E7EB] text-[#71717A] hover:text-[#09090B] bg-white"
                }`}
              >
                All ({termsInActiveTopic.length})
              </button>

              {subtopicsForActiveTopic.map((subName) => {
                const subTerms = store.terms.filter(
                  (t) => t.topic === activeTopic && t.subtopic === subName
                );
                const subLearned = subTerms.filter((t) => t.learned).length;
                const isSubSelected = selectedSubtopic === subName;

                return (
                  <button
                    key={subName}
                    onClick={() => setSelectedSubtopic(subName)}
                    className={`h-7 px-2.5 font-mono text-[11px] uppercase transition-colors ${
                      isSubSelected
                        ? "bg-[#18181B] text-white"
                        : "border border-[#E4E4E7] text-[#71717A] hover:text-[#09090B] bg-white"
                    }`}
                  >
                    {subName} ({subLearned}/{subTerms.length})
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#71717A]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-7 border border-[#E5E7EB] rounded-lg px-2 bg-white text-[#09090B]"
              >
                <option value="All">All</option>
                <option value="Unlearned">Pending Only</option>
                <option value="Learned">Crossed Only</option>
              </select>
            </div>
          </div>

          {/* Terms Content List */}
          {Object.keys(subtopicGrouped).length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#71717A] text-xs shadow-xs">
              No terms match the selected criteria for topic "{activeTopic}". Click "Add Term" to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(subtopicGrouped).map(([subtopicName, terms]) => {
                const subLearned = terms.filter((t) => t.learned).length;
                const subPct = Math.round((subLearned / terms.length) * 100);

                return (
                  <div key={subtopicName} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xs">
                    {/* Subtopic Header */}
                    <div className="h-9 border-b border-[#E5E7EB] px-3.5 flex items-center justify-between bg-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#71717A]" />
                        <span className="font-semibold text-xs font-mono uppercase text-[#09090B]">
                          {subtopicName}
                        </span>
                        <span className="font-mono text-[10px] text-[#71717A]">
                          ({subLearned}/{terms.length} • {subPct}%)
                        </span>
                      </div>

                      <div className="w-20 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${subPct}%` }}
                          className="h-full bg-[#18181B] transition-all rounded-full"
                        />
                      </div>
                    </div>

                    {/* Step-by-Step Items */}
                    <div className="divide-y divide-[#E4E4E7]">
                      {terms.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`p-3 flex items-start justify-between gap-3 text-xs transition-colors hover:bg-[#FAFAFA] ${
                            item.learned ? "bg-[#FAFAFA]/70" : "bg-white"
                          }`}
                        >
                          <div
                            className="flex items-start gap-3 cursor-pointer flex-1 select-none"
                            onClick={() => toggleTerm(item.id)}
                          >
                            <button
                              type="button"
                              className="w-4 h-4 mt-0.5 border border-[#18181B] flex items-center justify-center text-[#18181B] shrink-0"
                              title={item.learned ? "Uncross term" : "Cross off term"}
                            >
                              {item.learned ? (
                                <CheckSquare className="w-3.5 h-3.5 bg-[#18181B] text-white" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-transparent" />
                              )}
                            </button>

                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-[10px] text-[#71717A] w-6 shrink-0">
                                  #{idx + 1}
                                </span>
                                <span
                                  className={`font-medium ${
                                    item.learned
                                      ? "line-through text-[#A1A1AA]"
                                      : "text-[#09090B]"
                                  }`}
                                >
                                  {item.term}
                                </span>
                              </div>

                              {item.notes && (
                                <p
                                  className={`text-[11px] ml-8 ${
                                    item.learned ? "text-[#A1A1AA]" : "text-[#71717A]"
                                  }`}
                                >
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`font-mono text-[10px] uppercase px-1.5 py-0.5 border ${
                                item.learned
                                  ? "border-[#E4E4E7] text-[#A1A1AA] bg-white"
                                  : "border-[#18181B] text-[#09090B] bg-white"
                              }`}
                            >
                              {item.learned ? "Crossed" : "Learn"}
                            </span>

                            <button
                              onClick={() => setDeleteTargetId(item.id)}
                              className="p-1 text-[#71717A] hover:text-[#18181B] border border-transparent hover:border-[#E4E4E7]"
                              title="Delete term"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Custom Modal: Add Single Term */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Learning Term"
      >
        <form onSubmit={handleCreateTerm} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sub-label block mb-1">Topic (Main Category)</label>
              <input
                type="text"
                required
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Web Dev"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              />
            </div>
            <div>
              <label className="sub-label block mb-1">Subtopic</label>
              <input
                type="text"
                required
                value={newSubtopic}
                onChange={(e) => setNewSubtopic(e.target.value)}
                placeholder="e.g. Backend / Auth"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              />
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Term Name</label>
            <input
              type="text"
              required
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="e.g. Server-Sent Events (SSE)"
              className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              autoFocus
            />
          </div>

          <div>
            <label className="sub-label block mb-1">Definition / Notes (Optional)</label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Conceptual summary, key definition or references..."
              className="w-full p-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-8 px-3 border border-[#E4E4E7] text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA]"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A]"
            >
              Save Term
            </button>
          </div>
        </form>
      </Modal>

      {/* Custom Modal: Bulk JSON Import */}
      <Modal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        title="Bulk Import Terms (JSON Format)"
        widthClass="max-w-xl"
      >
        <form onSubmit={handleBulkImport} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="sub-label">JSON Array Format</label>
              <button
                type="button"
                onClick={() => setJsonInput(sampleJSON)}
                className="text-[10px] text-[#71717A] hover:text-[#09090B] underline font-mono"
              >
                Reset Sample
              </button>
            </div>
            <p className="text-[11px] text-[#71717A] mb-2 leading-relaxed">
              Paste a JSON array containing multiple terms at once. Each entry requires{" "}
              <code className="text-[#09090B] font-mono">topic</code>,{" "}
              <code className="text-[#09090B] font-mono">subtopic</code>, and{" "}
              <code className="text-[#09090B] font-mono">term</code>.
            </p>
            <textarea
              rows={12}
              required
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError("");
              }}
              className="w-full p-3 font-mono text-[11px] border border-[#E4E4E7] bg-[#FAFAFA] text-[#09090B] focus:bg-white"
            />
          </div>

          {jsonError && (
            <div className="p-2.5 border border-[#18181B] bg-white text-[#18181B] text-xs font-mono">
              Error: {jsonError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsBulkImportOpen(false)}
              className="h-8 px-3 border border-[#E4E4E7] text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA]"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A]"
            >
              Parse & Import Terms
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Learning Term"
        description="Are you sure you want to permanently delete this term?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteTerm(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
