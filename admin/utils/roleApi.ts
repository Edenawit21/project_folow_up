import axios from "axios";
import { RoleData } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to transform role data from API to RoleData type
const transformRoleData = (role: any): RoleData => ({
  id: role.roleId,
  name: role.name,
  description: role.description,
  createdAt: role.createdAt,
  privileges: role.permissions || []
});

// Fetch a single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${BASE_URL}/api/Role/${id}`);
  if (!response.data.success) {
    throw new Error('Failed to fetch role');
  }
  return transformRoleData(response.data.data);
};

// Fetch all roles
export const fetchAllRoles = async (): Promise<RoleData[]> => {
  const response = await axios.get(`${BASE_URL}/api/Role`);
  if (!response.data.success) {
    throw new Error('Failed to fetch roles');
  }
  return response.data.data.map(transformRoleData);
};

// Create a new role
// Update the createRole function to match API expectations
export const createRole = async (data: {
  name: string;
  description: string;
  permissionIds: string[]; // Changed from privilegeId to match API
}) => {
  const response = await axios.post(`${BASE_URL}/api/Role`, {
    name: data.name,
    description: data.description,
    permissionIds: data.permissionIds // Exact API field name
  });
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create role');
  }
  return transformRoleData(response.data.data);
};

// Similarly update updateRole
export const updateRole = async (id: string, data: {
  name: string;
  description: string;
  permissionIds: string[];
}) => {
  const response = await axios.put(`${BASE_URL}/api/Role/${id}`, {
    name: data.name,
    description: data.description,
    permissionIds: data.permissionIds
  });
  // ... rest of the function
};

// Delete a role
export const deleteRole = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/api/Role/${id}`);
  if (!response.data.success) {
    throw new Error('Failed to delete role');
  }
  return response.data;
};

// Fetch all privileges
export const fetchPrivileges = async () => {
  const response = await axios.get(`${BASE_URL}/api/Permission`);
  if (!response.data.success) {
    throw new Error('Failed to fetch privileges');
  }
  return response.data.data; // Adjust this if privileges need transformation
};