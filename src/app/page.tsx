"use client";

import React, { useState } from "react";
import { StoreProvider, useStore } from "@/context/StoreContext";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { OverviewView } from "@/components/OverviewView";
import { TasksView } from "@/components/TasksView";
import { StudyView } from "@/components/StudyView";
import { SkillsView } from "@/components/SkillsView";
import { DeadlinesView } from "@/components/DeadlinesView";
import { HabitsView } from "@/components/HabitsView";
import { TermsView } from "@/components/TermsView";
import { MoneyView } from "@/components/MoneyView";
import { TargetsView } from "@/components/TargetsView";
import { DocsView } from "@/components/DocsView";
import { MonthlyCalendarView } from "@/components/MonthlyCalendarView";
import { ProfileView } from "@/components/ProfileView";
import { NotepadView } from "@/components/NotepadView";
import { QuickAddModal } from "@/components/QuickAddModal";
import { VaultModal } from "@/components/VaultModal";
import { PomodoroModal } from "@/components/PomodoroModal";
import { ToastContainer } from "@/components/ToastContainer";

function AppShell() {
  const { activeView, setActiveView } = useStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-[#09090B] flex flex-row antialiased selection:bg-[#18181B] selection:text-white">
      {/* Sidebar (Fixed/Sticky Left) */}
      <Sidebar onOpenVaultModal={() => setVaultOpen(true)} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar with Search & Shortcuts */}
        <TopBar 
          onQuickAdd={() => setQuickAddOpen(true)} 
          onOpenPomodoro={() => setPomodoroOpen(true)}
        />

        {/* Dynamic Editorial View Container */}
        <main className="flex-1 px-5 py-4 w-full">
          {activeView === "overview" && <OverviewView onNavigate={setActiveView} />}
          {activeView === "terms" && <TermsView />}
          {activeView === "money" && <MoneyView />}
          {activeView === "tasks" && <TasksView />}
          {activeView === "targets" && <TargetsView />}
          {activeView === "study" && <StudyView />}
          {activeView === "skills" && <SkillsView />}
          {activeView === "deadlines" && <DeadlinesView />}
          {activeView === "calendar" && <MonthlyCalendarView />}
          {activeView === "notepad" && <NotepadView />}
          {activeView === "habits" && <HabitsView />}
          {activeView === "profile" && <ProfileView />}
          {activeView === "docs" && <DocsView onNavigate={setActiveView} />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      <VaultModal isOpen={vaultOpen} onClose={() => setVaultOpen(false)} />
      <PomodoroModal isOpen={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-[#71717A]">SYS.INITIALIZING...</div>}>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </React.Suspense>
  );
}
