import axios from "axios";

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from "./token";

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

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) return null;

    const response = await authInstance.post("/auth/refresh", {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) return null;

    saveAccessToken(newAccessToken);

    return newAccessToken;
  } catch {
    clearTokens();
    return null;
  }
};

const applyAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = getAccessToken();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

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

        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          clearTokens();
          window.location.href = "/login";

          return Promise.reject(error);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      }

      return Promise.reject(error);
    },
  );
};

applyAuthInterceptor(authInstance);
applyAuthInterceptor(apiInstance);
applyAuthInterceptor(chatInstance);