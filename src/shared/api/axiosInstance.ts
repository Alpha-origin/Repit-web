import axios from "axios";
import Cookies from "js-cookie";

import type {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const resolveServerUrl = (url?: string) => {
  if (!url) return "";

  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  return normalizedUrl.replace(/\/+$/, "");
};

const AUTH_TOKEN_STORAGE_KEYS = [
  "accessToken",
  "ACCESS_TOKEN",
  "authorization",
  "Authorization",
  "authToken",
  "token",
] as const;

const normalizeAuthorizationValue = (value?: string | null) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return /^Bearer\s+/i.test(trimmedValue)
    ? trimmedValue
    : `Bearer ${trimmedValue}`;
};

const getAuthorizationHeader = () => {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of AUTH_TOKEN_STORAGE_KEYS) {
    const storageValue =
      window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    const normalizedStorageValue = normalizeAuthorizationValue(storageValue);

    if (normalizedStorageValue) {
      return normalizedStorageValue;
    }

    const cookieValue = Cookies.get(key);
    const normalizedCookieValue = normalizeAuthorizationValue(cookieValue);

    if (normalizedCookieValue) {
      return normalizedCookieValue;
    }
  }

  return null;
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
    await authInstance.post("/api/v1/auth/refresh");
    return true;
  } catch {
    return false;
  }
};

const addAuthorizationInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const authorizationHeader = getAuthorizationHeader();

    if (!authorizationHeader) {
      return config;
    }

    const nextHeaders = axios.AxiosHeaders.from(
      config.headers,
    ) as AxiosHeaders;

    if (!nextHeaders.has("Authorization")) {
      nextHeaders.set("Authorization", authorizationHeader);
    }

    config.headers = nextHeaders;

    return config;
  });
};

const addRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

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
addAuthorizationInterceptor(apiInstance);
addAuthorizationInterceptor(chatInstance);
