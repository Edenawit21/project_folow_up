import axios from "axios";
import { User } from "@/types"; // Optional: if you're using typed data

const USER_API_URL = process.env.BASE_API_URL;

// GET /api/User
export const getUsers = async () => {
  const response = await axios.get(`${USER_API_URL}/api/User`);
  return response.data;
};

// GET /api/User/{id}
export const fetchUserById = async (userId: string) => {
  const res = await axios.get(`${USER_API_URL}/api/User/${userId}`);
  return res.data.data;
};

// POST /api/User
export const registerUser = async (userData: Partial<User>) => {
  const res = await axios.post(`${USER_API_URL}/api/User`, userData);
  return res.data.data;
};

//  PUT /api/User/{id}
export const updateUser = async (userId: string, userData: Partial<User>) => {
  const res = await axios.put(`${USER_API_URL}/api/User/${userId}`, userData);
  return res.data.data;
};

//  DELETE /api/User/{id}
export const deleteUser = async (userId: string) => {
  const res = await axios.delete(`${USER_API_URL}/api/User/${userId}`);
  if (!res.data.success) throw new Error("Failed to delete user.");
  return res.data;
};
