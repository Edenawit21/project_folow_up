import axios, { AxiosError } from "axios";
import { LoginRequest, LoginResponse } from "@/types/login";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
  throw new Error("API base URL is not defined");
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/Account/login`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    console.error("Axios error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
