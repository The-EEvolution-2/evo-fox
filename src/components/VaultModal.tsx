"use client";

import React, { useRef, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Modal, ConfirmDialog } from "@/components/Modal";
import { Download, Upload, RotateCcw, Database } from "lucide-react";

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose }) => {
  const { exportJSON, importJSON, resetToDefaults, store } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importJSON(content);
        if (success) {
          onClose();
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Local Vault Storage & JSON Management">
        <div className="space-y-5 text-xs">
          <div className="bg-[#FAFAFA] border border-[#E4E4E7] p-3 space-y-1">
            <span className="sub-label">Zero-Cloud Local Privacy</span>
            <p className="text-[#71717A] leading-relaxed">
              All records (tasks, study sessions, skills, deadlines, habits) reside entirely in
              your browser's persistent LocalStorage. No accounts, cookies, or remote telemetries.
            </p>
          </div>

          <div className="space-y-2">
            <span className="sub-label block">Database Snapshot</span>
            <div className="grid grid-cols-3 gap-2 text-mono font-mono text-[11px] text-[#71717A]">
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Terms: <span className="text-[#09090B] font-bold">{store.terms?.length || 0}</span>
              </div>
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Tasks: <span className="text-[#09090B] font-bold">{store.tasks.length}</span>
              </div>
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Study Logs: <span className="text-[#09090B] font-bold">{store.studyLogs.length}</span>
              </div>
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Skills: <span className="text-[#09090B] font-bold">{store.skills.length}</span>
              </div>
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Deadlines: <span className="text-[#09090B] font-bold">{store.deadlines.length}</span>
              </div>
              <div className="border border-[#E4E4E7] p-2 bg-white">
                Habits: <span className="text-[#09090B] font-bold">{store.habits.length}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#E4E4E7]">
            <span className="sub-label block">Data Portability</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportJSON}
                className="h-8 px-3 border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#FAFAFA] flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Vault</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-3 border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#FAFAFA] flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON Backup</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-[#E4E4E7]">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full h-8 border border-[#E4E4E7] text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Vault to Canonical Seed Records</span>
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Local Vault"
        description="Are you sure you want to overwrite current local storage with canonical sample records? Any custom entries will be replaced."
        confirmLabel="Confirm Reset"
        onConfirm={() => {
          resetToDefaults();
          setShowResetConfirm(false);
          onClose();
        }}
        onClose={() => setShowResetConfirm(false)}
      />
    </>
  );
};
