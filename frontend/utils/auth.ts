// utils/auth.ts
import axios from "axios";

// Base URL of your ASP.NET API
const API_URL = "http://localhost:5161/api/Auth";

// Login function to handle user authentication
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid credentials. Please try again.");
  }
};

// Signup function for new user registration
export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      displayName: name,
      email,
      password,
    });

    console.log("Signup response:", response);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      console.error("Signup API error:", response.data);
      throw new Error(response.data.message || "Signup failed.");
    }
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to register. Please try again."
    );
  }
};


// Function to retrieve token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Function to check authentication status
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
};
