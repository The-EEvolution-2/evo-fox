"use client";

import React, { useState } from "react";
import { useTracker } from "@/context/TrackerContext";
import { DeadlineOrMeeting } from "@/types/tracker";
import { 
  CalendarClock, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  ExternalLink,
  Flame
} from "lucide-react";

export const DeadlinesCalendarView: React.FC = () => {
  const { state, addEvent, toggleEventCompleted, deleteEvent } = useTracker();

  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const [title, setTitle] = useState("");
  const [type, setType] = useState<DeadlineOrMeeting["type"]>("deadline");
  const [dateTime, setDateTime] = useState("");
  const [linkOrLocation, setLinkOrLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isImportant, setIsImportant] = useState(false);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;

    addEvent({
      title,
      type,
      dateTime: new Date(dateTime).toISOString(),
      linkOrLocation,
      notes,
      isImportant,
      completed: false,
    });

    setTitle("");
    setDateTime("");
    setLinkOrLocation("");
    setNotes("");
    setIsImportant(false);
    setIsAdding(false);
  };

  const sortedEvents = [...state.events]
    .filter((e) => {
      if (filterType === "all") return true;
      return e.type === filterType;
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const getEventTimeLeft = (dateStr: string) => {
    const diffMs = new Date(dateStr).getTime() - Date.now();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (diffMs < 0) return { text: "Passed", isUrgent: true };
    if (diffHours < 24) return { text: `In ${diffHours} hours`, isUrgent: true };
    const diffDays = Math.ceil(diffHours / 24);
    return { text: `In ${diffDays} days`, isUrgent: diffDays <= 3 };
  };

  const getTypeStyle = (t: DeadlineOrMeeting["type"]) => {
    switch (t) {
      case "deadline":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "meeting":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "exam":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "submission":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 text-rose-400" />
            Deadlines & Meetings Schedule
          </h2>
          <p className="text-sm text-slate-400">
            Never miss an exam, project submission deadline, or critical sync meeting.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Event / Deadline
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: "all", label: "All Items" },
          { id: "deadline", label: "Deadlines" },
          { id: "meeting", label: "Meetings" },
          { id: "exam", label: "Exams & Certs" },
          { id: "submission", label: "Submissions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterType === tab.id
                ? "bg-slate-800 text-white font-semibold shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Timeline / Cards */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
            No events or deadlines recorded under this view.
          </div>
        ) : (
          sortedEvents.map((evt) => {
            const countdown = getEventTimeLeft(evt.dateTime);
            const dateObj = new Date(evt.dateTime);

            return (
              <div
                key={evt.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  evt.completed
                    ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleEventCompleted(evt.id)}
                    className="mt-1 text-slate-400 hover:text-white transition"
                  >
                    {evt.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getTypeStyle(
                          evt.type
                        )}`}
                      >
                        {evt.type}
                      </span>
                      {evt.isImportant && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          High Impact
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          countdown.isUrgent ? "text-amber-400" : "text-slate-400"
                        }`}
                      >
                        ⏱ {countdown.text}
                      </span>
                    </div>

                    <h3
                      className={`font-bold text-base ${
                        evt.completed ? "line-through text-slate-500" : "text-slate-100"
                      }`}
                    >
                      {evt.title}
                    </h3>

                    {evt.notes && (
                      <p className="text-xs text-slate-400 max-w-xl">{evt.notes}</p>
                    )}

                    {evt.linkOrLocation && (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 pt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{evt.linkOrLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Date & Time display */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-bold text-slate-200">
                      {dateObj.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-slate-400">
                      {dateObj.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvent(evt.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Event */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Add Deadline or Meeting</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Final Project Submission & Live Demo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="deadline">Project Deadline</option>
                    <option value="meeting">Sync Meeting</option>
                    <option value="exam">Exam / Assessment</option>
                    <option value="submission">Assignment Submission</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Location / Call URL
                </label>
                <input
                  type="text"
                  value={linkOrLocation}
                  onChange={(e) => setLinkOrLocation(e.target.value)}
                  placeholder="e.g., Google Meet (meet.google.com/...) or Classroom 302"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key deliverables, slide links, required tools..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="importantCheck"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                />
                <label htmlFor="importantCheck" className="text-xs text-slate-300 cursor-pointer">
                  Mark as High Priority / Crucial
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
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition shadow"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
