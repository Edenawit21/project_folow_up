import axios from 'axios';
import { UserProjectReport } from '../types/userReport'; 
import { ProjectCompletionReports } from '@/types/userProject';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL; 

export async function fetchUserProjectReport(
  userId: string,
  projectId: string,
  
): Promise<UserProjectReport> {
 
  try {
    const response = await axios.get<UserProjectReport>(
      `${API_BASE_URL}/api/UserReports/${userId}/projects/${projectId}/contributions`
     
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.response?.status === 401) {
        throw new Error('Session expired - Please login again');
      }
      
      throw new Error(
        error.response?.data?.message || 
        `API request failed (${error.response?.status})`
      );
    }
    throw new Error('Network error - Please check your connection');
  }
}

export async function FetchProjectById(userId: string , token:string): Promise<ProjectCompletionReports> {
  console.log("Calling API for userId:", userId);
  try {
    const response = await axios.get<ProjectCompletionReports>(
      `${API_BASE_URL}/api/UserReports/${userId}/projects`,{
        headers: {
          Authorization: `Bearer ${token}` // Add authorization header
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching user by ID:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch user details.");
    }
    throw new Error("An unexpected error occurred while fetching user details.");
  }
}
