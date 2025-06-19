import axios from "axios";
import { RoleData, RoleApiResponse } from "@/types/role";

const ROLE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const {status,data} = await axios.get<RoleApiResponse>(`${ROLE_API_URL}/api/Role`);

  if (status !== 200 || !data.success) {``
      throw new Error("Failed to fetch permission");
    }

 // Handle both single project and array responses
    const role = Array.isArray(data.data) ? data.data : [data.data];
    return role;
};

// Fetch single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${ROLE_API_URL}/api/Role/${id}`);
  if (!response.data.success) {
    throw new Error("Failed to fetch role");
  }
  return response.data.data;
};

// Create new role
export const createRole = async (
  data: Omit<RoleData, "roleId">
): Promise<RoleData> => {
  const response = await axios.post(`${ROLE_API_URL}/api/Role`, data);
  if (!response.data.success) {
    throw new Error("Failed to create role");
  }
  return response.data.data;
};

// Update role by ID
export const updateRole = async (
  id: string,
  data: Omit<RoleData, "roleId">
): Promise<RoleData> => {
  const response = await axios.put(`${ROLE_API_URL}/api/Role/${id}`, data);
  if (!response.data.success) {
    throw new Error("Failed to update role");
  }
  return response.data.data;
};

// Delete role by ID
export const deleteRole = async (id: string): Promise<void> => {
  const response = await axios.delete(`${ROLE_API_URL}/api/Role/${id}`);
  if (!response.data.success) {
    throw new Error("Failed to delete role");
  }
};
