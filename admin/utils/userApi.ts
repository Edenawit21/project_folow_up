import axios from "axios";
import {
  UserData,
  UserResponse,
  SingleUserResponse,
  CreateUserDto,
  UpdateUserDto,
} from "@/types/user";

const USER_API_URL = process.env.BASE_API_URL;

// GET /api/User - fetch all users
export const getUsers = async (): Promise<UserData[]> => {
  const response = await axios.get<UserData[]>(`${API_BASE}/api/User`);
  if (!response.data) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
};


// GET /api/User/{id} - fetch a single user
export const fetchUserById = async (id: string): Promise<UserData> => {
  const response = await axios.get<SingleUserResponse>(
    `${API_BASE}/api/User/${id}`
  );

  return response.data.data;


// POST /api/User - create new user
export const registerUser = async (
  userData: CreateUserDto
): Promise<UserData> => {
  const { data } = await axios.post<UserData>(
    `${API_BASE}/api/User/local`,
    userData
  );
  return data;
};

// PUT /api/User/{id} - update user
export const updateUser = async (
  id: string,
  userData: UpdateUserDto
): Promise<UserData> => {
  const response = await axios.put<SingleUserResponse>(
    `${API_BASE}/api/User/${id}`,
    userData
  );
  if (!response.data.isSuccess) {
    throw new Error("Failed to update user");
  }
  return response.data.data;
};

// DELETE /api/User/{id} - delete user
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/api/User/${id}`);
};
