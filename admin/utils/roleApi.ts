import axios from "axios";
import { RoleData } from "@/types";

// Fetch a single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`/api/roles/${id}`);
  return response.data;
};

// Fetch all roles
export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get("/api/roles");
  return response.data;
};

// Create a new role
export const createRole = async (data: Omit<RoleData, "id">) => {
  const response = await axios.post("/api/roles", data);
  return response.data;
};

// Update an existing role
export const updateRole = async (id: string, data: Omit<RoleData, "id">) => {
  const response = await axios.put(`/api/roles/${id}`, data);
  return response.data;
};

// Delete a role
export const deleteRole = async (id: string) => {
  const response = await axios.delete(`/api/roles/${id}`);
  return response.data;
};

// Fetch all privileges
export const fetchPrivileges = async () => {
  const response = await axios.get("/api/privileges");
  return response.data;
};
