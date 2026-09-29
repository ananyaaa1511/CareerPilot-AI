import axios from "axios";
import { getToken } from "./auth/storage";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token && !config.url?.startsWith("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function signInWithGoogle(credential) {
  const response = await API.post("/auth/google", { credential });
  return response.data;
}

export async function uploadResume(file) {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await API.post("/resume/extract", formData);

  return response.data;
}

export async function analyzeResume(data) {
  const response = await API.post("/analyze", data);

  return response.data;
}

export default API;
