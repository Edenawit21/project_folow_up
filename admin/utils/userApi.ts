import axios from "axios";
import { UserForm } from "@/types";

// Register a new user
export const registerUser = async (userData: UserForm) => {
  const response = await axios.post(
    "http://localhost:5263//api/Account/register",
    userData
  );
  return response.data;
};

// Update an existing user by ID
export const updateUser = async (
  userId: string,
  userData: Partial<UserForm>
) => {
  const response = await axios.put(`/api/users/${userId}`, userData);
  return response.data;
};

// Additional helper to get users list (used in your UserList component)
export const getUsers = async (p0: { token: string | undefined }) => {
  const response = await axios.get("/api/users");
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (
  userId: string,
  p0: { token: string | undefined }
) => {
  const response = await axios.delete(`/api/users/${userId}`);
  return response.data;
};

// Export a single userService object for convenience
export const userService = {
  registerUser,
  updateUser,
  getUsers,
  deleteUser,
};
