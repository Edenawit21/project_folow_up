// src/utils/menuApi.ts
import axios from "axios";
import { MenuItem } from "@/types/menuTypes";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ;

export const fetchMenu = async (token?: string): Promise<MenuItem[]> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axios.get<MenuItem[]>(`${API_URL}/api/Menu/all`, {
    headers,
  });
  return response.data;
};
