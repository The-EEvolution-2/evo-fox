"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  AppStore, 
  TaskItem, 
  StudyLog, 
  TargetGoal, 
  SkillItem, 
  MeetingDeadline, 
  DailyHabit, 
  LearningTerm, 
  MoneyRecord, 
  ToastMessage, 
  UserProfile, 
  CustomNote 
} from "@/types/app";
import { initialStore } from "@/lib/seedData";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface StoreContextType {
  store: AppStore;
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isFirestoreSyncing: boolean;
  // Tasks
  addTask: (task: Omit<TaskItem, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  // Study
  addStudyLog: (log: Omit<StudyLog, "id">) => void;
  deleteStudyLog: (id: string) => void;
  // Targets (Short-term & Long-term)
  addTarget: (target: Omit<TargetGoal, "id">) => void;
  updateTarget: (id: string, updates: Partial<TargetGoal>) => void;
  deleteTarget: (id: string) => void;
  // Skills
  addSkill: (skill: Omit<SkillItem, "id">) => void;
  updateSkill: (id: string, updates: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  // Deadlines
  addDeadline: (d: Omit<MeetingDeadline, "id">) => void;
  updateDeadline: (id: string, updates: Partial<MeetingDeadline>) => void;
  deleteDeadline: (id: string) => void;
  // Habits
  toggleHabit: (id: string) => void;
  addHabit: (name: string, cadence: "Daily" | "Weekday") => void;
  deleteHabit: (id: string) => void;
  // Terms
  toggleTerm: (id: string) => void;
  addTerm: (term: Omit<LearningTerm, "id" | "orderIndex">) => void;
  updateTerm: (id: string, updates: Partial<LearningTerm>) => void;
  deleteTerm: (id: string) => void;
  reorderTerms: (terms: LearningTerm[]) => void;
  importTermsJSON: (rawTerms: Array<{ term: string; topic: string; subtopic: string; notes?: string }>) => number;
  // Money Management
  addMoneyRecord: (record: Omit<MoneyRecord, "id">) => void;
  updateMoneyRecord: (id: string, updates: Partial<MoneyRecord>) => void;
  deleteMoneyRecord: (id: string) => void;
  updateMonthlyAllowance: (amount: number) => void;
  // Profile
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  // Notes / Notepad
  addNote: (note: Omit<CustomNote, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<CustomNote>, notify?: boolean) => void;
  deleteNote: (id: string) => void;
  // System
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  // Toasts
  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
}

const STORAGE_PREFIX = "evofox_store_";
const SIDEBAR_PREF_KEY = "evofox_sidebar_state_v1";
const FIRESTORE_COLLECTION = "evofox_workspaces";

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [store, setStore] = useState<AppStore>(initialStore);
  const [activeView, setActiveView] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState<boolean>(false);

  const userDocId = user ? user.uid : null;
  const storageKey = user ? `${STORAGE_PREFIX}${user.uid}` : "evofox_store_guest";

  // Sync with Firestore (realtime CRUD) + LocalStorage cache scoped to authenticated user
  useEffect(() => {
    if (!userDocId) {
      setStore(initialStore);
      return;
    }

    // 1. Initial cached load from localStorage for fast first-render
    try {
      const savedStore = localStorage.getItem(storageKey);
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        setStore((prev) => ({
          ...prev,
          ...parsed,
          tasks: parsed.tasks || [],
          studyLogs: parsed.studyLogs || [],
          targets: parsed.targets || [],
          skills: parsed.skills || [],
          deadlines: parsed.deadlines || [],
          habits: parsed.habits || [],
          terms: parsed.terms || [],
          moneyRecords: parsed.moneyRecords || [],
          monthlyAllowance: parsed.monthlyAllowance ?? 0,
          notes: parsed.notes || [],
          userProfile: {
            ...prev.userProfile,
            ...(parsed.userProfile || {}),
            email: user?.email || parsed.userProfile?.email || prev.userProfile?.email || "",
            name: user?.displayName || user?.email?.split("@")[0] || parsed.userProfile?.name || prev.userProfile?.name || "Scholar",
            role: parsed.userProfile?.role || prev.userProfile?.role || "Learner",
            institution: parsed.userProfile?.institution || prev.userProfile?.institution || "",
            semesterOrYear: parsed.userProfile?.semesterOrYear || prev.userProfile?.semesterOrYear || "",
            major: parsed.userProfile?.major || prev.userProfile?.major || "",
            bio: parsed.userProfile?.bio || prev.userProfile?.bio || "",
            primaryGoal: parsed.userProfile?.primaryGoal || prev.userProfile?.primaryGoal || "",
          },
        }));
      }

      const savedSidebar = localStorage.getItem(SIDEBAR_PREF_KEY);
      if (savedSidebar !== null) {
        setSidebarCollapsedState(savedSidebar === "true");
      }
    } catch (err) {
      console.error("Local storage initial load failed:", err);
    }

    // 2. Real-time Firestore synchronization for this specific user's document
    if (isFirebaseConfigured && db) {
      setIsFirestoreSyncing(true);
      const docRef = doc(db, FIRESTORE_COLLECTION, userDocId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as Partial<AppStore>;
            const cleaned: AppStore = {
              tasks: data.tasks || [],
              studyLogs: data.studyLogs || [],
              targets: data.targets || [],
              skills: data.skills || [],
              deadlines: data.deadlines || [],
              habits: data.habits || [],
              terms: data.terms || [],
              moneyRecords: data.moneyRecords || [],
              monthlyAllowance: data.monthlyAllowance ?? 0,
              userProfile: {
                name: user?.displayName || user?.email?.split("@")[0] || data.userProfile?.name || initialStore.userProfile?.name || "Scholar",
                email: user?.email || data.userProfile?.email || initialStore.userProfile?.email || "",
                role: data.userProfile?.role || initialStore.userProfile?.role || "Learner",
                institution: data.userProfile?.institution || initialStore.userProfile?.institution || "",
                semesterOrYear: data.userProfile?.semesterOrYear || initialStore.userProfile?.semesterOrYear || "",
                major: data.userProfile?.major || initialStore.userProfile?.major || "",
                bio: data.userProfile?.bio || initialStore.userProfile?.bio || "",
                primaryGoal: data.userProfile?.primaryGoal || initialStore.userProfile?.primaryGoal || "",
                ...(data.userProfile?.avatarUrl ? { avatarUrl: data.userProfile.avatarUrl } : {}),
              },
              notes: data.notes || [],
            };
            setStore(cleaned);
            try {
              localStorage.setItem(storageKey, JSON.stringify(cleaned));
            } catch (e) {
              console.error("Failed to cache remote store locally:", e);
            }
          } else {
            // First time initialization in Firestore for this user
            const newDoc: AppStore = {
              ...initialStore,
              userProfile: {
                name: user?.displayName || user?.email?.split("@")[0] || initialStore.userProfile?.name || "Scholar",
                email: user?.email || initialStore.userProfile?.email || "",
                role: initialStore.userProfile?.role || "Learner",
                institution: initialStore.userProfile?.institution || "",
                semesterOrYear: initialStore.userProfile?.semesterOrYear || "",
                major: initialStore.userProfile?.major || "",
                bio: initialStore.userProfile?.bio || "",
                primaryGoal: initialStore.userProfile?.primaryGoal || "",
              },
            };
            setDoc(docRef, newDoc).catch((e) =>
              console.error("Failed to seed user Firestore doc:", e)
            );
          }
          setIsFirestoreSyncing(false);
        },
        (err) => {
          console.warn("Firestore listener warning:", err);
          setIsFirestoreSyncing(false);
        }
      );

      return () => unsubscribe();
    }
  }, [userDocId, storageKey, user]);

  const saveStore = (newStore: AppStore) => {
    // 1. Update React state immediately for instant UI response
    setStore(newStore);

    // 2. Persist to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(newStore));
    } catch (err) {
      console.error("Local storage persist failed:", err);
    }

    // 3. Persist to Firestore
    if (isFirebaseConfigured && db && userDocId) {
      const docRef = doc(db, FIRESTORE_COLLECTION, userDocId);
      const sanitized = JSON.parse(JSON.stringify(newStore));
      setDoc(docRef, sanitized, { merge: true }).catch((err) => {
        console.error("Error writing to Firestore:", err);
        addToast("Firestore sync failed", "error");
      });
    }
  };

  const setSidebarCollapsed = (val: boolean | ((prev: boolean) => boolean)) => {
    setSidebarCollapsedState((prev) => {
      const nextVal = typeof val === "function" ? val(prev) : val;
      localStorage.setItem(SIDEBAR_PREF_KEY, String(nextVal));
      return nextVal;
    });
  };

  const addToast = (text: string, type: ToastMessage["type"] = "info") => {
    const id = "tst-" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Mutations (CRUD)
  const addTask = (task: Omit<TaskItem, "id" | "createdAt">) => {
    const newTask: TaskItem = {
      ...task,
      id: "TSK-" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    saveStore({ ...store, tasks: [newTask, ...store.tasks] });
    addToast(`Task "${newTask.title}" added`, "success");
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    const updated = store.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveStore({ ...store, tasks: updated });
    addToast(`Task updated`, "info");
  };

  const deleteTask = (id: string) => {
    saveStore({ ...store, tasks: store.tasks.filter((t) => t.id !== id) });
    addToast(`Task removed`, "warning");
  };

  // Study Log Mutations (CRUD)
  const addStudyLog = (log: Omit<StudyLog, "id">) => {
    const newLog: StudyLog = {
      ...log,
      id: "LOG-" + Date.now().toString(36).toUpperCase(),
    };
    saveStore({ ...store, studyLogs: [newLog, ...store.studyLogs] });
    addToast(`Study session logged: ${newLog.durationMinutes}m`, "success");
  };

  const deleteStudyLog = (id: string) => {
    saveStore({ ...store, studyLogs: store.studyLogs.filter((l) => l.id !== id) });
    addToast(`Study log deleted`, "warning");
  };

  // Target Goal Mutations (CRUD)
  const addTarget = (target: Omit<TargetGoal, "id">) => {
    const newTarget: TargetGoal = {
      ...target,
      id: "TGT-" + Date.now().toString(36).toUpperCase(),
    };
    saveStore({ ...store, targets: [...(store.targets || []), newTarget] });
    addToast(`${newTarget.horizon} target registered`, "success");
  };

  const updateTarget = (id: string, updates: Partial<TargetGoal>) => {
    const updated = (store.targets || []).map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveStore({ ...store, targets: updated });
    addToast(`Target updated`, "info");
  };

  const deleteTarget = (id: string) => {
    saveStore({ ...store, targets: (store.targets || []).filter((t) => t.id !== id) });
    addToast(`Target deleted`, "warning");
  };

  // Skill Mutations (CRUD)
  const addSkill = (skill: Omit<SkillItem, "id">) => {
    const newSkill: SkillItem = {
      ...skill,
      id: "SKL-" + Date.now().toString(36).toUpperCase(),
    };
    saveStore({ ...store, skills: [...store.skills, newSkill] });
    addToast(`Skill "${newSkill.skillName}" created`, "success");
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    const updated = store.skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStore({ ...store, skills: updated });
    addToast(`Skill updated`, "info");
  };

  const deleteSkill = (id: string) => {
    saveStore({ ...store, skills: store.skills.filter((s) => s.id !== id) });
    addToast(`Skill deleted`, "warning");
  };

  // Deadline Mutations (CRUD)
  const addDeadline = (d: Omit<MeetingDeadline, "id">) => {
    const newD: MeetingDeadline = {
      ...d,
      id: "EVT-" + Date.now().toString(36).toUpperCase(),
    };
    saveStore({ ...store, deadlines: [...store.deadlines, newD] });
    addToast(`Event scheduled: ${newD.title}`, "success");
  };

  const updateDeadline = (id: string, updates: Partial<MeetingDeadline>) => {
    const updated = store.deadlines.map((d) => (d.id === id ? { ...d, ...updates } : d));
    saveStore({ ...store, deadlines: updated });
    addToast(`Event status updated`, "info");
  };

  const deleteDeadline = (id: string) => {
    saveStore({ ...store, deadlines: store.deadlines.filter((d) => d.id !== id) });
    addToast(`Event deleted`, "warning");
  };

  // Habit Mutations (CRUD)
  const toggleHabit = (id: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const updated = store.habits.map((h) => {
      if (h.id === id) {
        const nextState = !h.completedToday;
        const newStreak = nextState ? h.streakDays + 1 : Math.max(0, h.streakDays - 1);
        const historyCopy = { ...h.history, [todayStr]: nextState };
        return {
          ...h,
          completedToday: nextState,
          streakDays: newStreak,
          history: historyCopy,
        };
      }
      return h;
    });
    saveStore({ ...store, habits: updated });
    addToast(`Habit status toggled`, "info");
  };

  const addHabit = (name: string, cadence: "Daily" | "Weekday") => {
    const newHabit: DailyHabit = {
      id: "HBT-" + Date.now().toString(36).toUpperCase(),
      name,
      cadence,
      streakDays: 0,
      completedToday: false,
      history: {},
    };
    saveStore({ ...store, habits: [...store.habits, newHabit] });
    addToast(`Habit created`, "success");
  };

  const deleteHabit = (id: string) => {
    saveStore({ ...store, habits: store.habits.filter((h) => h.id !== id) });
    addToast(`Habit removed`, "warning");
  };

  // Learning Terms (CRUD)
  const toggleTerm = (id: string) => {
    const updated = store.terms.map((t) => {
      if (t.id === id) {
        const nextState = !t.learned;
        return { ...t, learned: nextState };
      }
      return t;
    });
    saveStore({ ...store, terms: updated });
    const target = store.terms.find((t) => t.id === id);
    if (target) {
      addToast(target.learned ? `Unmarked "${target.term}"` : `Completed "${target.term}"`, "info");
    }
  };

  const addTerm = (term: Omit<LearningTerm, "id" | "orderIndex">) => {
    const newTerm: LearningTerm = {
      ...term,
      id: "TRM-" + Date.now().toString(36).toUpperCase(),
      orderIndex: store.terms.length + 1,
    };
    saveStore({ ...store, terms: [...store.terms, newTerm] });
    addToast(`Term "${newTerm.term}" added`, "success");
  };

  const updateTerm = (id: string, updates: Partial<LearningTerm>) => {
    const updated = store.terms.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveStore({ ...store, terms: updated });
    addToast(`Term updated`, "info");
  };

  const deleteTerm = (id: string) => {
    saveStore({ ...store, terms: store.terms.filter((t) => t.id !== id) });
    addToast(`Term deleted`, "warning");
  };

  const reorderTerms = (newTerms: LearningTerm[]) => {
    const indexed = newTerms.map((t, idx) => ({ ...t, orderIndex: idx + 1 }));
    saveStore({ ...store, terms: indexed });
  };

  const importTermsJSON = (rawTerms: Array<{ term: string; topic: string; subtopic: string; notes?: string }>): number => {
    if (!Array.isArray(rawTerms) || rawTerms.length === 0) return 0;
    const currentCount = store.terms.length;
    const validTerms: LearningTerm[] = rawTerms
      .filter((r) => r.term && r.topic && r.subtopic)
      .map((r, idx) => ({
        id: "TRM-" + (currentCount + idx + 1).toString().padStart(2, "0"),
        term: String(r.term).trim(),
        topic: String(r.topic).trim(),
        subtopic: String(r.subtopic).trim(),
        notes: r.notes ? String(r.notes).trim() : undefined,
        learned: false,
        orderIndex: currentCount + idx + 1,
      }));

    if (validTerms.length === 0) return 0;
    saveStore({ ...store, terms: [...store.terms, ...validTerms] });
    addToast(`Imported ${validTerms.length} terms successfully`, "success");
    return validTerms.length;
  };

  // Money Management (CRUD)
  const addMoneyRecord = (record: Omit<MoneyRecord, "id">) => {
    const newRecord: MoneyRecord = {
      ...record,
      id: "MNY-" + Date.now().toString(36).toUpperCase(),
    };
    saveStore({ ...store, moneyRecords: [newRecord, ...store.moneyRecords] });
    addToast(
      record.type === "Income"
        ? `Added income: +₹${record.amount}`
        : `Recorded expense: -₹${record.amount} (${record.purpose})`,
      record.type === "Income" ? "success" : "info"
    );
  };

  const deleteMoneyRecord = (id: string) => {
    saveStore({ ...store, moneyRecords: store.moneyRecords.filter((m) => m.id !== id) });
    addToast(`Money record removed`, "warning");
  };

  const updateMoneyRecord = (id: string, updates: Partial<MoneyRecord>) => {
    const updated = store.moneyRecords.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    saveStore({ ...store, moneyRecords: updated });
    addToast(`Record updated`, "info");
  };

  const updateMonthlyAllowance = (amount: number) => {
    saveStore({ ...store, monthlyAllowance: amount });
    addToast(`Monthly pocket money updated to ₹${amount}`, "success");
  };

  // User Profile (CRUD)
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updated = {
      ...(store.userProfile || initialStore.userProfile!),
      ...profile,
    };
    saveStore({ ...store, userProfile: updated });
    addToast("Profile details updated successfully", "success");
  };

  // Notepad / Notes (CRUD)
  const addNote = (note: Omit<CustomNote, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString().split("T")[0];
    const newNote: CustomNote = {
      ...note,
      id: "NOT-" + Date.now().toString(36).toUpperCase(),
      createdAt: now,
      updatedAt: now,
    };
    saveStore({ ...store, notes: [newNote, ...(store.notes || [])] });
    addToast(`Note "${newNote.title}" saved`, "success");
  };

  const updateNote = (id: string, updates: Partial<CustomNote>, notify: boolean = false) => {
    const now = new Date().toISOString().split("T")[0];
    const updatedNotes = (store.notes || []).map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: now } : n
    );
    saveStore({ ...store, notes: updatedNotes });
    if (notify) {
      addToast("Note saved successfully", "success");
    }
  };

  const deleteNote = (id: string) => {
    const filtered = (store.notes || []).filter((n) => n.id !== id);
    saveStore({ ...store, notes: filtered });
    addToast("Note deleted", "warning");
  };

  // Import / Export
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `evofox_vault_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    addToast(`Vault backup exported to JSON`, "success");
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as AppStore;
      if (parsed) {
        saveStore({
          tasks: parsed.tasks || [],
          studyLogs: parsed.studyLogs || [],
          targets: parsed.targets || [],
          skills: parsed.skills || [],
          deadlines: parsed.deadlines || [],
          habits: parsed.habits || [],
          terms: parsed.terms || [],
          moneyRecords: parsed.moneyRecords || [],
          monthlyAllowance: parsed.monthlyAllowance ?? 0,
          userProfile: parsed.userProfile || initialStore.userProfile,
          notes: parsed.notes || [],
        });
        addToast(`Vault data successfully restored`, "success");
        return true;
      }
      addToast(`Invalid backup structure`, "error");
      return false;
    } catch {
      addToast(`JSON parse failed`, "error");
      return false;
    }
  };

  const resetToDefaults = () => {
    saveStore(initialStore);
    addToast(`Vault cleared to empty state`, "info");
  };

  return (
    <StoreContext.Provider
      value={{
        store,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        sidebarCollapsed,
        setSidebarCollapsed,
        isFirestoreSyncing,
        addTask,
        updateTask,
        deleteTask,
        addStudyLog,
        deleteStudyLog,
        addTarget,
        updateTarget,
        deleteTarget,
        addSkill,
        updateSkill,
        deleteSkill,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        toggleHabit,
        addHabit,
        deleteHabit,
        toggleTerm,
        addTerm,
        updateTerm,
        deleteTerm,
        reorderTerms,
        importTermsJSON,
        addMoneyRecord,
        updateMoneyRecord,
        deleteMoneyRecord,
        updateMonthlyAllowance,
        updateUserProfile,
        addNote,
        updateNote,
        deleteNote,
        exportJSON,
        importJSON,
        resetToDefaults,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
