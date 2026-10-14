"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  BookMarked, 
  Wallet, 
  CheckSquare, 
  SlidersHorizontal, 
  Sparkles, 
  CalendarClock, 
  Flame, 
  Database,
  Search,
  Plus,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  CheckCircle2,
  Layers,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Bookmark,
  Compass,
  Command,
  Info,
  Check
} from "lucide-react";

export const DocsView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>("intro");

  const navSections = [
    { id: "intro", title: "Architecture & Philosophy", icon: Compass },
    { id: "shortcuts", title: "Command Palette & Fast Shortcuts", icon: Command },
    { id: "terms", title: "Learning Terms & Bulk Import", icon: BookMarked },
    { id: "study", title: "Subject Curriculum & Proofs", icon: BookOpen },
    { id: "targets", title: "Short & Long-Term Targets", icon: SlidersHorizontal },
    { id: "money", title: "Money & Pocket Budgeting", icon: Wallet },
    { id: "operations", title: "Daily Tasks, Skills & Sync", icon: CheckSquare },
    { id: "vault", title: "Offline Storage & JSON Vault", icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Editorial Top Navigation Header */}
      <header className="border-b border-[#D1D5DB] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs">
            <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-2 py-0.5 font-bold">
              DOCS v2.4
            </span>
            <span className="text-[#6B7280]">/</span>
            <span className="text-[#374151] font-semibold">User Manual & Specifications</span>
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            System Documentation
          </h1>
          <p className="text-sm text-[#4B5563] mt-1 max-w-2xl leading-relaxed">
            Reference manual, operational flows, and technical design tenets for the personal productivity command center.
          </p>
        </div>

        <button
          onClick={() => onNavigate("overview")}
          className="h-9 px-4 bg-black text-white text-xs font-bold hover:bg-[#1F2937] flex items-center gap-2 transition-colors self-start md:self-auto shrink-0"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </button>
      </header>

      {/* Modern Two-Column Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents (No Clunky Boxes, Clean Clean Nav Links) */}
        <nav className="lg:col-span-3 sticky top-20 space-y-1 text-sm border-l-2 border-[#E5E7EB] pl-3 py-1 font-medium">
          <div className="font-mono text-xs uppercase tracking-wider font-bold text-[#6B7280] mb-3 px-2">
            Table of Contents
          </div>
          {navSections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 px-2.5 py-1.5 transition-colors ${
                  isActive
                    ? "text-[#2563EB] font-bold border-l-2 border-[#2563EB] -ml-[14px] bg-[#EFF6FF]"
                    : "text-[#4B5563] hover:text-black hover:bg-[#F9FAFB]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#6B7280] group-hover:text-black"}`} />
                <span className="truncate">{item.title}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Main Editorial Document Content (Clean Typography, No Heavy Nested Boxes) */}
        <article className="lg:col-span-9 space-y-14 text-base leading-relaxed text-[#1F2937]">
          {/* SECTION 1: Architecture & Philosophy */}
          <section id="intro" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                01. Foundations
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Architecture & Design Tenets
            </h2>
            <p>
              <strong>EDU Command</strong> is an editorial productivity environment inspired by high-density internal tools like Linear, Notion, and Swiss modernist typography. It is engineered with three core principles:
            </p>

            {/* List with colorful accent markers instead of boxed containers */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 shrink-0 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xs mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-black font-semibold">100% Offline Local Storage</strong>
                  <p className="text-sm text-[#4B5563]">
                    Your data never touches third-party cloud servers. Every record is committed directly to browser <code className="text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 border border-[#BFDBFE] font-mono text-xs">localStorage</code>, giving instant zero-latency loads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 shrink-0 bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] flex items-center justify-center font-bold text-xs mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-black font-semibold">Zero Clutter Modal Input Pattern</strong>
                  <p className="text-sm text-[#4B5563]">
                    Input forms are never embedded inline on dashboard surfaces. Dedicated modals open on demand, keeping overview tables clean, readable, and focused.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 shrink-0 bg-[#FAF5FF] border border-[#E9D5FF] text-[#9333EA] flex items-center justify-center font-bold text-xs mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-black font-semibold">Vibrant Swiss Accent Palette with High Contrast</strong>
                  <p className="text-sm text-[#4B5563]">
                    High-contrast pitch black and charcoal text are paired with curated color accents (Blue, Emerald, Purple, Amber, and Rose) for effortless visual hierarchy and zero eye strain.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Command Palette & Fast Shortcuts */}
          <section id="shortcuts" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#059669] uppercase tracking-wider">
                02. Keyboard Navigation
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Command Palette & Fast Shortcuts
            </h2>
            <p>
              Navigate and register records without touching your mouse. The global shortcut handler listens across all screens:
            </p>

            {/* Clean Documentation Table */}
            <div className="border border-[#D1D5DB] overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#D1D5DB] font-mono text-xs uppercase text-black font-bold">
                    <th className="p-3 w-32">Shortcut</th>
                    <th className="p-3 w-48">Action</th>
                    <th className="p-3">Behavior</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-sm">
                  <tr>
                    <td className="p-3 font-mono">
                      <kbd className="px-2.5 py-1 bg-[#F9FAFB] border border-[#D1D5DB] font-bold text-black text-xs shadow-xs">
                        N
                      </kbd>
                    </td>
                    <td className="p-3 font-bold text-black">Universal Quick Add</td>
                    <td className="p-3 text-[#4B5563]">Opens the global modal to register a Term, Target, Expense, Task, or Study session.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">
                      <kbd className="px-2.5 py-1 bg-[#F9FAFB] border border-[#D1D5DB] font-bold text-[#2563EB] text-xs shadow-xs">
                        /
                      </kbd>
                    </td>
                    <td className="p-3 font-bold text-black">Focus Search</td>
                    <td className="p-3 text-[#4B5563]">Highlights the header search input to filter active records across all views.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">
                      <kbd className="px-2.5 py-1 bg-[#F9FAFB] border border-[#D1D5DB] font-bold text-black text-xs shadow-xs">
                        Esc
                      </kbd>
                    </td>
                    <td className="p-3 font-bold text-black">Dismiss Dialog</td>
                    <td className="p-3 text-[#4B5563]">Closes active modal dialog or resets search query.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: Learning Terms & Bulk Import */}
          <section id="terms" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                03. Knowledge Acquisition
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Learning Terms: Two-Column Master-Detail Layout
            </h2>
            <p>
              When learning dozens of technical concepts, standard single-scroll pages cause severe fatigue. The Learning Terms module separates topics into a <strong>Master-Detail architecture</strong>:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-[#EFF6FF] border-l-4 border-l-[#2563EB] border border-[#BFDBFE]">
                <strong className="text-[#1E3A8A] font-bold block mb-1">
                  Topic Selector (Left Pane) vs. Terms List (Right Pane)
                </strong>
                <p className="text-sm text-[#1E40AF] leading-relaxed">
                  Click any topic on the left (e.g. <em>Web Dev</em> or <em>Distributed Systems</em>) to instantly load its subtopics and terms on the right. You never need to scroll past hundreds of items to switch domains.
                </p>
              </div>

              <h3 className="text-lg font-bold text-black pt-2">Bulk JSON Ingestion</h3>
              <p className="text-sm text-[#4B5563]">
                Quickly import entire syllabi or flashcard decks using the <strong>"Bulk Import (JSON)"</strong> modal:
              </p>

              {/* Code Example Block */}
              <div className="border border-[#D1D5DB] bg-[#F9FAFB] p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7EB] text-[#2563EB] font-bold uppercase">
                  <span>Supported JSON Format</span>
                  <span>terms_import.json</span>
                </div>
                <pre className="text-black overflow-x-auto leading-relaxed">
{`[
  {
    "term": "RESTful API Idempotency",
    "topic": "Web Dev",
    "subtopic": "Backend",
    "notes": "GET, PUT, and DELETE are idempotent; POST creates resources."
  },
  {
    "term": "OAuth2 PKCE Flow",
    "topic": "Web Dev",
    "subtopic": "Authentication",
    "notes": "Mitigates code interception attacks in public clients."
  }
]`}
                </pre>
              </div>
            </div>
          </section>

          {/* SECTION 4: Subject Curriculum & Proofs */}
          <section id="study" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#9333EA] uppercase tracking-wider">
                04. Academic Rigor
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Study Curriculum: Subjects, Subtopics & Proofs
            </h2>
            <p>
              Dedicated study tracking enforces a 3-tier academic hierarchy to capture rigorous technical work:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="border border-[#BFDBFE] bg-[#EFF6FF] p-4 space-y-1">
                <span className="font-mono text-xs font-bold text-[#2563EB] uppercase">Tier 1</span>
                <div className="font-bold text-black">Subject (Main)</div>
                <p className="text-xs text-[#1E40AF]">The overarching field (e.g. Distributed Systems, Mathematics).</p>
              </div>

              <div className="border border-[#E9D5FF] bg-[#FAF5FF] p-4 space-y-1">
                <span className="font-mono text-xs font-bold text-[#9333EA] uppercase">Tier 2</span>
                <div className="font-bold text-black">Subtopic</div>
                <p className="text-xs text-[#581C87]">The core domain (e.g. Consensus Algorithms, Linear Algebra).</p>
              </div>

              <div className="border border-[#A7F3D0] bg-[#ECFDF5] p-4 space-y-1">
                <span className="font-mono text-xs font-bold text-[#059669] uppercase">Tier 3</span>
                <div className="font-bold text-black">Question / Proof</div>
                <p className="text-xs text-[#065F46]">The formal proof statement, theorem formula, or code example.</p>
              </div>
            </div>

            <p className="text-sm text-[#4B5563] pt-2">
              Clicking any table row expands the <strong>Proof & Theorem Drawer</strong>, revealing mathematical proofs and notes formatted in readable monospace without cluttering the main table.
            </p>
          </section>

          {/* SECTION 5: Short & Long-Term Targets */}
          <section id="targets" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#D97706] uppercase tracking-wider">
                05. Goal Management
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Short & Long-Term Targets
            </h2>
            <p>
              Balance immediate weekly sprints with long-range multi-month milestones:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 border border-[#BFDBFE] bg-[#EFF6FF] text-[#1E3A8A] font-mono text-xs font-bold uppercase shrink-0 mt-0.5">
                  Short-Term (1–4 WEEKS)
                </span>
                <p className="text-sm text-[#4B5563]">
                  Tactical sprints (e.g. coding 40 hours of Rust, finishing a course chapter). Fast-tap progress buttons (25%, 50%, 75%, 100%) allow instantaneous milestone updates.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 border border-[#E9D5FF] bg-[#FAF5FF] text-[#581C87] font-mono text-xs font-bold uppercase shrink-0 mt-0.5">
                  Long-Term (1–12 MONTHS)
                </span>
                <p className="text-sm text-[#4B5563]">
                  Strategic goals (e.g. publishing research papers, mastering core engineering competencies, building financial surpluses).
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: Money & Pocket Budgeting */}
          <section id="money" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#059669] uppercase tracking-wider">
                06. Financial Telemetry
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Money & Pocket Budgeting
            </h2>
            <p>
              Keep your finances in check with dedicated tracking of monthly pocket money allowances and categorized expenditures:
            </p>

            <ul className="list-disc pl-5 text-sm text-[#4B5563] space-y-1.5">
              <li><strong>Target Baseline</strong>: Set your monthly pocket money allowance (editable via inline modal).</li>
              <li><strong>Categorized Purpose Breakdown</strong>: Automatically calculates percentages spent on <em>Food & Dining</em>, <em>Books & Courses</em>, <em>Tech & Software</em>, and <em>Transport</em>.</li>
              <li><strong>Real-time Surplus Tracking</strong>: Highlights preserved balance in emerald green to encourage savings.</li>
            </ul>
          </section>

          {/* SECTION 7: Daily Tasks, Skills & Sync */}
          <section id="operations" className="scroll-mt-24 space-y-4 border-b border-[#E5E7EB] pb-10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                07. Operations
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Daily Tasks, Skills & Sync
            </h2>
            <div className="space-y-3 text-sm text-[#4B5563]">
              <p>
                <strong>Task Operations</strong>: Categorize tasks by domain (<em>Study</em>, <em>Engineering</em>, <em>Career</em>, <em>Operations</em>) with priority filters and one-click completion toggles.
              </p>
              <p>
                <strong>Skill Competencies</strong>: Visual 5-tier level stepper with dedicated practice hour logs (+1h and +4h fast increments) to master technical domains.
              </p>
              <p>
                <strong>Deadlines & Sync Calendar</strong>: Chronological milestone tracker for exams, submissions, and sync meetings with direct location/meeting links.
              </p>
            </div>
          </section>

          {/* SECTION 8: Offline Storage & JSON Vault */}
          <section id="vault" className="scroll-mt-24 space-y-4 pb-12">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">
                08. Privacy & Data Safety
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Offline Storage & JSON Backup
            </h2>
            <p>
              Your data is completely private and persists in your browser. Use the <strong>Vault & JSON Backup</strong> option in the sidebar footer to:
            </p>

            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="p-3 border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-between">
                <span className="font-bold text-black">Export JSON Backup</span>
                <span className="text-[#059669]">Downloads complete .json snapshot</span>
              </div>
              <div className="p-3 border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-between">
                <span className="font-bold text-black">Import JSON Backup</span>
                <span className="text-[#2563EB]">Restores records across browsers in 1s</span>
              </div>
              <div className="p-3 border border-[#D1D5DB] bg-[#F9FAFB] flex items-center justify-between">
                <span className="font-bold text-black">Reset to Canonical Defaults</span>
                <span className="text-[#D97706]">Restores clean starter dataset</span>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};
