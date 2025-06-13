import { Permission, PermissionApiResponse } from "@/types/privilege";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPermissions = async (): Promise<Permission[]> => {
  const response = await axios.get<PermissionApiResponse>(
    `${BASE_URL}/api/Permission`
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch permissions");
  }

  return response.data.data;
};

// Get permission by ID
export const getPermissionById = async (id: string): Promise<Permission> => {
  const response = await axios.get(`${BASE_URL}/api/Permission/${id}`);

  if (!response.data.isSuccess) {
    throw new Error("Failed to fetch permission by ID");
  }

  return response.data.value;
};

// Create a new permission
export const createPermission = async (
  permission: Omit<Permission, "id">
): Promise<Permission> => {
  const response = await axios.post(`${BASE_URL}/api/Permission`, permission);

  if (!response.data.isSuccess) {
    throw new Error("Failed to create permission");
  }

  return response.data.value;
};

// Update an existing permission
export const updatePermission = async (
  id: string,
  permission: Partial<Permission>
): Promise<Permission> => {
  const response = await axios.put(
    `${BASE_URL}/api/Permission/${id}`,
    permission
  );

  if (!response.data.isSuccess) {
    throw new Error("Failed to update permission");
  }

  return response.data.value;
};

// Delete a permission
export const deletePermission = async (id: string): Promise<void> => {
  const response = await axios.delete(`${BASE_URL}/api/Permission/${id}`);

  if (!response.data.isSuccess) {
    throw new Error("Failed to delete permission");
  }
};
