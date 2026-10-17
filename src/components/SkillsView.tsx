"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { SkillItem } from "@/types/app";
import { Sparkles, Plus, Trash2, ArrowUpDown, BookOpen } from "lucide-react";
import { ConfirmDialog, Modal } from "@/components/Modal";

interface SkillsViewProps {
  onOpenQuickAdd?: () => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onOpenQuickAdd }) => {
  const { store, addSkill, updateSkill, deleteSkill, searchQuery } = useStore();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Skill form state
  const [skillName, setSkillName] = useState("");
  const [skillDomain, setSkillDomain] = useState("Engineering");
  const [proficiencyLevel, setProficiencyLevel] = useState(1);
  const [targetHours, setTargetHours] = useState(50);

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    addSkill({
      skillName: skillName.trim(),
      domain: skillDomain.trim() || "General",
      proficiencyLevel,
      targetHours: Number(targetHours) || 50,
      completedHours: 0,
      lastPracticed: new Date().toISOString().split("T")[0],
    });

    setSkillName("");
    setSkillDomain("Engineering");
    setProficiencyLevel(1);
    setTargetHours(50);
    setIsAddModalOpen(false);
  };

  const filteredSkills = store.skills.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.skillName.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header with stats and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#D1D5DB] p-4">
        <div>
          <h2 className="text-base font-bold text-black flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E11D48]" />
            Skill Competency Matrix
          </h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
            5-tier technical proficiency steppers with dedicated practice hour logs
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary h-8 px-3.5 text-xs flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Skill Competency</span>
        </button>
      </div>

      {/* Empty State when no skills exist or match search */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white border border-[#D1D5DB] p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-[#FFF1F2] border border-[#FECDD3] rounded-full flex items-center justify-center text-[#E11D48]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-black">
              {searchQuery ? "No matching skills found" : "No Skill Competencies Registered"}
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              {searchQuery
                ? `No skills matched your search query "${searchQuery}". Clear search or add a new skill.`
                : "Your competency matrix is currently empty (badge shows 0). Add technical or study skills to track hours and proficiency levels."}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary h-9 px-4 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Skill</span>
            </button>
          </div>
        </div>
      ) : (
        /* Skill Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          const progressPct = Math.round((skill.completedHours / skill.targetHours) * 100);

          return (
            <div key={skill.id} className="bg-white border border-[#D1D5DB] p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="sub-label text-xs">{skill.domain}</span>
                  <h3 className="text-base font-bold text-black mt-1.5">{skill.skillName}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs border border-[#D1D5DB] px-2.5 py-1 font-bold text-black bg-[#F9FAFB]">
                    LVL {skill.proficiencyLevel}/5
                  </span>
                  <button
                    onClick={() => setDeleteTargetId(skill.id)}
                    className="p-1.5 text-[#374151] hover:text-black border border-transparent hover:border-[#D1D5DB]"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sharp 5-Tier Level Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#374151] font-mono font-medium">
                  <span>Proficiency Tier</span>
                  <span>Target: Tier 5</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isReached = lvl <= skill.proficiencyLevel;
                    return (
                      <button
                        key={lvl}
                        onClick={() => updateSkill(skill.id, { proficiencyLevel: lvl })}
                        className={`h-3 border transition-colors ${
                          isReached
                            ? "bg-black border-black"
                            : "bg-[#F9FAFB] border-[#D1D5DB] hover:border-black"
                        }`}
                        title={`Set to tier ${lvl}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Progress and hours */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-[#374151] font-medium">Practice Allocation</span>
                  <span className="font-bold text-black tabular-nums">
                    {skill.completedHours}h / {skill.targetHours}h ({progressPct}%)
                  </span>
                </div>

                {/* Strict flat sharp progress bar */}
                <div className="w-full bg-[#E5E7EB] h-2.5">
                  <div
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                    className="bg-black h-2.5"
                  />
                </div>
              </div>

              {/* Quick Hours Increment Footer */}
              <div className="flex items-center justify-between border-t border-[#D1D5DB] pt-4 text-sm">
                <span className="text-[#374151] font-mono text-xs">
                  Last active: <strong className="text-black">{skill.lastPracticed}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSkill(skill.id, {
                        completedHours: skill.completedHours + 1,
                        lastPracticed: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="h-8 px-3 border border-[#D1D5DB] hover:border-black text-xs font-mono font-bold hover:bg-[#F3F4F6] text-black"
                  >
                    +1h Log
                  </button>
                  <button
                    onClick={() =>
                      updateSkill(skill.id, {
                        completedHours: skill.completedHours + 4,
                        lastPracticed: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="h-8 px-3 bg-black text-white text-xs font-mono font-bold hover:bg-[#1F2937]"
                  >
                    +4h Block
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Skill Competency"
      >
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <div>
            <label className="sub-label block mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. Distributed Consensus (Raft / Paxos)"
              className="w-full h-9 px-3 border border-[#D1D5DB] bg-white text-black font-semibold text-sm focus:border-black outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="sub-label block mb-1">Domain / Field</label>
              <input
                type="text"
                required
                value={skillDomain}
                onChange={(e) => setSkillDomain(e.target.value)}
                placeholder="e.g. Engineering, Algorithms"
                className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black text-xs font-semibold focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="sub-label block mb-1">Initial Level (1-5)</label>
              <select
                value={proficiencyLevel}
                onChange={(e) => setProficiencyLevel(Number(e.target.value))}
                className="w-full h-8 px-2 border border-[#D1D5DB] bg-white text-black text-xs font-bold font-mono focus:border-black outline-none"
              >
                <option value={1}>Tier 1 - Novice</option>
                <option value={2}>Tier 2 - Advanced Beginner</option>
                <option value={3}>Tier 3 - Competent</option>
                <option value={4}>Tier 4 - Proficient</option>
                <option value={5}>Tier 5 - Expert</option>
              </select>
            </div>
            <div>
              <label className="sub-label block mb-1">Target Hours</label>
              <input
                type="number"
                min={5}
                step={5}
                required
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-mono font-bold text-xs focus:border-black outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-8 px-3.5 border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F3F4F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary h-8 px-4 text-xs font-bold"
            >
              Create Skill
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Skill Item"
        description="Are you sure you want to delete this skill tracking competency?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteSkill(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
