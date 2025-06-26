import { OverallProjectStatus, ProjectDetailDto , ApiResponse, UpdateProjectStrategicDetailsDto, AddOrUpdateMilestoneDto, MilestoneDto, UpdateMilestoneDto, AddRiskDto, UpdateRiskDto, AddOrUpdateRiskDto } from "@/types/projectDetail";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5106';
const STRATEGIC_PROJECTS_API_PATH = '/api/Project/Detail';


export const getProjectDetails = async (projectId: string): Promise<ProjectDetailDto | null> => {
    try {
        const response = await axios.get<ApiResponse<ProjectDetailDto>>(`${API_BASE_URL}${STRATEGIC_PROJECTS_API_PATH}/${projectId}`);
        return response.data.value || null; // Return the project details or null if not found   
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Backend might return a specific error message
            throw new Error(error.response.data.message || error.response.data.title || 'Failed to fetch project details from API.');
        }
        throw new Error('An unexpected error occurred while fetching project details.');
    }
};

/**
 * Updates the strategic details of a project via the backend API.
 * @param projectId The ID of the project to update.
 * @param data The partial data containing the updated details.
 */
export const updateProjectStrategicDetails = async (
  projectId: string,
  data: UpdateProjectStrategicDetailsDto
): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}${STRATEGIC_PROJECTS_API_PATH}/${projectId}`,
      data
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
        error.response.data.title ||
        'Failed to update project strategic details via API.'
      );
    }
    throw new Error('An unexpected error occurred while updating project strategic details.');
  }
};

//MIlestones API
const MILESTONES_API_PATH = '/api/Project';

export const addMilestone = async (
  projectId: string,
  data: AddOrUpdateMilestoneDto
): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/${projectId}/milestones`; // Adjust to your actual route

    await axios.post(url, data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
        error.response.data.title ||
        'Failed to add milestone via API.'
      );
    }
    throw new Error('An unexpected error occurred while adding milestone.');
  }
};


export const updateMilestone = async (
projectId: string, id: string, data: UpdateMilestoneDto): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/milestones/${id}`;
    
    const response = await axios.put(url, data);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to update milestone: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to update milestone via API."
      );
    }
    throw new Error("An unexpected error occurred while updating the milestone.");
  }
};

export const deleteMilestone = async (
  milestoneId: string
): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/milestones/${milestoneId}`;

    const response = await axios.delete(url);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to delete milestone: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to delete milestone via API."
      );
    }
    throw new Error("An unexpected error occurred while deleting the milestone.");
  }
};


export const addRisk = async (projectId: string,  data: AddRiskDto): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/${data.projectId}/risks`;
    const response = await axios.post(url, data);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to add risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to add risk via API."
      );
    }
    throw new Error("An unexpected error occurred while adding risk.");
  }
};


export const updateRisk = async (
  projectId: string,
  riskId: string,
  data: UpdateRiskDto
): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/risks/${riskId}`;
    const response = await axios.put(url, data);

    if (!response.data?.success) {
      const errors = extractErrorMessages(response.data.errors);
      throw new Error(`Failed to update risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const message =
        extractErrorMessages(errorData.errors) ||
        errorData.title ||
        "Failed to update risk via API.";

      throw new Error(message);
    }

    throw new Error("An unexpected error occurred while updating risk.");
  }
};

function extractErrorMessages(errors: any): string {
  if (Array.isArray(errors)) {
    return errors.join(", ");
  }

  if (typeof errors === "string") {
    return errors;
  }

  if (typeof errors === "object") {
    return Object.entries(errors)
      .map(([key, value]) =>
        Array.isArray(value) ? `${key}: ${value.join(", ")}` : `${key}: ${value}`
      )
      .join(" | ");
  }

  return "Unknown error format.";
}


export const deleteRisk = async (
  
  riskId: string
): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/api/Project/risks/${riskId}`;
    const response = await axios.delete(url);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to delete risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to delete risk via API."
      );
    }
    throw new Error("An unexpected error occurred while deleting risk.");
  }
};