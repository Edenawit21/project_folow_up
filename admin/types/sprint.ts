// src/types/sprint.ts (Add this new interface)

export interface DeveloperWorkload {
  assigneeId: string;
  assigneeName: string;
  estimatedWork: number;
  completedWork: number;
  taskStatusBreakdown: {
    [status: string]: number;
  };
}

export interface RecentActivity {
  taskKey: string;
  description: string;
  changedBy: string;
  timestamp: string;
}

export interface SprintReport { // This remains your existing SprintReport interface
  id: string;
  jiraId: number; // Added jiraId based on your API response
  name: string;
  state: 'active' | 'closed' | 'future';
  startDate: string;
  endDate: string;
  completeDate: string | null; // Can be null
  goal?: string; // Optional
  boardName: string; // "N/A" in your example, but keep as string
  totalStoryPoints: number;
  completedStoryPoints: number;
  storyPointCompletionPercentage: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionPercentage: number;
  activeBlockers: number;
  overdueTasks: number;
  bugsCreatedThisSprint: number;
  tasksMovedFromPreviousSprint: number;
  taskStatusCounts: {
    [status: string]: number;
  };
  issueTypeCounts: {
    [type: string]: number;
  };
  developerWorkloads: DeveloperWorkload[];
  recentActivities: RecentActivity[];
}

// NEW INTERFACE for the overall API response
export interface ProjectSprintOverviewResponse {
  projectKey: string;
  projectName: string;
  sprints: SprintReport[]; // This is an array of SprintReport objects
}