import axios from "axios";

const API_URL = "http://localhost:5263/api/Account";

// --- Login types ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// --- Register types ---
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterRequest) => {
  return axios.post(`${API_URL}/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// --- Assign Role types ---
export interface AssignRoleRequest {
  username: string;
  role: string;
}

export const assignRole = async (data: AssignRoleRequest) => {
  return axios.post(`${API_URL}/assign-role`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
