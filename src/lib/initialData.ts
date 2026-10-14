import { AppState, StudyCourse, SkillItem, DailyTask, DeadlineOrMeeting } from "@/types/tracker";

export const initialCourses: StudyCourse[] = [
  {
    id: "course-1",
    title: "Full-Stack System Architecture & Next.js 15",
    category: "Computer Science",
    totalModules: 12,
    completedModules: 8,
    targetHours: 40,
    loggedHours: 26.5,
    color: "#6366f1",
    notes: "Focusing on Server Actions, Turbopack, and edge runtime scalability.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-2",
    title: "Cloud Databases & Firestore Mastery",
    category: "Backend & Data",
    totalModules: 8,
    completedModules: 5,
    targetHours: 25,
    loggedHours: 17,
    color: "#06b6d4",
    notes: "Security rules, real-time listeners, and atomic batch transactions.",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-3",
    title: "Algorithmic Thinking & Competitive LeetCode",
    category: "Data Structures",
    totalModules: 20,
    completedModules: 14,
    targetHours: 50,
    loggedHours: 38,
    color: "#ec4899",
    notes: "Graph BFS/DFS traversal and dynamic programming memoization.",
    updatedAt: new Date().toISOString(),
  }
];

export const initialSkills: SkillItem[] = [
  {
    id: "skill-1",
    name: "TypeScript & React Modern Patterns",
    category: "Engineering",
    level: 4,
    targetLevel: 5,
    hoursSpent: 120,
    projectsCount: 6,
    milestones: [
      { id: "m1", title: "Master Generics & Utility types", completed: true },
      { id: "m2", title: "Design Custom Hook Libraries", completed: true },
      { id: "m3", title: "Contribute to OSS Component Library", completed: false },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "skill-2",
    name: "Database Design & NoSQL Scaling",
    category: "Architecture",
    level: 3,
    targetLevel: 5,
    hoursSpent: 75,
    projectsCount: 4,
    milestones: [
      { id: "m4", title: "Firestore Indexes & Composite Queries", completed: true },
      { id: "m5", title: "Data Caching & Invalidation strategies", completed: false },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "skill-3",
    name: "System Design & Distributed Systems",
    category: "High-Level Architecture",
    level: 3,
    targetLevel: 4,
    hoursSpent: 55,
    projectsCount: 2,
    milestones: [
      { id: "m6", title: "Read Designing Data-Intensive Applications", completed: true },
      { id: "m7", title: "Design a high-throughput message broker", completed: false },
    ],
    updatedAt: new Date().toISOString(),
  }
];

export const initialTasks: DailyTask[] = [
  {
    id: "task-1",
    title: "Morning Routine: 20 mins Tech Article Review & Coffee",
    category: "routine",
    priority: "medium",
    completed: true,
    recurring: true,
    streak: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Solve 2 LeetCode Medium Problems (Graphs / DP)",
    category: "study",
    priority: "high",
    completed: false,
    recurring: true,
    streak: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Complete 1 hour focused Pomodoro for Skill roadmap",
    category: "study",
    priority: "urgent",
    completed: false,
    recurring: true,
    streak: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Organize project commits and sync notes in dashboard",
    category: "personal",
    priority: "low",
    completed: false,
    recurring: false,
    streak: 0,
    createdAt: new Date().toISOString(),
  }
];

export const initialEvents: DeadlineOrMeeting[] = [
  {
    id: "event-1",
    title: "Tech Architecture & Progress Review Meeting",
    type: "meeting",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), // tomorrow
    linkOrLocation: "Google Meet (meet.google.com/xyz-demo)",
    notes: "Present progress on skill roadmap and semester targets.",
    isImportant: true,
    completed: false,
  },
  {
    id: "event-2",
    title: "Full-Stack Project Milestone Alpha Submission",
    type: "deadline",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // in 3 days
    linkOrLocation: "GitHub Repository release v0.9",
    notes: "Ensure all unit tests pass and documentation is uploaded.",
    isImportant: true,
    completed: false,
  },
  {
    id: "event-3",
    title: "Advanced Data Systems Certification Exam",
    type: "exam",
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 168).toISOString(), // in 7 days
    linkOrLocation: "Online Proctoring Portal",
    notes: "Bring ID, review chapters 4 through 9 beforehand.",
    isImportant: true,
    completed: false,
  }
];

export const initialAppState: AppState = {
  courses: initialCourses,
  sessions: [
    {
      id: "sess-1",
      subject: "Full-Stack System Architecture",
      durationMinutes: 45,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now() - 3600000 * 4,
    },
    {
      id: "sess-2",
      subject: "Algorithmic Thinking",
      durationMinutes: 50,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now() - 3600000 * 2,
    }
  ],
  skills: initialSkills,
  tasks: initialTasks,
  events: initialEvents,
  userName: "Achiever",
};
