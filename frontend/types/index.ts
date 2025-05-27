// ===============================
// Primary Project Type (Backend + Form)
// ===============================
export interface Project {
  // Backend fields
  projectKey: string;
  projectName: string;
  projectManager: string;
  totalIssues: number;
  issuesDone: number;
  issuesInProgress: number;
  totalStoryPoint: number;
  storyPointsDone: number;
  riskLevel: string;
  lastSyncedAt: string;

  // Optional fields (from form)
  title?: string;                // Duplicate meaning of projectName
  description?: string;
  manager?: string;             // Same as projectManager (used for form)
  owner?: string;
  teamLeader?: string;
  developers?: string[];        // Form adds this
  status?: "todo" | "on_progress" | "completed";
  priority?: "High" | "Medium" | "Low";
}

// ===============================
// Clean Form Data Type
// ===============================
export interface FormProject {
  title: string;
  description: string;
  manager: string;
  owner: string;
  teamLeader: string;
  developers: string; // comma-separated input
  status: "todo" | "on_progress" | "completed";
  priority: "High" | "Medium" | "Low";
}

// ===============================
// Task Type
// ===============================
export interface Task {
  status: string;
  key: string;
  summary: string;
}

// ===============================
// Team Member Type
// ===============================
export interface TeamMember {
  accountId: string | null;
  displayName: string;
}

// ===============================
// Project Filter Type
// ===============================
export interface ProjectFilterState {
  status: string;
  priority: string;
  developerId: string;
  teamId: string;
  projectManagerId: string;
}

// ===============================
// Entity for dropdown lists
// ===============================
export interface Entity {
  id: string;
  name: string;
}
