import axios from "axios";
import { UserData } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/User
export const getUsers = async (): Promise<UserData[]> => {
  const response = await axios.get(`${API_BASE}/api/User`);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch users");
  }
  return response.data.data;
};

// GET /api/User/{id}
export const fetchUserById = async (userId: string): Promise<UserData> => {
  const response = await axios.get(`${API_BASE}/api/User/${userId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user");
  }
  return response.data.data;
};

// POST /api/User
export const registerUser = async (
  userData: Partial<UserData>
): Promise<UserData> => {
  const response = await axios.post(`${API_BASE}/api/User`, userData);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to register user");
  }
  return response.data.data;
};

// PUT /api/User/{id}
export const updateUser = async (
  userId: string,
  userData: Partial<UserData>
): Promise<UserData> => {
  const response = await axios.put(`${API_BASE}/api/User/${userId}`, userData);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update user");
  }
  return response.data.data;
};

// DELETE /api/User/{id}
export const deleteUser = async (userId: string): Promise<void> => {
  const response = await axios.delete(`${API_BASE}/api/User/${userId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete user");
  }
};
