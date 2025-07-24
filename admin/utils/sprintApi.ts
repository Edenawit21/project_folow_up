import { SprintReport, ProjectSprintOverviewResponse , SprintReportDetail } from "@/types/sprint";

const GLOBAL_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const REPORTS_API_PATH = `/api/Reports/projects`;

if (process.env.NODE_ENV === 'production' && !GLOBAL_BASE_API_URL) {
  console.error('Environment variable NEXT_PUBLIC_BASE_API_URL is not set!');
  
}

/* Fetches project sprint overview data from the API.*/
export const fetchApi = async (projectKey: string, token: string): Promise<ProjectSprintOverviewResponse> => {
  if (!GLOBAL_BASE_API_URL) {
    throw new Error("API base URL not configured");
  }

  const url = `${GLOBAL_BASE_API_URL}${REPORTS_API_PATH}/${projectKey}/sprint-overview`;
  console.debug('API Request:', { url, token: token ? 'exists' : 'missing' });

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // Only if using cookies
    });
    console.debug(`Request took ${Date.now() - startTime}ms`);

    const responseBody = await response.text();
    console.debug('API Response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseBody.substring(0, 100)}`);
    }

    return JSON.parse(responseBody) as ProjectSprintOverviewResponse;
    
  } catch (error) {
    console.error('API Call Failed:', {
      error,
      url,
      time: new Date().toISOString()
    });
    
    if (error instanceof TypeError) {
      throw new Error("Network error - check console for details");
    }
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

export const fetchSprint = async (sprintId: string, token: string): Promise<SprintReportDetail> => {
  if (!GLOBAL_BASE_API_URL) {
    throw new Error("API base URL is not configured.");
  }

  const url = `${GLOBAL_BASE_API_URL}/api/Reports/sprints/${sprintId}`;
  console.debug('Fetching from:', url); // Debug log

  try {
    const response = await fetch(url, {
      method: 'GET', // or headers as needed
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `HTTP error! status: ${response.status}`
      );
    }

    return await response.json() as SprintReportDetail;
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch sprint'
    );
  }
}