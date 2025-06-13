import axios from "axios";

/**
 * Base URL for the API
 */
export const PROJECT_API_URL =
  process.env.PROJECT_API_URL ?? "https://localhost:7205/api/Project";

/* ---------------------------------------------------------------------------
 * Backend contract
 * ------------------------------------------------------------------------- */
export interface ApiProject {
  id: string;
  key: string;
  name: string;
  description: string;
  lead: string;
  health: {
    level: number;
    reason: string;
    score: number;
    confidence: "Low" | "Medium" | "High";
  };
  progress: {
    totalTasks: number;
    completedTasks: number;
    storyPointsCompleted: number;
    storyPointsTotal: number;
    activeBlockers: number;
    recentUpdates: number;
  };
  critical: boolean;
}

/**
 * Response returned by GET /public — list of projects
 */
export interface ApiProjectsResponse {
  success: boolean;
  data: ApiProject | ApiProject[];
}

/**
 * Wrapped response that _may_ be returned by GET /:id
 */
export interface ApiProjectByIdWrapped {
  success: boolean;
  data: ApiProject;
}

/**
 * GET /:id can return _either_ a wrapped or a raw project object
 */
export type ApiProjectByIdResponse = ApiProject | ApiProjectByIdWrapped;

/* ---------------------------------------------------------------------------
 * UI contract
 * ------------------------------------------------------------------------- */
export type ProjectDto = {
  Id: string;
  Key: string;
  Name: string;
  Description: string;
  Lead: string;
  Health: {
    Level: number;
    Reason: string;
    Score: number;
    Confidence: "Low" | "Medium" | "High";
  };
  Progress: {
    TotalTasks: number;
    CompletedTasks: number;
    StoryPointsCompleted: number;
    StoryPointsTotal: number;
    ActiveBlockers: number;
    RecentUpdates: number;
  };
  Critical: boolean;
};

/* ---------------------------------------------------------------------------
 * Mapper
 * ------------------------------------------------------------------------- */
const mapApiToProjectDto = (api: ApiProject): ProjectDto => ({
  Id: api.id,
  Key: api.key,
  Name: api.name,
  Description: api.description,
  Lead: api.lead,
  Health: {
    Level: api.health.level,
    Reason: api.health.reason,
    Score: api.health.score,
    Confidence: api.health.confidence,
  },
  Progress: {
    TotalTasks: api.progress.totalTasks,
    CompletedTasks: api.progress.completedTasks,
    StoryPointsCompleted: api.progress.storyPointsCompleted,
    StoryPointsTotal: api.progress.storyPointsTotal,
    ActiveBlockers: api.progress.activeBlockers,
    RecentUpdates: api.progress.recentUpdates,
  },
  Critical: api.critical,
});

/* ---------------------------------------------------------------------------
 * Public API functions
 * ------------------------------------------------------------------------- */

/**
 * Fetch **all** projects (public list)
 */
export const fetchProjects = async (): Promise<ProjectDto[]> => {
  try {
    const { data, status } = await axios.get<ApiProjectsResponse>(
      `${PROJECT_API_URL}/public`
    );

    if (status !== 200 || !data.success) {
      throw new Error("Failed to fetch projects");
    }

    // Handle both single project and array responses
    const projects = Array.isArray(data.data) ? data.data : [data.data];
    return projects.map(mapApiToProjectDto);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Fetch **one** project by its identifier.
 *
 * This endpoint is inconsistent: sometimes the backend returns
 * `{ success: true, data: { ...project } }`, other times it returns the
 * raw project object.  We normalise that here so the rest of the UI
 * doesn’t have to care.
 */
export const fetchProjectById = async (
  projectId: string
): Promise<ProjectDto> => {
  try {
    const url = `${PROJECT_API_URL}/${projectId}`;
    const { data, status } = await axios.get<ApiProjectByIdResponse>(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500, // Don’t reject for 4xx errors
    });

    if (status !== 200) {
      throw new Error(`API returned HTTP ${status}`);
    }

    let projectApi: ApiProject | null = null;

    // Case 1: wrapped response – { success, data }
    if (typeof (data as ApiProjectByIdWrapped).success !== "undefined") {
      const wrapped = data as ApiProjectByIdWrapped;

      if (!wrapped.success) {
        throw new Error("API request was not successful");
      }

      projectApi = wrapped.data;
    } else {
      // Case 2: raw project object
      projectApi = data as ApiProject;
    }

    if (!projectApi) {
      throw new Error("No project data received");
    }

    return mapApiToProjectDto(projectApi);
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw new Error(
      `Failed to fetch project: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
