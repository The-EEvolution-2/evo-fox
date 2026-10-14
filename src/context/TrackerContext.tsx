"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { AppState, DailyTask, DeadlineOrMeeting, PomodoroSession, SkillItem, StudyCourse } from "@/types/tracker";
import { initialAppState } from "@/lib/initialData";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

interface TrackerContextType {
  state: AppState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Study Courses
  addCourse: (course: Omit<StudyCourse, "id" | "updatedAt">) => void;
  updateCourse: (id: string, updates: Partial<StudyCourse>) => void;
  deleteCourse: (id: string) => void;
  // Pomodoro
  logSession: (subject: string, minutes: number) => void;
  // Skills
  addSkill: (skill: Omit<SkillItem, "id" | "updatedAt">) => void;
  updateSkill: (id: string, updates: Partial<SkillItem>) => void;
  toggleMilestone: (skillId: string, milestoneId: string) => void;
  deleteSkill: (id: string) => void;
  // Daily Tasks
  addTask: (task: Omit<DailyTask, "id" | "createdAt" | "streak">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // Deadlines & Meetings
  addEvent: (event: Omit<DeadlineOrMeeting, "id">) => void;
  toggleEventCompleted: (id: string) => void;
  deleteEvent: (id: string) => void;
  // Firebase sync status
  isOnlineFirestore: boolean;
  syncToCloud: () => Promise<void>;
  resetToDefault: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEY = "edu_personal_tracker_state_v1";

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialAppState);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isOnlineFirestore, setIsOnlineFirestore] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Load Initial Data (LocalStorage -> Firestore if configured)
  useEffect(() => {
    let localData: AppState | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        localData = JSON.parse(saved);
        setState(localData as AppState);
      }
    } catch (err) {
      console.error("Failed to load local state:", err);
    }

    if (isFirebaseConfigured && db) {
      setIsOnlineFirestore(true);
      const docRef = doc(db, "tracker_users", "user_primary");
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as AppState;
          setState(remoteData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        } else if (localData) {
          // initialize firestore with local
          setDoc(docRef, localData);
        } else {
          setDoc(docRef, initialAppState);
        }
      }, (err) => {
        console.warn("Firestore snapshot error, continuing with local storage:", err);
        setIsOnlineFirestore(false);
      });

      setIsLoaded(true);
      return () => unsubscribe();
    } else {
      setIsOnlineFirestore(false);
      setIsLoaded(true);
    }
  }, []);

  // Sync state changes to local storage & Firestore
  const saveState = (newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }

    const firestoreDb = db;
    if (isOnlineFirestore && firestoreDb) {
      startTransition(async () => {
        try {
          const docRef = doc(firestoreDb, "tracker_users", "user_primary");
          await setDoc(docRef, newState, { merge: true });
        } catch (e) {
          console.error("Firestore sync error:", e);
        }
      });
    }
  };

  const syncToCloud = async () => {
    const firestoreDb = db;
    if (isFirebaseConfigured && firestoreDb) {
      const docRef = doc(firestoreDb, "tracker_users", "user_primary");
      await setDoc(docRef, state);
      setIsOnlineFirestore(true);
    } else {
      alert("Firebase credentials are not configured in your environment variables yet. Your data is safely saved in your browser local storage!");
    }
  };

  const resetToDefault = () => {
    if (confirm("Reset tracker to default demo data?")) {
      saveState(initialAppState);
    }
  };

  // Study Courses Actions
  const addCourse = (course: Omit<StudyCourse, "id" | "updatedAt">) => {
    const newCourse: StudyCourse = {
      ...course,
      id: "course-" + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    saveState({ ...state, courses: [newCourse, ...state.courses] });
  };

  const updateCourse = (id: string, updates: Partial<StudyCourse>) => {
    const updated = state.courses.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    saveState({ ...state, courses: updated });
  };

  const deleteCourse = (id: string) => {
    saveState({ ...state, courses: state.courses.filter((c) => c.id !== id) });
  };

  // Pomodoro
  const logSession = (subject: string, minutes: number) => {
    const newSession: PomodoroSession = {
      id: "sess-" + Date.now(),
      subject,
      durationMinutes: minutes,
      date: new Date().toISOString().split("T")[0],
      timestamp: Date.now(),
    };

    // Also auto-increment course loggedHours if matching
    const updatedCourses = state.courses.map((c) => {
      if (c.title.toLowerCase().includes(subject.toLowerCase())) {
        return {
          ...c,
          loggedHours: Math.round((c.loggedHours + minutes / 60) * 10) / 10,
        };
      }
      return c;
    });

    saveState({
      ...state,
      courses: updatedCourses,
      sessions: [newSession, ...state.sessions],
    });
  };

  // Skill Actions
  const addSkill = (skill: Omit<SkillItem, "id" | "updatedAt">) => {
    const newSkill: SkillItem = {
      ...skill,
      id: "skill-" + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    saveState({ ...state, skills: [newSkill, ...state.skills] });
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    const updated = state.skills.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    );
    saveState({ ...state, skills: updated });
  };

  const toggleMilestone = (skillId: string, milestoneId: string) => {
    const updated = state.skills.map((s) => {
      if (s.id !== skillId) return s;
      const milestones = s.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      return { ...s, milestones, updatedAt: new Date().toISOString() };
    });
    saveState({ ...state, skills: updated });
  };

  const deleteSkill = (id: string) => {
    saveState({ ...state, skills: state.skills.filter((s) => s.id !== id) });
  };

  // Daily Tasks
  const addTask = (task: Omit<DailyTask, "id" | "createdAt" | "streak">) => {
    const newTask: DailyTask = {
      ...task,
      id: "task-" + Date.now(),
      streak: 0,
      createdAt: new Date().toISOString(),
    };
    saveState({ ...state, tasks: [newTask, ...state.tasks] });
  };

  const toggleTask = (id: string) => {
    const updated = state.tasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        const nextStreak = nextCompleted ? t.streak + 1 : Math.max(0, t.streak - 1);
        return { ...t, completed: nextCompleted, streak: nextStreak };
      }
      return t;
    });
    saveState({ ...state, tasks: updated });
  };

  const deleteTask = (id: string) => {
    saveState({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
  };

  // Deadlines & Meetings
  const addEvent = (event: Omit<DeadlineOrMeeting, "id">) => {
    const newEvent: DeadlineOrMeeting = {
      ...event,
      id: "event-" + Date.now(),
    };
    saveState({ ...state, events: [newEvent, ...state.events] });
  };

  const toggleEventCompleted = (id: string) => {
    const updated = state.events.map((e) =>
      e.id === id ? { ...e, completed: !e.completed } : e
    );
    saveState({ ...state, events: updated });
  };

  const deleteEvent = (id: string) => {
    saveState({ ...state, events: state.events.filter((e) => e.id !== id) });
  };

  return (
    <TrackerContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        addCourse,
        updateCourse,
        deleteCourse,
        logSession,
        addSkill,
        updateSkill,
        toggleMilestone,
        deleteSkill,
        addTask,
        toggleTask,
        deleteTask,
        addEvent,
        toggleEventCompleted,
        deleteEvent,
        isOnlineFirestore,
        syncToCloud,
        resetToDefault,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return context;
}
