// src/utils/api.ts (or similar)
import axios from 'axios';
import { UserProjectReport } from '../types/userReport'; // Adjust path as needed
import { ProjectCompletionReports } from '@/types/userProject';

// Assuming your API is running on localhost:5001 or similar for .NET
// Make sure this base URL matches your backend's address.
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // <--- IMPORTANT: Verify your backend port

export async function fetchUserProjectReport(userId: string, projectId: string): Promise<UserProjectReport> {
    try {
        const response = await axios.get<UserProjectReport>(`${API_BASE_URL}/UserReports/${userId}/projects/${projectId}/contributions`);
        return response.data;
    } catch (error) {
        // It's good practice to log the full error from Axios
        if (axios.isAxiosError(error)) {
            console.error('Axios error fetching user report:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error fetching user report:', error);
        }
        throw new Error('Failed to fetch user project report');
    }
}

export async function FetchProjectById(userId: string): Promise<ProjectCompletionReports> {
  try {
    const response = await axios.get<ProjectCompletionReports>(`${API_BASE_URL}/UserReports/${userId}/projects`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching user by ID:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch user details.");
    }
    throw new Error("An unexpected error occurred while fetching user details.");
  }
}