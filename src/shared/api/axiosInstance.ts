import axios from "axios";

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const resolveServerUrl = (url?: string) => {
  if (!url) return "";

  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  return normalizedUrl.replace(/\/+$/, "");
};

export const AUTH_URL = resolveServerUrl(import.meta.env.VITE_AUTH_URL);
export const API_URL = resolveServerUrl(import.meta.env.VITE_API_URL);
export const CHAT_URL = resolveServerUrl(import.meta.env.VITE_CHAT_URL);

export const authInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const chatInstance = axios.create({
  baseURL: CHAT_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const goToLoginPage = () => {
  window.location.href = "/login";
};

const tryRefreshSession = async () => {
  try {
    await authInstance.post("/auth/refresh");
    return true;
  } catch {
    return false;
  }
};

const addRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const refreshed = await tryRefreshSession();

        if (refreshed) {
          return instance(originalRequest);
        }
      }

      if (error.response?.status === 401) {
        goToLoginPage();
      }

      return Promise.reject(error);
    },
  );
};

addRefreshInterceptor(apiInstance);
addRefreshInterceptor(chatInstance);
