import axios from "axios";
import {
  UserData,
  CreateUserDto,
  UpdateUserDto,
  RegisterUserResponse,
  UserFilterDto,
  PagedList,
} from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getUsers = async (filter: UserFilterDto): Promise<PagedList<UserData>> => {
  try{ 
  
  const response = await axios.get<{
    
     items: UserData[];
      totalCount: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
  }>(`${API_BASE}/api/User`,{
    params:filter
  });
  if (response.status !== 200) {
      // You might want to get a more specific error message from response.data if available
      throw new Error(`Failed to fetch users: Server responded with status ${response.status}`);
    }
console.log("API Response:", response.data);
  if (!response.data || !response.data) {
        console.warn("API returned 200 OK but data.data was null or undefined. Returning empty PagedList.");
        return {
            items: [],
            totalCount: 0,
            pageNumber: filter.PageNumber ?? 1,
            pageSize: filter.PageSize ?? 10,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false
        };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
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
