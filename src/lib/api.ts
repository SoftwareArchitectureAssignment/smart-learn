import Axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import { AuthError } from "@/types/error.type";

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

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle auth errors
      if (status === 401) {
        throw new AuthError(data.message, status);
      }
    }

    // Re-throw original error for other status codes
    throw error;
  },
);

// Define the SafeExecResult types
type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type SafeExecResult<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

// Safe execution function with method overloads
async function safeExec<T, E extends Error = Error>(
  config: AxiosRequestConfig,
  mapper: (data: any) => T = (data) => data as T,
): Promise<SafeExecResult<T, E>> {
  try {
    const response = await apiInstance.request(config);
    return [mapper(response.data), null] as const;
  } catch (error: any) {
    if (error instanceof AuthError) {
      return [null, error as unknown as E] as const;
    }

    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || `Request failed with status code ${status}`;
      return [null, new Error(errorMessage) as E] as const;
    }

    console.log(error);
    return [null, new Error("Network error: Please check your connection") as E] as const;
  }
}

// Extend the api object with safeExec
const api = Object.assign(apiInstance, { safeExec });
export default api;
