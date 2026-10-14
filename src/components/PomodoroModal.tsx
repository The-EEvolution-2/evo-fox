"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2, 
  VolumeX, 
  Coffee, 
  Brain, 
  Sparkles,
  Settings,
  Flame
} from "lucide-react";

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = "work" | "shortBreak" | "longBreak";

export function PomodoroModal({ isOpen, onClose }: PomodoroTimerProps) {
  // Modes: Work (25m), Short Break (5m), Long Break (15m)
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  
  // Custom durations in minutes
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Beep sound generator using Web Audio API (zero external assets needed)
  const playAlertSound = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Switch modes
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "work") setTimeLeft(workMinutes * 60);
    else if (newMode === "shortBreak") setTimeLeft(shortBreakMinutes * 60);
    else if (newMode === "longBreak") setTimeLeft(longBreakMinutes * 60);
  };

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playAlertSound();
      setIsRunning(false);
      if (mode === "work") {
        const nextCount = sessionsCompleted + 1;
        setSessionsCompleted(nextCount);
        if (nextCount % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("work");
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessionsCompleted, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Fullscreen toggle via Browser Fullscreen API or CSS mode
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullScreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
    }
  };

  // Sync fullscreen change event
  useEffect(() => {
    const onFsChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "work") setTimeLeft(workMinutes * 60);
    else if (mode === "shortBreak") setTimeLeft(shortBreakMinutes * 60);
    else if (mode === "longBreak") setTimeLeft(longBreakMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Calculate total time for progress circle
  const totalDuration = mode === "work" ? workMinutes * 60 : mode === "shortBreak" ? shortBreakMinutes * 60 : longBreakMinutes * 60;
  const progressPct = ((totalDuration - timeLeft) / totalDuration) * 100;

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${
        isFullScreen
          ? "bg-slate-950 text-white"
          : "bg-black/60 backdrop-blur-sm p-4 text-slate-900"
      }`}
    >
      <div
        className={`relative flex flex-col justify-between transition-all duration-200 ${
          isFullScreen
            ? "w-full h-full p-8 md:p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white"
            : "w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8"
        }`}
      >
        {/* Top Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full animate-pulse ${mode === "work" ? "bg-red-500" : "bg-emerald-500"}`} />
            <span className={`font-bold text-sm tracking-wide uppercase ${isFullScreen ? "text-slate-300" : "text-slate-800"}`}>
              {mode === "work" ? "Deep Focus Session" : mode === "shortBreak" ? "Short Recharge" : "Extended Rest"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isFullScreen
                  ? "hover:bg-white/10 text-slate-300"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              title={soundEnabled ? "Mute beep sound" : "Enable beep sound"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                isFullScreen
                  ? "hover:bg-white/10 text-slate-300"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              title="Adjust durations"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullScreen}
              className={`p-2 rounded-lg transition-colors ${
                isFullScreen
                  ? "hover:bg-white/10 text-slate-300"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (isFullScreen && document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                }
                onClose();
              }}
              className={`p-2 rounded-lg transition-colors ${
                isFullScreen
                  ? "hover:bg-white/10 text-slate-300"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              title="Close Timer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center justify-center gap-2 my-6">
          <button
            onClick={() => switchMode("work")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === "work"
                ? "bg-red-500 text-white shadow-md shadow-red-500/25"
                : isFullScreen
                ? "bg-white/10 text-slate-300 hover:bg-white/15"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus ({workMinutes}m)</span>
          </button>

          <button
            onClick={() => switchMode("shortBreak")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === "shortBreak"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : isFullScreen
                ? "bg-white/10 text-slate-300 hover:bg-white/15"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break ({shortBreakMinutes}m)</span>
          </button>

          <button
            onClick={() => switchMode("longBreak")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === "longBreak"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                : isFullScreen
                ? "bg-white/10 text-slate-300 hover:bg-white/15"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Long Break ({longBreakMinutes}m)</span>
          </button>
        </div>

        {/* Settings Drawer (Collapsible) */}
        {showSettings && (
          <div className={`p-4 rounded-xl mb-4 border transition-all text-xs ${
            isFullScreen ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="font-bold mb-2">Timer Configuration (Minutes)</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] mb-1 opacity-75">Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setWorkMinutes(v);
                    if (mode === "work" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className={`w-full h-8 px-2 rounded-lg border font-mono ${
                    isFullScreen ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1 opacity-75">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={shortBreakMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setShortBreakMinutes(v);
                    if (mode === "shortBreak" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className={`w-full h-8 px-2 rounded-lg border font-mono ${
                    isFullScreen ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1 opacity-75">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setLongBreakMinutes(v);
                    if (mode === "longBreak" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className={`w-full h-8 px-2 rounded-lg border font-mono ${
                    isFullScreen ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Giant Timer Display with Progress Accent */}
        <div className="flex flex-col items-center justify-center my-6 md:my-10">
          <div
            className={`font-mono font-bold tracking-tight select-none transition-all ${
              isFullScreen
                ? "text-8xl md:text-9xl lg:text-[14rem] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]"
                : "text-6xl md:text-7xl text-slate-900"
            }`}
          >
            {timeFormatted}
          </div>

          {/* Progress bar */}
          <div className={`w-full max-w-xs md:max-w-md h-2 rounded-full overflow-hidden mt-6 ${
            isFullScreen ? "bg-white/10" : "bg-slate-100"
          }`}>
            <div
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              className={`h-full transition-all duration-300 ${
                mode === "work" ? "bg-red-500" : mode === "shortBreak" ? "bg-emerald-500" : "bg-blue-600"
              }`}
            />
          </div>

          {/* Completed streak counter */}
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>
              {sessionsCompleted} {sessionsCompleted === 1 ? "Session" : "Sessions"} finished today
            </span>
          </div>
        </div>

        {/* Bottom Play/Pause & Reset Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`h-12 md:h-14 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                : mode === "work"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span className="text-sm md:text-base tracking-wide uppercase">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span className="text-sm md:text-base tracking-wide uppercase">Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className={`h-12 md:h-14 px-5 rounded-xl font-semibold flex items-center justify-center transition-colors ${
              isFullScreen
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            title="Reset Countdown"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
