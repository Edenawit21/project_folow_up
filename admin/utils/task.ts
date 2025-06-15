import axios from "axios";

/**
 * Base URL for the API. You can override this with an environment variable.
 */
export const TASK_API_URL =
  process.env.TASK_API_URL ?? "https://localhost:7205/api/Project/task";

/* ---------------------------------------------------------------------------
 * Backend contract (API response format)
 * ------------------------------------------------------------------------- */
export interface ApiTask {
  key: string;
  title: string;
  description: string | null;
  status: string;
  assigneeId: string;
  assigneeName: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string | null;
  storyPoints: number;
  priority?: string;
}

/**
 * UI contract (what your React components consume)
 */
export type TaskDto = {
  Key: string;
  Title: string;
  Description: string | null;
  Status: string;
  AssigneeId: string;
  AssigneeName: string;
  CreatedDate: string;
  UpdatedDate: string;
  DueDate: string | null;
  StoryPoints: number;
  Priority?: string;
};

/* ---------------------------------------------------------------------------
 * Mapper – converts API response to UI contract
 * ------------------------------------------------------------------------- */
const mapApiToTaskDto = (api: ApiTask): TaskDto => ({
  Key: api.key,
  Title: api.title,
  Description: api.description,
  Status: api.status,
  AssigneeId: api.assigneeId,
  AssigneeName: api.assigneeName,
  CreatedDate: api.createdDate,
  UpdatedDate: api.updatedDate,
  DueDate: api.dueDate,
  StoryPoints: api.storyPoints,
  Priority: api.priority,
});

/* ---------------------------------------------------------------------------
 * Public API – fetches tasks for a specific project
 * ------------------------------------------------------------------------- */
export const fetchTasksByProject = async (
  projectId: string
): Promise<TaskDto[]> => {
  try {
    const url = `${TASK_API_URL}/${projectId}`;
    const { data, status } = await axios.get<ApiTask[]>(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500,
    });

    if (status !== 200 || !Array.isArray(data)) {
      throw new Error("Failed to fetch tasks");
    }

    return data.map(mapApiToTaskDto);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(
      `Failed to fetch tasks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
