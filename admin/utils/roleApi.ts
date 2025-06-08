import axios from "axios";
import { RoleData } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch a single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${BASE_URL}/api/Role/${id}`);
  return response.data;
};

// Fetch all roles
export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get(`${BASE_URL}/api/Role`);
  return response.data;
};

// Create a new role
export const createRole = async (data: Omit<RoleData, "id">) => {
  const response = await axios.post(`${BASE_URL}/api/Role`, data);
  return response.data;
};

// Update an existing role
export const updateRole = async (id: string, data: Omit<RoleData, "id">) => {
  const response = await axios.put(`${BASE_URL}/api/Role/${id}`, data);
  return response.data;
};

// Delete a role
export const deleteRole = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/api/Role/${id}`);
  return response.data;
};

// Fetch all privileges
export const fetchPrivileges = async () => {
  const response = await axios.get(`${BASE_URL}/api/Permission`);
  return response.data;
};
