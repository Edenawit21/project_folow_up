export interface Project {
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
  id?: string;
  key?: string;
  projectCategory?: string;
  leadDisplayName?: string;
  developers?: string[];
  status?: string; 
  priority?: string;
}



// types/task.ts
export interface Task {
  status: string;
  key: string;
  summary: string;
}
export interface TeamMember {
  accountId: string | null;
  displayName: string;
}

// types/filters.ts

export interface ProjectFilterState {
  status: string;
  priority: string;
  developerId: string;
  teamId: string;
  projectManagerId: string;
}

export interface Entity {
  id: string;
  name: string;
}
