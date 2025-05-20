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

