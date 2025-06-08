import axios from "axios";
import { LoginRequest } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/Account/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password.");
      }
      throw new Error(error.response?.data?.message || "Login failed.");
    }
    throw error;
  }
};
