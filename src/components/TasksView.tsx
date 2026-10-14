"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { TaskItem } from "@/types/app";
import { Plus, Trash2, ArrowUpDown, Filter, Edit2, Check, X } from "lucide-react";
import { ConfirmDialog } from "@/components/Modal";

export const TasksView: React.FC = () => {
  const { store, addTask, updateTask, deleteTask, searchQuery } = useStore();

  const [sortField, setSortField] = useState<keyof TaskItem>("dueDate");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [filterModule, setFilterModule] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<TaskItem["priority"]>("Medium");
  const [editStatus, setEditStatus] = useState<TaskItem["status"]>("In Progress");

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Sorting handler
  const handleSort = (field: keyof TaskItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const startEdit = (t: TaskItem) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditPriority(t.priority);
    setEditStatus(t.status);
  };

  const saveEdit = (id: string) => {
    updateTask(id, {
      title: editTitle,
      priority: editPriority,
      status: editStatus,
    });
    setEditingId(null);
  };

  // Filter & Search
  const filteredTasks = store.tasks
    .filter((t) => {
      if (filterModule !== "All" && t.module !== filterModule) return false;
      if (filterStatus !== "All" && t.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Table Filter Controls Header */}
      <div className="bg-white border border-[#E4E4E7] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <Filter className="w-3.5 h-3.5" />
            <span className="sub-label">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A]">Domain:</span>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="h-7 border border-[#E4E4E7] text-xs px-2 bg-white text-[#09090B]"
            >
              <option value="All">All Domains</option>
              <option value="Study">Study</option>
              <option value="Engineering">Engineering</option>
              <option value="Career">Career</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-7 border border-[#E4E4E7] text-xs px-2 bg-white text-[#09090B]"
            >
              <option value="All">All Statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-[#71717A]">
          Showing {filteredTasks.length} of {store.tasks.length} items
        </div>
      </div>

      {/* Main Sortable & Inline-Editable Table */}
      <div className="bg-white border border-[#D1D5DB] overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D1D5DB] bg-[#F9FAFB] text-black sticky top-0 font-mono font-bold">
              <th
                onClick={() => handleSort("id")}
                className="p-3.5 w-24 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  ID <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th
                onClick={() => handleSort("title")}
                className="p-3.5 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  Task Item Title <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th
                onClick={() => handleSort("module")}
                className="p-3.5 w-36 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  Domain <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th
                onClick={() => handleSort("priority")}
                className="p-3.5 w-28 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  Priority <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="p-3.5 w-36 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  Status <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th
                onClick={() => handleSort("dueDate")}
                className="p-3.5 w-32 cursor-pointer hover:bg-[#E5E7EB] uppercase tracking-wider text-xs font-bold"
              >
                <div className="flex items-center gap-1.5">
                  Due Date <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                </div>
              </th>
              <th className="p-3.5 w-24 text-right uppercase tracking-wider text-xs font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1D5DB]">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#4B5563] font-medium">
                  No matching tasks found.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const isEditing = editingId === task.id;

                return (
                  <tr key={task.id} className="hover:bg-[#F9FAFB] transition-colors">
                    {/* ID */}
                    <td className="p-3.5 font-mono text-xs font-bold text-black">{task.id}</td>

                    {/* Title */}
                    <td className="p-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full h-8 px-2.5 border border-black text-sm text-black font-medium"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`font-semibold ${
                            task.status === "Completed" ? "line-through text-[#6B7280]" : "text-black"
                          }`}
                        >
                          {task.title}
                        </span>
                      )}
                    </td>

                    {/* Module with Domain Color Badge */}
                    <td className="p-3.5">
                      <span className={`font-mono text-xs font-bold uppercase px-2 py-0.5 border ${
                        task.module === "Study"
                          ? "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                          : task.module === "Engineering"
                          ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                          : task.module === "Career"
                          ? "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF]"
                          : "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                      }`}>
                        {task.module}
                      </span>
                    </td>

                    {/* Priority with Alert Colors */}
                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as any)}
                          className="h-8 border border-black text-xs px-2 bg-white font-medium"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      ) : (
                        <span className={`font-mono text-xs uppercase px-2 py-0.5 border font-bold ${
                          task.priority === "High"
                            ? "bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]"
                            : task.priority === "Medium"
                            ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                            : "bg-[#F3F4F6] text-[#4B5563] border-[#D1D5DB]"
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </td>

                    {/* Status with Active Pill Colors */}
                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="h-8 border border-[#18181B] text-xs px-1 bg-white"
                        >
                          <option value="Backlog">Backlog</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                            task.status === "Completed"
                              ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
                              : task.status === "In Progress"
                              ? "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                              : "bg-[#F9FAFB] text-[#4B5563] border-[#D1D5DB]"
                          }`}
                        >
                          {task.status}
                        </span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="p-3.5 font-mono text-xs text-[#374151] font-semibold">{task.dueDate}</td>

                    {/* Inline actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(task.id)}
                              className="p-1 border border-[#18181B] text-[#18181B] hover:bg-[#F4F4F5]"
                              title="Save"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 border border-[#E4E4E7] text-[#71717A] hover:bg-[#F4F4F5]"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(task)}
                              className="p-1 text-[#71717A] hover:text-[#09090B] border border-transparent hover:border-[#E4E4E7]"
                              title="Inline edit"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(task.id)}
                              className="p-1 text-[#71717A] hover:text-[#18181B] border border-transparent hover:border-[#E4E4E7]"
                              title="Delete task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Task Record"
        description="Are you sure you want to permanently delete this task item? This action will remove it from local state immediately."
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteTask(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
