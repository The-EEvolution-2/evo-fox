"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { 
  User, 
  Mail, 
  School, 
  GraduationCap, 
  Target, 
  FileText, 
  Save, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  BookOpen,
  Wallet
} from "lucide-react";

export function ProfileView() {
  const { store, updateUserProfile } = useStore();
  const profile = store.userProfile || {
    name: "Alex Dev",
    email: "alex.student@edu.internal",
    role: "Computer Science & Engineering Scholar",
    institution: "National Institute of Technology",
    semesterOrYear: "Semester VI (Junior Year)",
    major: "Distributed Systems & Cloud Computing",
    bio: "Passionate about high-throughput distributed architectures, concurrent programming, and building resilient software.",
    avatarUrl: "/logo.png",
    primaryGoal: "Master core distributed systems algorithms and crack tier-1 systems engineering roles."
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const completedTerms = (store.terms || []).filter(t => t.learned).length;
  const totalTerms = (store.terms || []).length;
  const totalStudyMins = (store.studyLogs || []).reduce((sum, l) => sum + l.durationMinutes, 0);
  const totalStudyHours = (totalStudyMins / 60).toFixed(1);
  const completedTasks = (store.tasks || []).filter(t => t.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shrink-0 shadow-md">
              <img
                src={profile.avatarUrl || "/logo.png"}
                alt="Profile Avatar"
                className="w-full h-full object-cover rounded-xl bg-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  Student Scholar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{profile.role}</p>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  {profile.institution}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {profile.semesterOrYear}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                setFormData(profile);
                setIsEditing(false);
              } else {
                setFormData(profile);
                setIsEditing(true);
              }
            }}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs self-start sm:self-center ${
              isEditing 
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Terms Learned</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {completedTerms} <span className="text-xs text-slate-400 font-normal">/ {totalTerms}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hours Studied</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {totalStudyHours} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tasks Finished</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {completedTasks}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Base</span>
            <Wallet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            ₹{store.monthlyAllowance}
          </div>
        </div>
      </div>

      {/* Main Profile Info or Edit Form */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Edit Scholar Profile Information</h2>
              <span className="text-xs text-slate-500">Changes will be saved into your local vault</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="sub-label block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="sub-label block mb-1">Academic Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="sub-label block mb-1">Institution / University</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="sub-label block mb-1">Semester / Academic Year</label>
                <input
                  type="text"
                  required
                  value={formData.semesterOrYear}
                  onChange={(e) => setFormData({ ...formData, semesterOrYear: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="sub-label block mb-1">Major / Specialization</label>
                <input
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="sub-label block mb-1">Role / Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="sub-label block mb-1">Primary North-Star Goal</label>
              <input
                type="text"
                required
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="text-xs">
              <label className="sub-label block mb-1">Scholar Bio & Research Interests</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Scholar Statement
              </span>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{profile.bio}"
              </p>
            </div>

            {/* Academic Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/70 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Objective
                </span>
                <div className="flex items-start gap-2.5 mt-2">
                  <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-slate-900">{profile.primaryGoal}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/70 bg-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Major / Discipline
                </span>
                <div className="flex items-start gap-2.5 mt-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-slate-900">{profile.major}</p>
                </div>
              </div>
            </div>

            {/* Security & System Info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Local Vault Storage Active (100% Offline-First Data Confidentiality)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">ID: SCHOLAR-EDU-2026</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
