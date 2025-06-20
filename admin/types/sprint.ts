// src/types/sprint.ts (Add this new interface)


export interface SprintReport { // This remains your existing SprintReport interface
 id: string;
 name: string;
 state: string;
}

// NEW INTERFACE for the overall API response
export interface ProjectSprintOverviewResponse {
  projectKey: string;
  projectName: string;
  sprints: SprintReport[]; // This is an array of SprintReport objects
}

export interface SprintReportDetail {
  id: string | null;
  jiraId: number | null;
  name: string | null;
  state: "closed" | "active" | "future"; // Assuming other possible states
  startDate: string | null; // ISO 8601 date string
  endDate: string | null; // ISO 8601 date string
  completeDate: string | null; // ISO 8601 date string, or null if not completed
  goal: string | null;
  boardName: string | null;
  totalStoryPoints: number | null;
  completedStoryPoints: number | null;
  storyPointCompletionPercentage: number | null;
  totalTasks: number | null;
  completedTasks: number | null;
  taskCompletionPercentage: number | null;
  activeBlockers: number | null;
  overdueTasks: number | null;
  bugsCreatedThisSprint: number | null;
  tasksMovedFromPreviousSprint: number | null;
  taskStatusCounts: {
    [key: string]: number ; // e.g., { "Done": 2, "In Progress": 0 }
  };
  issueTypeCounts: {
    [key: string]: number ; // e.g., { "Story": 1, "Task": 1 }
  };
  developerWorkloads: DeveloperWorkload[];
  recentActivities: RecentActivity[];
  tasksInSprint: TaskInSprint[];
}

export interface DeveloperWorkload {
  assigneeId: string | null;
  assigneeName: string | null;
  estimatedWork: number | null;
  completedWork: number | null;
  taskStatusBreakdown: {
    [key: string]: number | null; // e.g., { "Done": 2, "To Do": 0 }
  };
}

 export interface RecentActivity {
  taskKey: string | null;
  description: string | null;
  changedBy: string | null;
  timestamp: string ; // ISO 8601 date string
}

 export interface TaskInSprint {
  key: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  statusCategory: string | null;
  assigneeId: string | null; // Can be null if unassigned
  assigneeName: string | null; // Can be null if unassigned
  createdDate: string | null; // ISO 8601 date string
  updatedDate: string | null; // ISO 8601 date string
  dueDate: string | null; // ISO 8601 date string, or null
  storyPoints: number | null; // Can be null
  timeEstimateMinutes: number | null; // Can be null
  issueType: string | null;
  epicKey: string | null; // Can be null
  parentKey: string | null; // Can be null
  labels: string[] | null; // Can be null, or an array of strings
  priority: string | null;
  currentSprintJiraId: number | null; // Can be null if not in a sprint
  currentSprintName: string | null; // Can be null
  currentSprintState: string | null; // Can be null, e.g., "active", "closed"
}