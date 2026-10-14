"use client";

import React, { useState } from "react";
import { useTracker } from "@/context/TrackerContext";
import { 
  X, 
  Database, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2,
  Copy
} from "lucide-react";

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isOnlineFirestore, syncToCloud, resetToDefault, state } = useTracker();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `edu_tracker_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const sampleEnv = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef`;

  const copyEnvSample = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Database & Cloud Storage</h2>
              <p className="text-xs text-slate-400">Manage Firestore synchronization and offline backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isOnlineFirestore 
              ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300"
              : "bg-amber-950/30 border-amber-800/50 text-amber-300"
          }`}>
            {isOnlineFirestore ? (
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-semibold text-sm">
                {isOnlineFirestore ? "Connected to Firestore Backend" : "Running on Local Vault Storage"}
              </div>
              <p className="text-slate-300">
                {isOnlineFirestore
                  ? "Your study sessions, roadmaps, tasks, and deadlines are automatically synced across devices in real-time."
                  : "Every action is safely saved locally in your browser storage. You can configure Firebase credentials anytime to enable live multi-device syncing."}
              </p>
            </div>
          </div>

          {/* How to configure Firestore */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Firestore Configuration (.env.local)
              </span>
              <button
                onClick={copyEnvSample}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied template" : "Copy .env template"}
              </button>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <pre>{sampleEnv}</pre>
            </div>
            <p className="text-xs text-slate-400">
              Create a free project at <span className="text-indigo-400">console.firebase.google.com</span>, create a Firestore database, and paste keys in <code className="text-slate-200">.env.local</code>.
            </p>
          </div>

          {/* Backup & Actions */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Data Management & Backup
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={exportJSON}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                Export JSON Backup
              </button>

              <button
                onClick={() => syncToCloud()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md transition"
              >
                <Database className="w-4 h-4" />
                Force Cloud Sync
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={resetToDefault}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 text-xs font-medium transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset To Default Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
