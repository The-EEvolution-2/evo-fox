"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white border border-[#18181B] p-3 flex items-start gap-2.5 shadow-none transition-all duration-150"
          >
            <div className="shrink-0 mt-0.5 text-[#18181B]">
              {toast.type === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {toast.type === "warning" && <AlertTriangle className="w-3.5 h-3.5" />}
              {toast.type === "error" && <AlertCircle className="w-3.5 h-3.5" />}
              {toast.type === "info" && <Info className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 text-xs text-[#09090B] font-medium leading-tight">
              {toast.text}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#71717A] hover:text-[#09090B] p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
