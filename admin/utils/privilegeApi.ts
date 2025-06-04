import axios from "axios";

import { PrivilegeResponse, PrivilegePayload } from "@/types";

// 🔹 Fetch all privileges
export const fetchPrivileges = async (): Promise<PrivilegeResponse[]> => {
  const response = await axios.get("/api/privileges");
  return response.data;
};

// 🔹 Fetch single privilege by ID
export const fetchPrivilegeById = async (
  id: number
): Promise<PrivilegeResponse> => {
  const response = await axios.get(`/api/privileges/${id}`);
  return response.data;
};

// 🔹 Create a new privilege
export const createPrivilege = async (
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.post("/api/privileges", data);
  return response.data;
};

// 🔹 Update an existing privilege
export const updatePrivilege = async (
  id: number,
  data: PrivilegePayload
): Promise<PrivilegeResponse> => {
  const response = await axios.put(`/api/privileges/${id}`, data);
  return response.data;
};

// 🔹 Delete a privilege
export const deletePrivilege = async (id: number): Promise<void> => {
  await axios.delete(`/api/privileges/${id}`);
};
