import axios from "axios";

const API_URL = "http://localhost:5263/api/Account";

// --- Login types ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  error: any;
  token: string;
}

export const login = async (username: string, password: string, data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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

// --- Register types ---
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterRequest) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed.");
    }
    throw error;
  }
};

// --- Assign Role types ---
export interface AssignRoleRequest {
  username: string;
  role: string;
}

export const assignRole = async (data: AssignRoleRequest) => {
  try {
    const response = await axios.post(`${API_URL}/assign-role`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Assign role failed.");
    }
    throw error;
  }
};
