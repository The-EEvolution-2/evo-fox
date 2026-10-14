export interface TaskItem {
  id: string;
  title: string;
  module: "Study" | "Engineering" | "Career" | "Operations";
  priority: "High" | "Medium" | "Low";
  status: "Backlog" | "In Progress" | "Completed";
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface StudyLog {
  id: string;
  course: string; // Subject (main), e.g. "Mathematics", "Distributed Systems", "Computer Architecture"
  subtopic: string; // Subtopic, e.g. "Linear Algebra", "Raft Consensus", "Pipelining"
  topic: string; // Specific Question / Proof / Example / Concept name
  proofOrExample?: string; // Detailed proof, theorem statement, code example, or specific question
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  notes: string;
  color?: string; // Accent color for visual distinction
}

export interface TargetGoal {
  id: string;
  title: string;
  horizon: "Short-term" | "Long-term"; // 2. Long term vs short term targets
  category: "Study" | "Skill" | "Career" | "Financial" | "General";
  targetDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100%
  status: "In Progress" | "Achieved" | "On Hold";
  color?: string; // Visual accent badge
  notes?: string;
}

export interface SkillItem {
  id: string;
  skillName: string;
  domain: string;
  proficiencyLevel: number; // 1-5
  targetHours: number;
  completedHours: number;
  lastPracticed: string;
  color?: string;
}

export interface MeetingDeadline {
  id: string;
  title: string;
  kind: "Deadline" | "Meeting" | "Milestone" | "Exam";
  dueDateTime: string; // ISO
  locationOrUrl: string;
  status: "Scheduled" | "Completed" | "Pending Review";
}

export interface DailyHabit {
  id: string;
  name: string;
  cadence: "Daily" | "Weekday";
  streakDays: number;
  completedToday: boolean;
  history: Record<string, boolean>; // 'YYYY-MM-DD': boolean
}

export interface LearningTerm {
  id: string;
  term: string;
  topic: string; // main name e.g. "Web Dev", "Distributed Systems"
  subtopic: string; // sub topic e.g. "Backend", "Authentication", "Version Control"
  learned: boolean;
  notes?: string;
  orderIndex: number;
}

export interface MoneyRecord {
  id: string;
  title: string;
  amount: number;
  type: "Expense" | "Income"; // Income = pocket money received, Expense = spent
  paymentMode: "Cash" | "Online"; // Cash vs Online payment tracking
  purpose: "Food & Dining" | "Books & Courses" | "Tech & Software" | "Transport" | "Entertainment" | "Personal & Health" | "Other";
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  institution: string;
  semesterOrYear: string;
  major: string;
  bio: string;
  avatarUrl?: string;
  primaryGoal: string;
}

export interface CustomNote {
  id: string;
  title: string;
  type: "note" | "checklist";
  content: string; // HTML formatted or text
  checklistItems?: Array<{ id: string; text: string; done: boolean }>;
  color: string; // hex or color class
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppStore {
  tasks: TaskItem[];
  studyLogs: StudyLog[];
  targets: TargetGoal[]; // Long term and short term goals
  skills: SkillItem[];
  deadlines: MeetingDeadline[];
  habits: DailyHabit[];
  terms: LearningTerm[];
  moneyRecords: MoneyRecord[];
  monthlyAllowance: number; // Monthly pocket money target/baseline
  userProfile?: UserProfile;
  notes?: CustomNote[];
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  text: string;
}
