import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function isAuthLoginRequest(url?: string) {
  return typeof url === "string" && url.includes("/auth/login");
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("bsi_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url as string | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && !isAuthLoginRequest(requestUrl)) {
      localStorage.removeItem("bsi_token");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
