import { AppStore } from "@/types/app";

export const initialStore: AppStore = {
  tasks: [],
  studyLogs: [],
  targets: [],
  skills: [],
  deadlines: [],
  habits: [],
  terms: [],
  moneyRecords: [],
  monthlyAllowance: 0,
  userProfile: {
    name: "User",
    email: "",
    role: "Learner",
    institution: "",
    semesterOrYear: "",
    major: "",
    bio: "",
    primaryGoal: "",
  },
  notes: [],
};

// Kept for backward compatibility or optional template restore
export const seedData = initialStore;
