// Represents a project with backend and optional UI fields
export interface Project {
  projectKey: string;
  projectName: string;
  projectManager: string;
  totalIssues: number;
  issuesDone: number;
  issuesInProgress: number;
  totalStoryPoint: number;
  storyPointsDone: number;
  projectHealth: string;
  lastSyncedAt: string;
  title?: string;
  description?: string;
  manager?: string;
  owner?: string;
  teamLeader?: string;
  developers?: string[];
  status?: "todo" | "on_progress" | "completed";
  priority?: "High" | "Medium" | "Low";
}

// Represents the form input data for creating/updating a project
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

// Represents a task item with status and summary
export interface Task {
  status: string;
  key: string;
  summary: string;
}

// Represents filter criteria for projects
export interface ProjectFilterState {
  status: string;
  priority: string;
  developerId: string;
  teamId: string;
  projectManagerId: string;
}

// Generic entity with ID and name
export interface Entity {
  id: string;
  name: string;
}

// Represents a user role with permissions
export interface RoleData {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

// API response wrapper for role-related data
export interface ApiResponse {
  valueOrDefault: RoleData[];
  value: RoleData[];
  isFailed: boolean;
  isSuccess: boolean;
  reasons: any[];
  errors: any[];
  successes: any[];
}

// Represents a privilege/permission entity
export interface Privilege {
  id: string;
  permissionName: string;
  description: string;
  createdAt?: string;
  action: string;
}

// Payload for creating or updating a privilege
export interface PrivilegePayload {
  permissionName: string;
  description: string;
  action: string;
}

// Privilege data returned from API
export interface PrivilegeResponse {
  id: string;
  permissionName: string;
  description: string;
  action?: string;
  createdAt?: string;
}

// Represents a user entity
export interface User {
  firstName: string;
  lastName: string;
  accountId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  active: boolean;
  source: string;
  userId: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}
// Form data for user-related operations like registration
export interface UserForm {
  username: string;
  email?: string;
  password?: string;
  role: string;
  value: string;
}

// Error messages for user forms
export interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

// Form state for login forms
export interface FormState {
  email: string;
  password: string;
}

// Payload for login requests
export interface LoginRequest {
  email: string;
  password: string;
}

// Form data for creating/updating privileges
export interface PrivilegeFormData {
  permissionName: string;
  description: string;
  action: string;
}

// Data transfer object for creating a new user
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  accountId: string;
  email: string;
  roles: string[];
}
