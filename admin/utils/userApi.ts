import axios from "axios";
import {
  UserData,
  CreateUserDto,
  UpdateUserDto,
  RegisterUserResponse,
} from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getUsers = async (): Promise<UserData[]> => {
  const response = await axios.get<UserData[]>(`${API_BASE}/api/User`);
  if (!response.data) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
};

export const fetchUserById = async (id: string): Promise<UserData> => {
  const response = await axios.get<UserData>(`${API_BASE}/api/User/${id}`);
  return response.data;
};

export const registerUser = async (
  userData: CreateUserDto
): Promise<RegisterUserResponse> => {
  const { data } = await axios.post<RegisterUserResponse>(
    `${API_BASE}/api/User/local`,
    userData
  );
  return data;
};

export const updateUser = async (
  id: string,
  userData: UpdateUserDto
): Promise<UserData | null> => {
  const response = await axios.put(`${API_BASE}/api/User/${id}`, userData);

  if (response.status === 204) {
    return null;
  }
  return response.data;
};
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/api/User/${id}`);
};
