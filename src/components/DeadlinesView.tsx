"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { MeetingDeadline } from "@/types/app";
import { CalendarClock, Plus, Trash2, MapPin, CheckCircle2, Circle } from "lucide-react";
import { ConfirmDialog } from "@/components/Modal";

export const DeadlinesView: React.FC = () => {
  const { store, updateDeadline, deleteDeadline, searchQuery } = useStore();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredDeadlines = store.deadlines.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.kind.toLowerCase().includes(q) ||
        d.locationOrUrl.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D1D5DB] overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D1D5DB] bg-[#F9FAFB] text-black font-mono">
              <th className="p-3.5 w-14 text-center uppercase tracking-wider text-xs font-bold">Done</th>
              <th className="p-3.5 w-32 uppercase tracking-wider text-xs font-bold">Type</th>
              <th className="p-3.5 uppercase tracking-wider text-xs font-bold">Event / Milestone</th>
              <th className="p-3.5 w-52 uppercase tracking-wider text-xs font-bold">Target Date & Time</th>
              <th className="p-3.5 w-64 uppercase tracking-wider text-xs font-bold">Location / Remote URL</th>
              <th className="p-3.5 w-32 uppercase tracking-wider text-xs font-bold">Status</th>
              <th className="p-3.5 w-16 text-right uppercase tracking-wider text-xs font-bold">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1D5DB]">
            {filteredDeadlines.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-[#374151] text-sm">
                  No upcoming deadlines or meetings found.
                </td>
              </tr>
            ) : (
              filteredDeadlines.map((evt) => {
                const dateObj = new Date(evt.dueDateTime);
                const isDone = evt.status === "Completed";

                return (
                  <tr key={evt.id} className="hover:bg-[#F9FAFB] transition-colors">
                    {/* Toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() =>
                          updateDeadline(evt.id, {
                            status: isDone ? "Scheduled" : "Completed",
                          })
                        }
                        className="text-[#374151] hover:text-black"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-black" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#6B7280]" />
                        )}
                      </button>
                    </td>

                    {/* Kind with distinctive event color */}
                    <td className="p-3.5 font-mono text-xs uppercase font-bold">
                      <span className={`px-2 py-0.5 border ${
                        evt.kind === "Exam"
                          ? "bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]"
                          : evt.kind === "Deadline"
                          ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                          : evt.kind === "Milestone"
                          ? "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF]"
                          : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                      }`}>
                        {evt.kind}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="p-3.5">
                      <span className={`font-semibold ${isDone ? "line-through text-[#6B7280]" : "text-black text-sm"}`}>
                        {evt.title}
                      </span>
                    </td>

                    {/* Date/Time */}
                    <td className="p-3.5 font-mono text-xs text-black">
                      {dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      <strong className="text-black">
                        {dateObj.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </td>

                    {/* Location */}
                    <td className="p-3.5 text-[#374151] truncate font-mono text-xs">
                      {evt.locationOrUrl}
                    </td>

                    {/* Status with Color Tag */}
                    <td className="p-3.5">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                        evt.status === "Completed"
                          ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                          : evt.status === "Scheduled"
                          ? "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                          : "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                      }`}>
                        {evt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setDeleteTargetId(evt.id)}
                        className="p-1.5 text-[#374151] hover:text-black border border-transparent hover:border-[#D1D5DB]"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Milestone Record"
        description="Are you sure you want to delete this event deadline?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteDeadline(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
