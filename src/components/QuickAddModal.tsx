"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Modal } from "@/components/Modal";
import { Plus } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addTask, addStudyLog, addTarget, addSkill, addDeadline, addTerm, addMoneyRecord } = useStore();
  const [entryType, setEntryType] = useState<"term" | "target" | "money" | "task" | "study" | "skill" | "deadline">("term");

  // Money form
  const [moneyTitle, setMoneyTitle] = useState("");
  const [moneyAmount, setMoneyAmount] = useState<number | "">("");
  const [moneyType, setMoneyType] = useState<"Expense" | "Income">("Expense");
  const [moneyPaymentMode, setMoneyPaymentMode] = useState<"Online" | "Cash">("Online");
  const [moneyPurpose, setMoneyPurpose] = useState<any>("Food & Dining");
  const [moneyIsLoan, setMoneyIsLoan] = useState(false);
  const [moneyLender, setMoneyLender] = useState("");
  const [moneyRepayDueDate, setMoneyRepayDueDate] = useState("");

  // Term form
  const [termName, setTermName] = useState("");
  const [termTopic, setTermTopic] = useState("Web Dev");
  const [termSubtopic, setTermSubtopic] = useState("Backend");
  const [termNotes, setTermNotes] = useState("");

  // Target form (Short-term & Long-term)
  const [targetTitle, setTargetTitle] = useState("");
  const [targetHorizon, setTargetHorizon] = useState<"Short-term" | "Long-term">("Short-term");
  const [targetCategory, setTargetCategory] = useState<any>("Study");
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]);
  const [targetProgress, setTargetProgress] = useState(25);
  const [targetColor, setTargetColor] = useState("blue");

  // Task form
  const [taskTitle, setTaskTitle] = useState("");
  const [taskModule, setTaskModule] = useState<any>("Study");
  const [taskPriority, setTaskPriority] = useState<any>("Medium");
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split("T")[0]);

  // Study form (Subject main + Subtopic + Specific question/proof/example)
  const [studyCourse, setStudyCourse] = useState("");
  const [studySubtopic, setStudySubtopic] = useState("");
  const [studyTopic, setStudyTopic] = useState("");
  const [studyProofOrExample, setStudyProofOrExample] = useState("");
  const [studyMinutes, setStudyMinutes] = useState(45);
  const [studyColor, setStudyColor] = useState("blue");

  // Skill form
  const [skillName, setSkillName] = useState("");
  const [skillDomain, setSkillDomain] = useState("Engineering");
  const [skillLevel, setSkillLevel] = useState(1);
  const [skillTargetHours, setSkillTargetHours] = useState(50);

  // Deadline form
  const [eventTitle, setEventTitle] = useState("");
  const [eventKind, setEventKind] = useState<any>("Deadline");
  const [eventDue, setEventDue] = useState("");
  const [eventLoc, setEventLoc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (entryType === "target") {
      if (!targetTitle.trim()) return;
      addTarget({
        title: targetTitle.trim(),
        horizon: targetHorizon,
        category: targetCategory,
        targetDate,
        progress: Number(targetProgress),
        status: Number(targetProgress) >= 100 ? "Achieved" : "In Progress",
        color: targetColor,
      });
      setTargetTitle("");
    } else if (entryType === "money") {
      if (!moneyTitle.trim() || !moneyAmount || Number(moneyAmount) <= 0) return;
      addMoneyRecord({
        title: moneyTitle.trim(),
        amount: Number(moneyAmount),
        type: moneyType,
        paymentMode: moneyPaymentMode,
        purpose: moneyType === "Income" ? "Other" : moneyPurpose,
        date: new Date().toISOString().split("T")[0],
        isLoan: moneyIsLoan,
        lenderOrBorrower: moneyIsLoan ? (moneyLender.trim() || undefined) : undefined,
        isRepaid: false,
        repaymentDueDate: moneyIsLoan && moneyRepayDueDate ? moneyRepayDueDate : undefined,
      });
      setMoneyTitle("");
      setMoneyAmount("");
      setMoneyIsLoan(false);
      setMoneyLender("");
      setMoneyRepayDueDate("");
    } else if (entryType === "term") {
      if (!termName.trim() || !termTopic.trim() || !termSubtopic.trim()) return;
      addTerm({
        term: termName.trim(),
        topic: termTopic.trim(),
        subtopic: termSubtopic.trim(),
        learned: false,
        notes: termNotes.trim() || undefined,
      });
      setTermName("");
      setTermNotes("");
    } else if (entryType === "task") {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        module: taskModule,
        priority: taskPriority,
        status: "Backlog",
        dueDate: taskDueDate,
      });
      setTaskTitle("");
    } else if (entryType === "study") {
      if (!studyCourse.trim() || !studyTopic.trim()) return;
      addStudyLog({
        course: studyCourse.trim(),
        subtopic: studySubtopic.trim() || "General",
        topic: studyTopic.trim(),
        proofOrExample: studyProofOrExample.trim() || undefined,
        durationMinutes: Number(studyMinutes),
        date: new Date().toISOString().split("T")[0],
        notes: "Logged via Quick Add modal",
        color: studyColor,
      });
      setStudyTopic("");
      setStudyProofOrExample("");
    } else if (entryType === "skill") {
      if (!skillName.trim()) return;
      addSkill({
        skillName: skillName.trim(),
        domain: skillDomain.trim(),
        proficiencyLevel: Number(skillLevel),
        targetHours: Number(skillTargetHours),
        completedHours: 0,
        lastPracticed: new Date().toISOString().split("T")[0],
      });
      setSkillName("");
    } else if (entryType === "deadline") {
      if (!eventTitle.trim() || !eventDue) return;
      addDeadline({
        title: eventTitle.trim(),
        kind: eventKind,
        dueDateTime: new Date(eventDue).toISOString(),
        locationOrUrl: eventLoc.trim() || "Local / Remote",
        status: "Scheduled",
      });
      setEventTitle("");
      setEventDue("");
      setEventLoc("");
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Entry (N)">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Entry Type Selector */}
        <div>
          <label className="sub-label block mb-1.5">Select Record Type</label>
          <div className="grid grid-cols-7 border border-[#D1D5DB]">
            {(
              [
                { id: "term", label: "Term" },
                { id: "target", label: "Target" },
                { id: "money", label: "Expense" },
                { id: "task", label: "Task" },
                { id: "study", label: "Study" },
                { id: "skill", label: "Skill" },
                { id: "deadline", label: "Deadline" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setEntryType(t.id)}
                className={`h-8 font-semibold text-xs transition-colors ${
                  entryType === t.id
                    ? "bg-black text-white"
                    : "bg-white text-[#374151] hover:text-black hover:bg-[#F3F4F6]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields */}
        {entryType === "money" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="sub-label block mb-1">Type</label>
                <select
                  value={moneyType}
                  onChange={(e) => setMoneyType(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div>
                <label className="sub-label block mb-1">Mode</label>
                <select
                  value={moneyPaymentMode}
                  onChange={(e) => setMoneyPaymentMode(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="Online">Online / UPI</option>
                  <option value="Cash">Cash In Hand</option>
                </select>
              </div>
              <div>
                <label className="sub-label block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={moneyAmount}
                  onChange={(e) => setMoneyAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="sub-label block mb-1">Description / Item</label>
              <input
                type="text"
                required
                value={moneyTitle}
                onChange={(e) => setMoneyTitle(e.target.value)}
                placeholder="e.g. Study cafe coffee, Book purchase, Metro ticket"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              />
            </div>
            {moneyType === "Expense" && (
              <div>
                <label className="sub-label block mb-1">Purpose Category</label>
                <select
                  value={moneyPurpose}
                  onChange={(e) => setMoneyPurpose(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Books & Courses">Books & Courses</option>
                  <option value="Tech & Software">Tech & Software</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Personal & Health">Personal & Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Loan / Borrow Toggle */}
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={moneyIsLoan}
                  onChange={(e) => setMoneyIsLoan(e.target.checked)}
                  className="w-3.5 h-3.5 text-rose-600 rounded"
                />
                <span className="text-xs font-bold text-rose-900">
                  Borrowed Loan (Need to repay)
                </span>
              </label>

              {moneyIsLoan && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200">
                  <div>
                    <label className="sub-label block mb-1 text-rose-900 font-semibold">
                      Took loan from *
                    </label>
                    <input
                      type="text"
                      required={moneyIsLoan}
                      value={moneyLender}
                      onChange={(e) => setMoneyLender(e.target.value)}
                      placeholder="e.g. Rahul, John"
                      className="w-full h-7 px-2 border border-rose-300 rounded bg-white text-[#09090B] text-xs"
                    />
                  </div>
                  <div>
                    <label className="sub-label block mb-1 text-rose-900 font-semibold">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={moneyRepayDueDate}
                      onChange={(e) => setMoneyRepayDueDate(e.target.value)}
                      className="w-full h-7 px-2 border border-rose-300 rounded bg-white text-[#09090B] text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {entryType === "term" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="sub-label block mb-1">Topic (Main Name)</label>
                <input
                  type="text"
                  required
                  value={termTopic}
                  onChange={(e) => setTermTopic(e.target.value)}
                  placeholder="e.g. Web Dev"
                  className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Subtopic</label>
                <input
                  type="text"
                  required
                  value={termSubtopic}
                  onChange={(e) => setTermSubtopic(e.target.value)}
                  placeholder="e.g. Backend / Authentication"
                  className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                />
              </div>
            </div>
            <div>
              <label className="sub-label block mb-1">Term to Learn</label>
              <input
                type="text"
                required
                value={termName}
                onChange={(e) => setTermName(e.target.value)}
                placeholder="e.g. RESTful Idempotency / OAuth PKCE"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                autoFocus
              />
            </div>
            <div>
              <label className="sub-label block mb-1">Conceptual Notes (Optional)</label>
              <input
                type="text"
                value={termNotes}
                onChange={(e) => setTermNotes(e.target.value)}
                placeholder="Key concept or definition..."
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              />
            </div>
          </div>
        )}

        {/* Dynamic Fields */}
        {entryType === "task" && (
          <div className="space-y-3">
            <div>
              <label className="sub-label block mb-1">Task Title</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Write benchmarking script for concurrency test"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="sub-label block mb-1">Domain</label>
                <select
                  value={taskModule}
                  onChange={(e) => setTaskModule(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="Study">Study</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Career">Career</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="sub-label block mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="sub-label block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Target Form */}
        {entryType === "target" && (
          <div className="space-y-3">
            <div>
              <label className="sub-label block mb-1">Target Horizon</label>
              <div className="grid grid-cols-2 border border-[#D1D5DB]">
                <button
                  type="button"
                  onClick={() => setTargetHorizon("Short-term")}
                  className={`h-8 font-bold text-xs uppercase ${
                    targetHorizon === "Short-term"
                      ? "bg-black text-white"
                      : "bg-white text-[#374151] hover:text-black"
                  }`}
                >
                  Short-Term (Weeks)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetHorizon("Long-term")}
                  className={`h-8 font-bold text-xs uppercase ${
                    targetHorizon === "Long-term"
                      ? "bg-black text-white"
                      : "bg-white text-[#374151] hover:text-black"
                  }`}
                >
                  Long-Term (Months)
                </button>
              </div>
            </div>

            <div>
              <label className="sub-label block mb-1">Milestone Objective</label>
              <input
                type="text"
                required
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="e.g. Master Consensus Proofs & Lease Skews"
                className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-semibold"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="sub-label block mb-1">Category</label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#D1D5DB] bg-white text-black font-medium"
                >
                  <option value="Study">Study</option>
                  <option value="Skill">Skill</option>
                  <option value="Career">Career</option>
                  <option value="Financial">Financial</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="sub-label block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-8 px-2 border border-[#D1D5DB] bg-white text-black font-mono font-bold"
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Accent Color</label>
                <select
                  value={targetColor}
                  onChange={(e) => setTargetColor(e.target.value)}
                  className="w-full h-8 px-2 border border-[#D1D5DB] bg-white text-black font-semibold"
                >
                  <option value="blue">Blue</option>
                  <option value="emerald">Emerald</option>
                  <option value="purple">Purple</option>
                  <option value="amber">Amber</option>
                  <option value="rose">Rose</option>
                  <option value="cyan">Cyan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {entryType === "study" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="sub-label block mb-1">Subject (Main Topic)</label>
                <input
                  type="text"
                  required
                  value={studyCourse}
                  onChange={(e) => setStudyCourse(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-semibold"
                  autoFocus
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Subtopic</label>
                <input
                  type="text"
                  required
                  value={studySubtopic}
                  onChange={(e) => setStudySubtopic(e.target.value)}
                  placeholder="e.g. Consensus Algorithms"
                  className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="sub-label block mb-1">Specific Question / Concept / Theorem</label>
              <input
                type="text"
                required
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="e.g. Paxos Lease Correctness & Quorum Intersections"
                className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-semibold"
              />
            </div>

            <div>
              <label className="sub-label block mb-1">Specific Proof / Example / Formula</label>
              <textarea
                rows={2}
                value={studyProofOrExample}
                onChange={(e) => setStudyProofOrExample(e.target.value)}
                placeholder="Proof argument, mathematical formula, or specific code example..."
                className="w-full p-2 border border-[#D1D5DB] bg-white text-black font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="sub-label block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  required
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Number(e.target.value))}
                  className="w-full h-8 px-2.5 border border-[#D1D5DB] bg-white text-black font-mono font-bold"
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Visual Accent</label>
                <select
                  value={studyColor}
                  onChange={(e) => setStudyColor(e.target.value)}
                  className="w-full h-8 px-2 border border-[#D1D5DB] bg-white text-black font-semibold"
                >
                  <option value="blue">Blue</option>
                  <option value="emerald">Emerald</option>
                  <option value="purple">Purple</option>
                  <option value="amber">Amber</option>
                  <option value="rose">Rose</option>
                  <option value="cyan">Cyan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {entryType === "skill" && (
          <div className="space-y-3">
            <div>
              <label className="sub-label block mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Modern C++ Memory Management"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="sub-label block mb-1">Domain</label>
                <input
                  type="text"
                  required
                  value={skillDomain}
                  onChange={(e) => setSkillDomain(e.target.value)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Level (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(Number(e.target.value))}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                />
              </div>
              <div>
                <label className="sub-label block mb-1">Target Hours</label>
                <input
                  type="number"
                  min={10}
                  value={skillTargetHours}
                  onChange={(e) => setSkillTargetHours(Number(e.target.value))}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {entryType === "deadline" && (
          <div className="space-y-3">
            <div>
              <label className="sub-label block mb-1">Title</label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Research Progress Review Meeting"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="sub-label block mb-1">Kind</label>
                <select
                  value={eventKind}
                  onChange={(e) => setEventKind(e.target.value as any)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B]"
                >
                  <option value="Deadline">Deadline</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Exam">Exam</option>
                </select>
              </div>
              <div>
                <label className="sub-label block mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={eventDue}
                  onChange={(e) => setEventDue(e.target.value)}
                  className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                />
              </div>
            </div>
            <div>
              <label className="sub-label block mb-1">Location or URL</label>
              <input
                type="text"
                value={eventLoc}
                onChange={(e) => setEventLoc(e.target.value)}
                placeholder="e.g. Room 204 or https://meet.google.com/..."
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
              />
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 border border-[#E4E4E7] text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA]"
          >
            Cancel (Esc)
          </button>
          <button
            type="submit"
            className="h-8 px-4 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A]"
          >
            Create Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
