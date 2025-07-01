import axios from "axios";

export const PROJECT_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "https://localhost:7205/api/Project";


  export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProjectFilterDto {
  pageNumber?: number;
  pageSize?: number;
  SortBy?: string;
  SortDescending?: boolean
  Name ?: string;
  Description ?: string;
  Lead ?: string;
  HealthLevel ?: number;
  IsCritical ?: boolean;
  Status ?: string;

}
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
  owner?: {
    name: string;
    contactInfo?: string; 
  };
  targetEndDate?: string; 
  status?: string; 
  critical: boolean;
}

export interface ApiProjectsResponse {
  success: boolean;
  data: ApiProject | ApiProject[];
}

export interface ApiProjectByIdWrapped {
  success: boolean;
  data: ApiProject;
}

export type ApiProjectByIdResponse = ApiProject | ApiProjectByIdWrapped;


export type ProjectDto = {
  Id: string;
  Key: string;
  Name: string;
  Description: string;
  Lead: string;
  Status?: string; 
  TargetEndDate?: string; 
  ProjectOwner?: {
    Name?: string;
    ContactInfo ?: string;
  }; 
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
  ProjectOwner: {
    Name: api.owner?.name , 
    ContactInfo: api.owner?.contactInfo ,
  },
  TargetEndDate: api.targetEndDate ? new Date(api.targetEndDate).toISOString() : undefined,
  Status: api.status, 
  Critical: api.critical,
});


export const fetchProjects = async (filter: ProjectFilterDto): Promise<PagedList<ProjectDto>> => {
  try {
    const response = await axios.get<{
      success: boolean;
      data: PagedList<ApiProject>;
    }>(`${PROJECT_API_URL}/api/Project/public`, {
      params: filter
    });

    if (!response.data.success) {
      throw new Error("Failed to fetch projects");
    }

    const pagedData = response.data.data;
    
    return {
      items: pagedData.items.map(mapApiToProjectDto),
      totalCount: pagedData.totalCount,
      pageNumber: pagedData.pageNumber,
      pageSize: pagedData.pageSize,
      totalPages: pagedData.totalPages,
      hasPreviousPage: pagedData.hasPreviousPage,
      hasNextPage: pagedData.hasNextPage
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectById = async (
  projectId: string
): Promise<ProjectDto> => {
  try {
    const url = `${PROJECT_API_URL}/${projectId}`;
    const { data, status } = await axios.get<ApiProjectByIdResponse>(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500, 
    });

    if (status !== 200) {
      throw new Error(`API returned HTTP ${status}`);
    }

    let projectApi: ApiProject | null = null;

    if (typeof (data as ApiProjectByIdWrapped).success !== "undefined") {
      const wrapped = data as ApiProjectByIdWrapped;

      if (!wrapped.success) {
        throw new Error("API request was not successful");
      }

      projectApi = wrapped.data;
    } else {
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
