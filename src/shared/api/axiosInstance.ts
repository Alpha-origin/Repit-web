import axios from 'axios';

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { deleteCookie, getCookie, setAccessToken } from '@/shared/util/cookie';

const resolveAuthServerUrl = (url?: string) => {
  if (!url) return '';

  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  return normalizedUrl.replace(/\/+$/, '');
};

export const AUTH_SERVER_URL = resolveAuthServerUrl(import.meta.env.VITE_AUTH_URL);

export const buildAuthUrl = (path: string) => {
  if (!AUTH_SERVER_URL) {
    return path;
  }

  return `${AUTH_SERVER_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const publicInstance: AxiosInstance = axios.create({
  baseURL: AUTH_SERVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

publicInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const clearTokens = () => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getCookie("refreshToken");

    if (!refreshToken) return null;

    const response = await axios.post(
      buildAuthUrl('/auth/refresh'),
      { refreshToken },
      { withCredentials: true },
    );

    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) return null;

    setAccessToken(newAccessToken);

    return newAccessToken;
  } catch {
    clearTokens();
    return null;
  }
};

publicInstance.interceptors.response.use(
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

      return publicInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default publicInstance;
