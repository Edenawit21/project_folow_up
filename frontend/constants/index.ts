import { Project } from "@/types";

// Explicitly type the projects array
export const projects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "A platform for buying and selling products online.",
    priority: "High",
    status: "In Progress",
    dueDate: "2025-06-10",
    team: "Team Alpha",
  },
  {
    id: 2,
    name: "Marketing Website",
    description: "A website to showcase company products and services.",
    priority: "Medium",
    status: "Completed",
    dueDate: "2025-04-22",
    team: "Team Beta",
  },
  {
    id: 3,
    name: "Mobile App Redesign",
    description: "Redesign of the mobile app to improve user experience.",
    priority: "Low",
    status: "Not Started",
    dueDate: "2025-08-01",
    team: "Team Gamma",
  },
  {
    id: 4,
    name: "Internal Dashboard",
    description: "A dashboard for internal team performance tracking.",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2025-07-15",
    team: "Team Alpha",
  },
  {
    id: 5,
    name: "AI Chatbot Integration",
    description: "Integrating AI-powered chatbots for customer support.",
    priority: "High",
    status: "On Hold",
    dueDate: "2025-09-05",
    team: "Team Beta",
  },
];
