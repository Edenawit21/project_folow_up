export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
  Blocked = 'Blocked',
  Unknown = 'Unknown',
//   SelectedForDevelopment = 'Selected for Development',
//   ReadyForReview = 'Ready For Review',
//   InReview = 'In Review',
//   QA = 'QA',
//   Closed = 'Closed',
}

import { TaskInSprint } from "./sprint";

// /**
//  * Enum for broad task status categories.
//  * Useful for grouping statuses for UI purposes (e.g., in progress, done).
//  */
// export enum TaskStatusCategory {
//   ToDo = 'To Do',
//   InProgress = 'In Progress',
//   Done = 'Done',
//   Blocked = 'Blocked',
//   Other = 'Other',
// }

/**
 * Represents a single task assigned to a user within a project.
 */
// export interface UserProjectTask {
//   key: string;
//   title: string;
//   description: string | null;
//   status: TaskStatus;
//   statusCategory: TaskStatusCategory | null; // Added based on typical usage, might be derived
//   assigneeId: string;
//   assigneeName: string;
//   createdDate: string; // ISO 8601 string (e.g., "2025-06-12T07:58:24.848")
//   updatedDate: string; // ISO 8601 string
//   dueDate: string | null; // ISO 8601 string or null
//   storyPoints: number | null;
//   timeEstimateMinutes: number | null;
//   issueType: string;
//   epicKey: string | null;
//   parentKey: string | null;
//   labels: string[] | null; // Assuming labels could be an array of strings
//   priority: string;
//   currentSprintJiraId: number | null;
//   currentSprintName: string | null;
//   currentSprintState: string | null;
// }

/**
 * Represents a sprint the user is involved in.
 */
export interface SprintInvolvedIn {
  id: string; // GUID string
  name: string;
  state: string; // e.g., "active", "closed", "future"
}

/**
 * Represents the full detailed report for a user within a specific project.
 */
export interface UserProjectReport {
  userId: string;
  userName: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  totalTasksAssigned: number;
  completedTasks: number;
  totalStoryPointsAssigned: number;
  completedStoryPoints: number;
  overdueTasks: number;
  activeBlockers: number;
  taskCompletionPercentage: number;
  storyPointCompletionPercentage: number;
  userTasksInProject: TaskInSprint[];
  taskStatusCounts: { [key: string]: number }; 
  issueTypeCounts: { [key: string]: number }; 
  priorityCounts: { [key: string]: number }; 
  sprintsInvolvedIn: SprintInvolvedIn[];
}