import axios from "axios";

export interface UserForm {
  username: string;
  email?: string;
  password?: string;
  roles: string[];
}

// Register a new user
export const registerUser = async (userData: UserForm) => {
  const response = await axios.post("/api/users", userData);
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

// Get users list
export const getUsers = async (params?: { token?: string }) => {
  const response = await axios.get("/api/users");
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (userId: string, params?: { token?: string }) => {
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
