"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { CustomNote } from "@/types/app";
import { 
  Plus, 
  Trash2, 
  Pin, 
  CheckSquare, 
  FileText, 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Palette, 
  Search,
  ListTodo,
  Sparkles,
  Save,
  Check,
  X
} from "lucide-react";
import { ConfirmDialog } from "@/components/Modal";

export function NotepadView() {
  const { store, addNote, updateNote, deleteNote, searchQuery } = useStore();
  const notes = store.notes || [];

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || "");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // New Note Modal / Inline Creator
  const [newType, setNewType] = useState<"note" | "checklist">("note");
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#FFFFFF");
  const [isCreating, setIsCreating] = useState(false);

  // Active note editing states
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize editor HTML when active note changes
  useEffect(() => {
    if (editorRef.current && activeNote && activeNote.type === "note") {
      editorRef.current.innerHTML = activeNote.content || "";
    }
  }, [activeNoteId, activeNote?.type]);

  // Execute rich text command
  const formatDoc = (cmd: string, val: string = "") => {
    document.execCommand(cmd, false, val);
    if (editorRef.current && activeNote) {
      updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current && activeNote) {
      updateNote(activeNote.id, { content: editorRef.current.innerHTML });
    }
  };

  const colorPalette = [
    { label: "Default White", bg: "#FFFFFF", border: "#E5E7EB" },
    { label: "Soft Blue", bg: "#EFF6FF", border: "#BFDBFE" },
    { label: "Soft Amber", bg: "#FEF3C7", border: "#FDE68A" },
    { label: "Soft Emerald", bg: "#ECFDF5", border: "#A7F3D0" },
    { label: "Soft Rose", bg: "#FFF1F2", border: "#FECDD3" },
    { label: "Soft Purple", bg: "#FAF5FF", border: "#E9D5FF" },
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addNote({
      title: newTitle.trim(),
      type: newType,
      content: newType === "note" ? "<p>Write your detailed notes, proofs, and formulas here...</p>" : "",
      checklistItems: newType === "checklist" ? [
        { id: "item-1", text: "First checklist task", done: false }
      ] : undefined,
      color: newColor,
      pinned: false,
    });

    setNewTitle("");
    setIsCreating(false);
  };

  // Checklist item management
  const [newChecklistText, setNewChecklistText] = useState("");

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim() || !activeNote) return;
    const items = activeNote.checklistItems || [];
    const updated = [
      ...items,
      { id: "chk-" + Date.now(), text: newChecklistText.trim(), done: false },
    ];
    updateNote(activeNote.id, { checklistItems: updated });
    setNewChecklistText("");
  };

  const handleToggleChecklistItem = (itemId: string) => {
    if (!activeNote) return;
    const items = activeNote.checklistItems || [];
    const updated = items.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i
    );
    updateNote(activeNote.id, { checklistItems: updated });
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    if (!activeNote) return;
    const items = activeNote.checklistItems || [];
    const updated = items.filter((i) => i.id !== itemId);
    updateNote(activeNote.id, { checklistItems: updated });
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.checklistItems && n.checklistItems.some((i) => i.text.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="sub-label">Study Workspace</span>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">
            Rich Notepad & Checklists
          </h1>
          <p className="text-xs text-slate-500">
            Compose rich formatted study notes with bold, italic, underline, color highlighting, and checklists.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="h-8 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note / Checklist</span>
        </button>
      </div>

      {/* Inline Quick Creation Card */}
      {isCreating && (
        <form
          onSubmit={handleCreateNote}
          className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm space-y-3 text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900">Create New Workspace Document</span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="sub-label block mb-1">Document Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus Theorems, Project Deliverables"
                className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-900"
                autoFocus
              />
            </div>

            <div>
              <label className="sub-label block mb-1">Document Format</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-900"
              >
                <option value="note">Rich Text Note (Bold, Color, etc.)</option>
                <option value="checklist">Interactive Checklist</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Accent Card Color:</span>
              <div className="flex items-center gap-1.5">
                {colorPalette.map((c) => (
                  <button
                    key={c.bg}
                    type="button"
                    onClick={() => setNewColor(c.bg)}
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      newColor === c.bg ? "scale-125 ring-2 ring-blue-500 ring-offset-1" : ""
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="h-8 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Document</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Two-Column View: Note List + Editor Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: Note Thumbnails / Cards List */}
        <div className="lg:col-span-4 space-y-2 max-h-[680px] overflow-y-auto pr-1">
          {filteredNotes.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-xs text-slate-400">
              No notes created yet. Click "New Note" to compose your first document.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = note.id === (activeNote?.id || "");
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  style={{ backgroundColor: note.color || "#FFFFFF" }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {note.type === "checklist" ? (
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                      <h3 className="font-bold text-xs text-slate-900 truncate">
                        {note.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateNote(note.id, { pinned: !note.pinned });
                        }}
                        className={`p-1 rounded hover:bg-black/5 ${
                          note.pinned ? "text-amber-500" : "text-slate-300"
                        }`}
                        title={note.pinned ? "Unpin Note" : "Pin Note to Top"}
                      >
                        <Pin className="w-3 h-3 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(note.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-black/5"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 line-clamp-2">
                    {note.type === "checklist" ? (
                      <span>
                        {(note.checklistItems || []).filter((i) => i.done).length} /{" "}
                        {(note.checklistItems || []).length} items checked
                      </span>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: note.content || "Empty document...",
                        }}
                      />
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="uppercase">{note.type}</span>
                    <span>Updated {note.updatedAt || note.createdAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Editor & Checklist Studio */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden flex flex-col min-h-[580px]">
          {activeNote ? (
            <>
              {/* Document Header & Title bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-[#F8FAFC]">
                <div className="flex-1">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                    className="font-bold text-sm text-slate-900 bg-transparent w-full focus:outline-none"
                    placeholder="Document Title"
                  />
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                    <span className="uppercase">{activeNote.type} format</span>
                    <span>•</span>
                    <span>ID: {activeNote.id}</span>
                  </div>
                </div>

                {/* Color picker pills for current note & Save Button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {colorPalette.map((c) => (
                      <button
                        key={c.bg}
                        onClick={() => updateNote(activeNote.id, { color: c.bg })}
                        style={{ backgroundColor: c.bg, borderColor: c.border }}
                        className={`w-4 h-4 rounded-full border transition-transform ${
                          activeNote.color === c.bg ? "scale-125 ring-2 ring-blue-500" : ""
                        }`}
                        title={`Set card background: ${c.label}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const contentToSave = editorRef.current ? editorRef.current.innerHTML : activeNote.content;
                      updateNote(activeNote.id, { content: contentToSave }, true);
                    }}
                    className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Save current note document"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar for Rich Text Note */}
              {activeNote.type === "note" && (
                <div className="p-2 border-b border-slate-200 bg-white flex items-center gap-1 flex-wrap text-slate-700">
                  <button
                    onClick={() => formatDoc("bold")}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-700 font-bold"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => formatDoc("italic")}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-700 italic"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => formatDoc("underline")}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-700 underline"
                    title="Underline"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </button>

                  <div className="w-[1px] h-5 bg-slate-200 mx-1" />

                  {/* Text Color Swatches */}
                  <span className="text-[10px] font-semibold text-slate-400 ml-1">Colors:</span>
                  <button
                    onClick={() => formatDoc("foreColor", "#111827")}
                    className="w-4 h-4 rounded-full bg-slate-900 border border-slate-400"
                    title="Black"
                  />
                  <button
                    onClick={() => formatDoc("foreColor", "#2563EB")}
                    className="w-4 h-4 rounded-full bg-blue-600 border border-blue-400"
                    title="Blue"
                  />
                  <button
                    onClick={() => formatDoc("foreColor", "#DC2626")}
                    className="w-4 h-4 rounded-full bg-red-600 border border-red-400"
                    title="Red"
                  />
                  <button
                    onClick={() => formatDoc("foreColor", "#059669")}
                    className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-400"
                    title="Emerald"
                  />
                  <button
                    onClick={() => formatDoc("foreColor", "#D97706")}
                    className="w-4 h-4 rounded-full bg-amber-600 border border-amber-400"
                    title="Amber"
                  />
                  <button
                    onClick={() => formatDoc("foreColor", "#7C3AED")}
                    className="w-4 h-4 rounded-full bg-purple-600 border border-purple-400"
                    title="Purple"
                  />

                  <div className="w-[1px] h-5 bg-slate-200 mx-1" />

                  <button
                    onClick={() => formatDoc("insertUnorderedList")}
                    className="px-2 py-1 text-xs hover:bg-slate-100 rounded font-medium text-slate-700"
                    title="Bullet List"
                  >
                    • Bullet
                  </button>
                  <button
                    onClick={() => formatDoc("insertOrderedList")}
                    className="px-2 py-1 text-xs hover:bg-slate-100 rounded font-medium text-slate-700"
                    title="Numbered List"
                  >
                    1. Numbered
                  </button>
                </div>
              )}

              {/* Note Content Body */}
              {activeNote.type === "note" ? (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  className="flex-1 p-5 focus:outline-none min-h-[420px] text-sm text-slate-900 leading-relaxed overflow-y-auto"
                />
              ) : (
                /* Checklist Studio */
                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                  {/* Add item input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                      placeholder="Add a checklist task or item... (Press Enter)"
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white text-slate-900"
                    />
                    <button
                      onClick={handleAddChecklistItem}
                      className="h-9 px-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  {/* Checklist Items List */}
                  <div className="space-y-2">
                    {(activeNote.checklistItems || []).length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-400">
                        No checklist items yet. Type above and press Enter.
                      </div>
                    ) : (
                      (activeNote.checklistItems || []).map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                            item.done
                              ? "bg-slate-50 border-slate-200 text-slate-400"
                              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            onClick={() => handleToggleChecklistItem(item.id)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
                          >
                            <button
                              type="button"
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                item.done
                                  ? "bg-amber-500 border-amber-500 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <span
                              className={`font-medium ${
                                item.done ? "line-through text-slate-400" : "text-slate-800"
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteChecklistItem(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select or create a document to view editor.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteNote(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Delete Document"
        description="Are you sure you want to delete this document from your notepad? This action cannot be reversed."
      />
    </div>
  );
}
