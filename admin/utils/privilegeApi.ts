import axios from "axios";
import { PrivilegeResponse, PrivilegePayload } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all privileges
export const fetchPrivileges = async (): Promise<PrivilegeResponse[]> => {
  const response = await axios.get(`${API_URL}/api/Permission`);
  return response.data.value;
};

// Fetch single privilege by ID
export const fetchPrivilegeById = async (
  id: string
): Promise<PrivilegeResponse> => {
  const response = await axios.get(`${API_URL}/api/Permission/${id}`);
  return response.data;
};

// Create a new privilege
export const createPrivilege = async (
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.post(`${API_URL}/api/Permission`, data);
  return response.data;
};
// Update a privilege
export const updatePrivilege = async (
  id: string,
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.put(`${API_URL}/api/Permission/${id}`, data);
  return response.data;
};
// Delete a privilege
export const deletePrivilege = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/Permission/${id}`);
};
