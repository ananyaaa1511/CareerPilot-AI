import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

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