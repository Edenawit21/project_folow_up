export type Project = {
  id: number;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low"; 
  status: "Not Started" | "In Progress" | "Completed" | "On Hold"; 
  dueDate: Date | string; 
  team: string;
};
