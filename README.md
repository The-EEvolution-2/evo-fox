# EvoFox - Personal Academic & Financial Operating System

EvoFox is an offline-first productivity and academic command center designed for scholars, researchers, and engineers. It combines curriculum tracking, term roadmaps, financial ledger telemetry (Cash + Online accounts and loan repayment tracking), an interactive monthly schedule planner, a focus Pomodoro studio, and a rich study notepad into a synchronized web and PWA application.

---

## Core System Modules

### 1. Step-by-Step Learning Terms
- Hierarchical topic and subtopic taxonomy for structured self-study (e.g., Web Dev, Distributed Systems).
- Master-detail two-column selector that enables switching topics instantly without vertical scrolling fatigue.
- Status filters for pending and completed terms.
- Bulk JSON import feature to ingest large concept lists at once.

### 2. Money Management & Loan Repayments
- Dual payment mode support: track physical **Cash in Hand** alongside **Online / UPI / Bank** balances.
- **Borrowed Loan & Debt Tracking**: Flag loans with lender details (who the loan was taken from) and target repayment dates.
- **Repayment Status Toggles**: 1-click repayment workflow directly in the ledger with visual badges (`LOAN / REPAY DUE` vs `REPAID`).
- **Dedicated Loans Summary & Filter**: Live overview of total pending repayment with quick-filtering for outstanding debts.
- Categorical outflow analysis (Food & Dining, Books & Courses, Tech & Software, Transport, Entertainment, Personal & Health).
- Dedicated print layout: outputs an itemized financial statement and balance audit formatted specifically for paper and PDF export.

### 3. Skill Competency Matrix
- Visual 5-tier level stepper (Novice to Expert) to gauge technical competency.
- Rapid practice hour logging (+1h and +4h blocks) with allocation progress bars.
- Empty-state guidance with direct creation modal.

### 4. Monthly Calendar & Agenda Planner
- Full 7-day grid (Sunday through Saturday) with previous/next month navigation and a quick "Today" jump.
- Plots exams, milestones, task deadlines, and logged study sessions directly onto calendar date cells.
- Category filters to isolate deadlines, tasks, or study sessions.
- Day Schedule Inspector side-panel to view all scheduled events for any selected date.

### 5. Focus Pomodoro Studio
- Deep work focus timer supporting 25-minute study intervals, 5-minute short breaks, and 15-minute long rests.
- Fullscreen mode with a distraction-free dark theme.
- Configurable session durations and web audio completion chime.
- Daily completed session counter.

### 6. Rich Notepad & Interactive Checklists
- Formatted study documentation with Bold, Italic, Underline, colored text highlights, and list structures.
- Interactive checklist mode with progress tracking and strike-through completion.
- Card color tagging across multiple soft pastel palettes.
- Pin-to-top feature for critical notes.
- Dedicated Save button with local storage persistence.

### 7. Study Curriculum & Task Operations
- Subject, subtopic, and specific proof/theorem logging.
- Priority task queue with backlog and completion statuses.
- Short-term and long-term goal milestone trackers.

### 8. Scholar Profile, Cloud Sync & Security
- Scholar profile displaying name, institution, major, academic year, and north-star objectives.
- Multi-user authentication supporting email/password sign-in and guest mode.
- Real-time cloud synchronization powered by Google Firebase Firestore alongside local cache for instant offline access.
- JSON data export/import for complete manual data backup and restore.

---

## Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict type safety)
- **Styling**: Tailwind CSS with customized design tokens, clean typography, and responsive mobile-first layouts
- **Database & Auth**: Firebase Authentication & Cloud Firestore (scoped to user workspace)
- **Offline / Local State**: React Context (`StoreContext`) backed by HTML5 LocalStorage + Service Worker PWA
- **Icons**: Lucide React
- **Print Support**: Dedicated CSS `@media print` rules generating custom ledger audits without application chrome

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build
```bash
npm run build
npm start
```
