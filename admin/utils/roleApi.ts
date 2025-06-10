import axios from "axios";
import { RoleData, ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch a single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${BASE_URL}/api/Role/${id}`);
  return response.data;
};

// Fetch all roles - returns ApiResponse wrapper
export const fetchAllRoles = async (): Promise<ApiResponse> => {
  const response = await axios.get(`${BASE_URL}/api/Role`);
  return response.data;
};

// Fetch all roles - returns just RoleData[] extracted from ApiResponse.value
export const fetchAllRolesList = async (): Promise<RoleData[]> => {
  const apiResponse = await fetchAllRoles();
  return apiResponse.value ?? [];
};

// Create a new role - returns the created RoleData
export const createRole = async (
  data: Omit<RoleData, "roleId">
): Promise<RoleData> => {
  const response = await axios.post(`${BASE_URL}/api/Role`, data);
  return response.data.value;
};

// Update an existing role - returns updated RoleData
export const updateRole = async (
  id: string,
  data: Omit<RoleData, "roleId">
): Promise<RoleData> => {
  const response = await axios.put(`${BASE_URL}/api/Role/${id}`, data);
  return response.data.value;
};

// Delete a role - returns any confirmation or status from backend
export const deleteRole = async (id: string): Promise<any> => {
  const response = await axios.delete(`${BASE_URL}/api/Role/${id}`);
  return response.data;
};
