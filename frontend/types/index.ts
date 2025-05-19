export interface Project {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  projectCategory: string;
  leadDisplayName: string;
  developers: TeamMember[];
  admins: TeamMember[];
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

// export type UserRole = "manager" | "project_manager" | "team_leader";

// export interface User {
//   id: string;
//   name: string;
//   role: UserRole;
// }
interface User {
  id: string;
  name: string;
  email: string;
  azureRole: string;
  jiraRole: string;
}
