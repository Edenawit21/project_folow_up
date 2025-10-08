import axios from "axios";
import {
  UserData,
  CreateUserDto,
  UpdateUserDto,
  RegisterUserResponse,
  UserFilterDto,
  PagedList,
} from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL ?? "";
if (!API_BASE) {
  console.warn(
    "⚠️ Environment variable NEXT_PUBLIC_BASE_API_URL is not defined!"
  );
}

export const getUsers = async (
  filter: UserFilterDto
): Promise<PagedList<UserData>> => {
  try {
    const response = await axios.get<UserData[]>(`${API_BASE}/api/User`, {
      params: filter,
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch users: Server responded with status ${response.status}`
      );
    }

    const usersArray = Array.isArray(response.data) ? response.data : [];

    // Optional: implement simple paging info if needed
    const pageNumber = filter.PageNumber ?? 1;
    const pageSize = filter.PageSize ?? usersArray.length;

    return {
      items: usersArray,
      totalCount: usersArray.length,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(usersArray.length / pageSize),
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber * pageSize < usersArray.length,
    };
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return {
      items: [],
      totalCount: 0,
      pageNumber: filter.PageNumber ?? 1,
      pageSize: filter.PageSize ?? 10,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
};

export const fetchUserById = async (id: string): Promise<UserData> => {
  try {
    const response = await axios.get<UserData>(`${API_BASE}/api/User/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const registerUser = async (
  userData: CreateUserDto
): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post<RegisterUserResponse>(
      `${API_BASE}/api/User/local`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error registering user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: UpdateUserDto
): Promise<UserData | null> => {
  try {
    const response = await axios.put(`${API_BASE}/api/User/${id}`, userData);
    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error(`❌ Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE}/api/User/${id}`);
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error(`❌ Error deleting user with ID ${id}:`, error);
    throw error;
  }
};
