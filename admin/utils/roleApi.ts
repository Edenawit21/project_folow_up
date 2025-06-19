import axios from "axios";
import {
  RoleData,
  RoleApiResponse,
  RolePayload,
  RoleUpdatePayload,
} from "@/types/role";

const ROLE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get<RoleApiResponse>(`${BASE_URL}/api/Role`);
  if (!response.data.success) throw new Error("Failed to fetch roles");
  return response.data.data ?? [];
};

export const createRole = async (payload: RolePayload): Promise<RoleData> => {
  const response = await axios.post(`${BASE_URL}/api/Role`, payload);
  if (!response.data.success) throw new Error("Failed to create role");
  return response.data.data;
};

export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${BASE_URL}/api/Role/${id}`);
  if (!response.data.success) throw new Error("Failed to fetch role");
  return response.data.data;
};
export const updateRole = async (
  id: string,
  data: RolePayload | RoleUpdatePayload
): Promise<RoleData> => {
  const response = await axios.put(`${BASE_URL}/api/Role/${id}`, data);
  if (!response.data.success) throw new Error("Failed to update role");
  return response.data.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  const response = await axios.delete(`${BASE_URL}/api/Role/${id}`);
  if (!response.data.isSuccess) throw new Error("Failed to delete role");
};
