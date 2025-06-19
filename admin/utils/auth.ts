import axios from "axios";
import { LoginRequest, LoginResponse } from "@/types/login";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/Account/api/account/login`, // use template literal with variable
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Axios error:", error.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};
