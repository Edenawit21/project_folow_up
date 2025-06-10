import axios from "axios";
import { User } from "@/types"; // Optional: if you're using typed data

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/User
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE}/api/User`);
  return response.data;
};

// GET /api/User/{id}
export const getUserById = async (userId: string) => {
  const res = await axios.get(`${API_BASE}/api/User/${userId}`);
  if (!res.data.success) throw new Error("Failed to fetch user.");
  return res.data.data;
};

// POST /api/User
export const registerUser = async (userData: Partial<User>) => {
  const res = await axios.post(`${API_BASE}/api/User`, userData);
  if (!res.data.success) throw new Error("Failed to register user.");
  return res.data.data;
};

//  PUT /api/User/{id}
export const updateUser = async (userId: string, userData: Partial<User>) => {
  const res = await axios.put(`${API_BASE}/api/User/${userId}`, userData);
  if (!res.data.success) throw new Error("Failed to update user.");
  return res.data.data;
};

//  DELETE /api/User/{id}
export const deleteUser = async (userId: string) => {
  const res = await axios.delete(`${API_BASE}/api/User/${userId}`);
  if (!res.data.success) throw new Error("Failed to delete user.");
  return res.data;
};
