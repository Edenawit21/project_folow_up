import axios from "axios";
import { RoleData, RoleApiResponse, RolePayload } from "@/types/role";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get<RoleApiResponse>(`${BASE_URL}/api/Role`);

  if (!response.data.success) {
    throw new Error("Failed to fetch roles");
  }

  return response.data.data ?? [];
};
// Create new role
export const createRole = async (data: RolePayload): Promise<RoleData> => {
  const response = await axios.post(`${BASE_URL}/api/Role`, data);

  if (!response.data.success) {
    throw new Error("Failed to create role");
  }

  return response.data.data;
};

// Fetch single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${BASE_URL}/api/Role/${id}`);
  if (!response.data.success) {
    throw new Error("Failed to fetch role");
  }
  return response.data.data;
};

// Update role by ID
export const updateRole = async (
  id: string,
  data: Omit<RoleData, "roleId">
): Promise<RoleData> => {
  const response = await axios.put(`${BASE_URL}/api/Role/${id}`, data);
  if (!response.data.success) {
    throw new Error("Failed to update role");
  }
  return response.data.data;
};

// Delete role by ID
// export const deleteRole = async (id: string): Promise<void> => {
//   const response = await axios.delete(`${BASE_URL}/api/Role/${id}`);
//   if (!response.data.success) {
//     throw new Error("Failed to delete role");
//   }
// };

export const deleteRole = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/Role/{id}`);
    response.data;
  } catch {
    throw new Error("Failed to delete role");
  }
};
