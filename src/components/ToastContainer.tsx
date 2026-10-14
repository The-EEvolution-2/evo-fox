"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-live="polite"
      aria-label="System notifications"
      className="fixed top-3 sm:top-5 right-3 sm:right-5 left-3 sm:left-auto z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";
        const isError = toast.type === "error";

        // Modern, colorful status config with soft gradients and subtle glows
        const config = isSuccess
          ? {
              border: "border-emerald-200/90",
              bg: "bg-white/95 backdrop-blur-md",
              iconBg: "bg-emerald-500 text-white shadow-xs shadow-emerald-500/20",
              title: "Success",
              titleColor: "text-emerald-950",
              accentBar: "bg-emerald-500",
              Icon: CheckCircle2,
            }
          : isWarning
          ? {
              border: "border-amber-200/90",
              bg: "bg-white/95 backdrop-blur-md",
              iconBg: "bg-amber-500 text-white shadow-xs shadow-amber-500/20",
              title: "Attention",
              titleColor: "text-amber-950",
              accentBar: "bg-amber-500",
              Icon: AlertTriangle,
            }
          : isError
          ? {
              border: "border-rose-200/90",
              bg: "bg-white/95 backdrop-blur-md",
              iconBg: "bg-rose-500 text-white shadow-xs shadow-rose-500/20",
              title: "Error",
              titleColor: "text-rose-950",
              accentBar: "bg-rose-500",
              Icon: AlertCircle,
            }
          : {
              border: "border-blue-200/90",
              bg: "bg-white/95 backdrop-blur-md",
              iconBg: "bg-blue-600 text-white shadow-xs shadow-blue-500/20",
              title: "Notice",
              titleColor: "text-blue-950",
              accentBar: "bg-blue-600",
              Icon: Info,
            };

        const IconComponent = config.Icon;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-3.5 sm:p-4 shadow-lg shadow-slate-900/5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-top-2 sm:slide-in-from-right-3 fade-in`}
          >
            {/* Color accent left bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBar}`} />

            {/* Icon Bubble */}
            <div className={`w-8 h-8 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-4 h-4 stroke-[2.4]" />
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold tracking-tight uppercase ${config.titleColor}`}>
                  {config.title}
                </span>
                <span className="text-[10px] text-slate-400">• Just now</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5 break-words">
                {toast.text}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 p-1 rounded-lg transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
