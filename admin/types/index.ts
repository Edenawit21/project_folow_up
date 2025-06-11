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
  projectHealth: string;
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

export interface RoleData {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  privileges?: Privilege[];
  privilegeId?: string;
}
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  accountId: string;
  email: string;
  roles: string[];
}


export interface Privilege {
  id: string;
  permissionName: string;
  description: string;
  createdAt: string;
  action: string;
}

export interface PrivilegePayload {
  permissionName: string;
  description: string;
  action: string;
}

export interface PrivilegeResponse {
  id: string;
  permissionName: string;
  description: string;
  action?: string;
  createdAt?: string;
}

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

export interface UserForm {
  username: string;
  email?: string;
  password?: string;
  role: string;
}
export interface Errors {
  email?: string;
  password?: string;
  general?: string;
}
export interface FormState {
  email: string;
  password: string;
}
export interface LoginRequest{
  email: string,
  password: string
}