import axios from "axios";
import { PrivilegeResponse, PrivilegePayload } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all privileges
export const fetchPrivileges = async (): Promise<PrivilegeResponse[]> => {
  const response = await axios.get(`${API_URL}/api/Permission`);
  
  if (!response.data.success) {
    throw new Error('Failed to fetch privileges');
  }
  
  return response.data.data; // Access the data array directly from the response
};

// Fetch single privilege by ID
export const fetchPrivilegeById = async (
  id: string
): Promise<PrivilegeResponse> => {
  const response = await axios.get(`${API_URL}/api/Permission/${id}`);
  
  if (!response.data.success) {
    throw new Error('Failed to fetch privilege');
  }
  
  return response.data.data; // Return the data property
};

// Create a new privilege
export const createPrivilege = async (
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.post(`${API_URL}/api/Permission`, data);
  
  if (!response.data.success) {
    throw new Error('Failed to create privilege');
  }
  
  return response.data.data;
};

// Update an existing privilege
export const updatePrivilege = async (
  id: string,
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.put(`${API_URL}/api/Permission/${id}`, data); // Fixed the URL template literal
  
  if (!response.data.success) {
    throw new Error('Failed to update privilege');
  }
  
  return response.data.data;
};

// Delete a privilege
export const deletePrivilege = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/api/Permission/${id}`); // Fixed the URL template literal
  
  if (!response.data.success) {
    throw new Error('Failed to delete privilege');
  }
};