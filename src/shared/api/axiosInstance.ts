import axios from "axios";

import type {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearAccessToken,
  getAccessToken,
  syncAccessTokenFromResponse,
} from "./accessToken";

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
    const response = await authInstance.post("/api/v1/auth/refresh");
    syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });
    return true;
  } catch {
    return false;
  }
};

const addAuthorizationInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const authorizationHeader = getAccessToken();

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

const addAccessTokenSyncInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use((response) => {
    syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });

    return response;
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
        clearAccessToken();
        goToLoginPage();
      }

      return Promise.reject(error);
    },
  );
};

addAccessTokenSyncInterceptor(authInstance);
addAccessTokenSyncInterceptor(apiInstance);
addAccessTokenSyncInterceptor(chatInstance);
addRefreshInterceptor(apiInstance);
addRefreshInterceptor(chatInstance);
addAuthorizationInterceptor(apiInstance);
addAuthorizationInterceptor(chatInstance);
