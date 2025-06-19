import axios from "axios";
import { Permission, PermissionApiResponse } from "@/types/privilege";

const PERMISSION_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

//  Fetch all permissions
export const fetchAllPermissions = async (): Promise<Permission[]> => {
  const {data,status} = await axios.get<PermissionApiResponse>(
    `${PERMISSION_API_URL}/api/Permission`
  );

    if (status !== 200 || !data.success) {
      throw new Error("Failed to fetch permission");
    }

 // Handle both single project and array responses
    const permission = Array.isArray(data.data) ? data.data : [data.data];
    return permission;
};

// Get permission by ID
export const getPermissionById = async (id: string): Promise<Permission> => {
  const response = await axios.get(`${PERMISSION_API_URL}/api/Permission/${id}`);

  if (!response.data.isSuccess) {
    throw new Error("Failed to fetch permission by ID");
  }

  return response.data.value;
};

// Create a new permission
export const createPermission = async (
  permission: Omit<Permission, "id">
): Promise<Permission> => {
  const response = await axios.post(`${PERMISSION_API_URL}/api/Permission`, permission);

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
  const response = await axios.put(`${PERMISSION_API_URL}/api/Permission/${id}`,permission);

  if (!response.data.isSuccess) {
    throw new Error("Failed to update permission");
  }

  return response.data.value;
};

// Delete a permission
export const deletePermission = async (id: string): Promise<void> => {
  const response = await axios.delete(`${PERMISSION_API_URL}/api/Permission/${id}`);

  if (!response.data.isSuccess) {
    throw new Error("Failed to delete permission");
  }
};
