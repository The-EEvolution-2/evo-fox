"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { SkillItem } from "@/types/app";
import { Sparkles, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { ConfirmDialog } from "@/components/Modal";

export const SkillsView: React.FC = () => {
  const { store, updateSkill, deleteSkill, searchQuery } = useStore();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredSkills = store.skills.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.skillName.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Skill Cards Grid */}
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
