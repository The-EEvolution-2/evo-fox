"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Flame, Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/Modal";

export const HabitsView: React.FC = () => {
  const { store, toggleHabit, addHabit, deleteHabit, searchQuery } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCadence, setNewHabitCadence] = useState<"Daily" | "Weekday">("Daily");

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitCadence);
    setNewHabitName("");
    setIsAddModalOpen(false);
  };

  const filteredHabits = store.habits.filter((h) => {
    if (searchQuery.trim()) {
      return h.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card with Custom Modal Trigger */}
      <div className="bg-white border border-[#E4E4E7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="sub-label">Daily Cadence</span>
          <h2 className="text-base font-bold text-[#09090B] mt-0.5">
            Habit Consistency & Discipline
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Maintain daily and weekday habits with consecutive streak telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-8 px-3.5 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A] flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="bg-white border border-[#E4E4E7] divide-y divide-[#E4E4E7]">
        {filteredHabits.length === 0 ? (
          <div className="p-8 text-center text-[#71717A] text-xs">
            No habits active. Click "Add Habit" to create your first cadence.
          </div>
        ) : (
          filteredHabits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleHabit(habit.id)}
              >
                <button
                  type="button"
                  className="w-5 h-5 border border-[#D1D5DB] flex items-center justify-center shrink-0"
                >
                  {habit.completedToday ? (
                    <CheckSquare className="w-5 h-5 text-[#059669] fill-[#ECFDF5]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </button>

                <div>
                  <h4
                    className={`text-sm font-bold ${
                      habit.completedToday ? "line-through text-[#6B7280]" : "text-black"
                    }`}
                  >
                    {habit.name}
                  </h4>
                  <span className="font-mono text-xs uppercase px-1.5 py-0.2 bg-[#F9FAFB] text-[#4B5563] border border-[#D1D5DB] font-semibold">
                    {habit.cadence}
                  </span>
                </div>
              </div>

              {/* Streak info & delete */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1">
                  <Flame className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
                  <span>{habit.streakDays}d Streak</span>
                </div>

                <button
                  onClick={() => setDeleteTargetId(habit.id)}
                  className="p-1.5 text-[#374151] hover:text-black border border-transparent hover:border-[#D1D5DB]"
                  title="Delete habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Modal for Adding Habit */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Habit Cadence"
      >
        <form onSubmit={handleCreateHabit} className="space-y-4 text-xs">
          <div>
            <label className="sub-label block mb-1">Habit Title</label>
            <input
              type="text"
              required
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. 60-min deep architecture reading"
              className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              autoFocus
            />
          </div>

          <div>
            <label className="sub-label block mb-1">Cadence Schedule</label>
            <select
              value={newHabitCadence}
              onChange={(e) => setNewHabitCadence(e.target.value as any)}
              className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
            >
              <option value="Daily">Daily Cadence (7 days / week)</option>
              <option value="Weekday">Weekday Only (Mon - Fri)</option>
            </select>
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
              Save Habit
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Habit"
        description="Are you sure you want to delete this habit cadence record?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteHabit(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
