// services/projectService.ts
import axios from "axios";
import { Project, Task } from "@/types";

const API_URL = "http://localhost:5161/api/JiraTest";

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/all`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch projects");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// utils/Jira.ts

export async function FetchSingleProject(projectKey: string): Promise<Project> {
  try {
    const response = await axios.get(`${API_URL}/fetch/${projectKey}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch project");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}
export async function fetchProjectTasks(projectKey: string): Promise<Task[]> {
  try {
    const response = await axios.get(`${API_URL}/issues/${projectKey}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch project tasks");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw error;
  }
}
