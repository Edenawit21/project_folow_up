import axios from "axios";
import { UserForm } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Register a new user
export const registerUser = async (userData: UserForm) => {
  const response = await axios.post(
    `${BASE_URL}/api/Account/register`,
    userData
  );
  return response.data;
};

// Update an existing user by ID
export const updateUser = async (
  userId: string,
  userData: Partial<UserForm>
) => {
  const response = await axios.put(`${BASE_URL}/api/users/${userId}`, userData);
  return response.data;
};

// Get users list with Authorization header
export const getUsers = async ({ token }: { token?: string }) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await axios.get(`${BASE_URL}/api/Admin/users-with-roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a user by ID with Authorization header
export const deleteUser = async (
  userId: string,
  { token }: { token?: string }
) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await axios.delete(`${BASE_URL}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Export userService object for convenience
export const userService = {
  registerUser,
  updateUser,
  getUsers,
  deleteUser,
};
