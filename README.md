# Edu Command - Personal Study & Financial Operating System

Edu Command is a single-user dashboard and productivity platform built for scholars, students, and engineers. It combines curriculum tracking, term mastery, financial ledger management (Cash in Hand + Online UPI balances), an interactive monthly schedule calendar, a focus Pomodoro timer, and a rich text study notepad into a unified offline-first web application.

---

## Core System Modules

### 1. Step-by-Step Learning Terms
- Hierarchical topic and subtopic taxonomy for structured self-study (e.g., Web Dev, Distributed Systems).
- Master-detail two-column selector that enables switching topics instantly without vertical scrolling fatigue.
- Status filters for pending and completed terms.
- Bulk JSON import feature to ingest large concept lists at once.

### 2. Money & Pocket Expense Tracker
- Dual payment mode support: track Cash in Hand alongside Online / UPI / Bank balances.
- Real-time aggregate net balance calculation with baseline monthly pocket money allowance targets.
- Categorical outflow analysis (Food & Dining, Books & Courses, Tech & Software, Transport, Entertainment, Personal & Health).
- Dedicated print layout: outputs an itemized financial statement and balance audit formatted specifically for paper and PDF export.

### 3. Monthly Calendar & Agenda Planner
- Full 7-day grid (Sunday through Saturday) with previous/next month navigation and a quick "Today" jump.
- Plots exams, milestones, task deadlines, and logged study sessions directly onto calendar date cells.
- Category filters to isolate deadlines, tasks, or study sessions.
- Day Schedule Inspector side-panel to view all scheduled events for any selected date.

### 4. Focus Pomodoro Studio
- Deep work focus timer supporting 25-minute study intervals, 5-minute short breaks, and 15-minute long rests.
- Fullscreen mode with a distraction-free dark theme.
- Configurable session durations and web audio completion chime.
- Daily completed session counter.

### 5. Rich Notepad & Interactive Checklists
- Formatted study documentation with Bold, Italic, Underline, colored text highlights, and list structures.
- Interactive checklist mode with progress tracking and strike-through completion.
- Card color tagging across multiple soft pastel palettes.
- Pin-to-top feature for critical notes.
- Dedicated Save button with local storage persistence.

### 6. Study Curriculum & Task Operations
- Subject, subtopic, and specific proof/theorem logging.
- Priority task queue with backlog and completion statuses.
- Short-term and long-term goal milestone trackers.

### 7. Scholar Profile & Identity
- Scholar profile displaying name, institution, major, academic year, and north-star objectives.
- Summary metrics tracking terms learned, total study hours, completed tasks, and monthly budget.
- Editable profile with offline local vault storage.

---

## Technical Stack & Architecture

- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript (strict type safety)
- Styling: Tailwind CSS with customized design tokens, subtle rounded corners, and a low-opacity background grid texture
- State Management: React Context (`StoreContext`) backed by HTML5 LocalStorage for 100% offline persistence
- Icons: Lucide React
- Print Support: Dedicated CSS `@media print` rules generating custom ledger audits without application chrome

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
