import { SprintReport, ProjectSprintOverviewResponse } from "@/types/sprint";

const GLOBAL_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const REPORTS_API_PATH = `/api/Reports/projects`;

if (process.env.NODE_ENV === 'production' && !GLOBAL_BASE_API_URL) {
  console.error('Environment variable NEXT_PUBLIC_BASE_API_URL is not set!');
  
}

/* Fetches project sprint overview data from the API.*/
export const fetchApi = async (projectKey: string): Promise<ProjectSprintOverviewResponse> => {
  if (!GLOBAL_BASE_API_URL) {
    throw new Error("API base URL is not configured. Please set NEXT_PUBLIC_BASE_API_URL in your .env.local file.");
  }
  const url = `${GLOBAL_BASE_API_URL}${REPORTS_API_PATH}/${projectKey}/sprint-overview`;

  try {
    const response = await fetch(url);
    const responseBody = await response.text();

    if (!response.ok) {
      let errorDetail = `Status: ${response.status}`;
      try {
        const parsedError = JSON.parse(responseBody);
        errorDetail += ` - ${parsedError.message || JSON.stringify(parsedError)}`;
      } catch {
        errorDetail += ` - ${responseBody.substring(0, 100)}${responseBody.length > 100 ? '...' : ''}`;
      }
      throw new Error(`Failed to fetch sprint overview: ${errorDetail}`);
    }

    try {
      return JSON.parse(responseBody) as ProjectSprintOverviewResponse;
    } catch (jsonError) {
      console.error(`Failed to parse successful response as JSON from ${url}:`, responseBody, jsonError);
      throw new Error(`Invalid JSON response from API: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }

  } catch (error) {
    console.error(`Network or unexpected error in fetchApi for project ${projectKey} at ${url}:`, error);
    throw error; 
  }
};

/* Formats a date string to a short, readable format (e.g., Jun 17, 2025). */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { 
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Error';
  }
};

/* Formats a date string to a readable date-time format (e.g., Jun 17, 2025, 03:30 PM). */
export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { 
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date-time:", e);
    return 'Error';
  }
};

/* Returns a Tailwind CSS background color class based on a percentage. */
export const getProgressColor = (percentage: number): string => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  if (clampedPercentage >= 80) {
    return 'bg-green-500';
  }
  if (clampedPercentage >= 50) {
    return 'bg-yellow-500';
  }
  return 'bg-red-500';
};