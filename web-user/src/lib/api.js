import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", // Relative path via proxy
  withCredentials: true, // Essential for session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, config) => client.get(url, config),
  post: (url, data, config) => client.post(url, data, config),
  put: (url, data, config) => client.put(url, data, config),
  delete: (url, config) => client.delete(url, config),
};
