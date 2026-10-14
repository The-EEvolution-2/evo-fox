export interface StudyCourse {
  id: string;
  title: string;
  category: string;
  totalModules: number;
  completedModules: number;
  targetHours: number;
  loggedHours: number;
  color: string;
  notes: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  subject: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string; // e.g., 'Coding', 'Languages', 'Design', 'Soft Skills'
  level: number; // 1 to 5
  targetLevel: number;
  hoursSpent: number;
  projectsCount: number;
  milestones: { id: string; title: string; completed: boolean }[];
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  title: string;
  category: 'routine' | 'study' | 'work' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  recurring: boolean;
  streak: number;
  dueDate?: string;
  createdAt: string;
}

export interface DeadlineOrMeeting {
  id: string;
  title: string;
  type: 'deadline' | 'meeting' | 'exam' | 'submission';
  dateTime: string; // ISO string
  linkOrLocation?: string;
  notes?: string;
  isImportant: boolean;
  completed: boolean;
}

export interface AppState {
  courses: StudyCourse[];
  sessions: PomodoroSession[];
  skills: SkillItem[];
  tasks: DailyTask[];
  events: DeadlineOrMeeting[];
  userName: string;
}
