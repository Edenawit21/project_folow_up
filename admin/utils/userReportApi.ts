// src/utils/api.ts (or similar)
import axios from 'axios';
import { UserProjectReport } from '../types/userReport'; // Adjust path as needed

// Assuming your API is running on localhost:5001 or similar for .NET
// Make sure this base URL matches your backend's address.
const API_BASE_URL = 'http://localhost:5001/api'; // <--- IMPORTANT: Verify your backend port

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