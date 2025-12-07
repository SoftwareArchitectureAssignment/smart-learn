import Axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { isPublicRoute, navigate } from "@/lib/navigation";

const apiInstance: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response) {
      const { status } = error.response;

      // Handle auth errors
      if (status === 401) {
        if (!window.location.pathname.startsWith("/sign-in") && !isPublicRoute(window.location.pathname)) {
          if (!isRefreshing) {
            isRefreshing = true;
            localStorage.removeItem("accessToken");
            toast.error("Session expired. Please log in again.", { duration: 3000 });
            navigate("/login");
            setTimeout(() => {
              isRefreshing = false;
            }, 1000);
          }
        }
      }
    }

    // Return original error for other status codes
    return Promise.reject(error);
  },
);

// Define the SafeExecResult types
type SuccessResult<T> = readonly [T, null, string];
type ErrorResult<E = Error> = readonly [null, E, string];
type SafeExecResult<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

// Safe execution function with method overloads
async function safeExec<T, E extends Error = Error>(
  config: AxiosRequestConfig,
  mapper: (data: any) => T = (data) => data as T,
): Promise<SafeExecResult<T, E>> {
  try {
    const response = await apiInstance.request(config);
    return [mapper(response.data), null, response.data?.message || "Operation completed successfully."] as const;
  } catch (error: any) {
    if (error.response) {
      const { status = 400, data } = error.response;
      const errorMessage = data?.message || `Request failed with status code ${status}`;
      return [null, new Error(errorMessage) as E, errorMessage] as const;
    }

    const errorMessage = error.message || "Network error: Please check your connection";
    return [null, new Error(errorMessage) as E, errorMessage] as const;
  }
}

// Extend the api object with safeExec
const api = Object.assign(apiInstance, { safeExec });
export default api;
