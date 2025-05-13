import axios from "axios";

const API_URL = "http://localhost:5161/api/JiraTest";

export const FetchProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error: any) {
    console.error("FetchProjects error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch projects. Please try again."
    );
  }
};
