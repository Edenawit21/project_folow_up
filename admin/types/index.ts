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
  title?: string;                
  description?: string;
  manager?: string;            
  owner?: string;
  teamLeader?: string;
  developers?: string[];      
  status?: "todo" | "on_progress" | "completed";
  priority?: "High" | "Medium" | "Low";
}

export interface FormProject {
  title: string;
  description: string;
  manager: string;
  owner: string;
  teamLeader: string;
  developers: string; 
  status: "todo" | "on_progress" | "completed";
  priority: "High" | "Medium" | "Low";
}

export interface Task {
  status: string;
  key: string;
  summary: string;
}

export interface TeamMember {
  accountId: string | null;
  displayName: string;
}

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
