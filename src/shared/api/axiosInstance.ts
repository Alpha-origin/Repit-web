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
import { AUTH_REQUIRED_MESSAGE } from "./errorMessage";

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
  headers: { "Content-Type": "application/json" },
});

export const apiInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "" : API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const chatInstance = axios.create({
  baseURL: CHAT_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const refreshInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const LOGIN_PATH = "/login";
const AUTH_PAGE_PATHS = [LOGIN_PATH, "/signup"];

const goToLoginPage = () => {
  if (AUTH_PAGE_PATHS.includes(window.location.pathname)) {
    return;
  }

  window.location.href = LOGIN_PATH;
};

// 토큰 누락과 만료가 모두 401로 통일됐으므로 두 경우를 같은 흐름으로 정리한다.
export const handleAuthenticationFailure = () => {
  clearAccessToken();
  goToLoginPage();
};

const requestRefreshSession = async () => {
  try {
    const response = await refreshInstance.post("/api/v1/auth/refresh");
    const refreshedAccessToken = syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });
    return Boolean(refreshedAccessToken);
  } catch {
    return false;
  }
};

// 모든 요청이 토큰을 요구하게 되면서 재발급이 동시에 여러 번 호출될 수 있어,
// 진행 중인 요청 하나를 공유한다.
let refreshSessionPromise: Promise<boolean> | null = null;

const tryRefreshSession = () => {
  if (!refreshSessionPromise) {
    refreshSessionPromise = requestRefreshSession().finally(() => {
      refreshSessionPromise = null;
    });
  }

  return refreshSessionPromise;
};

const getReadyAccessToken = async (shouldRefreshBeforeRequest: boolean) => {
  const currentAccessToken = getAccessToken();
  if (currentAccessToken || !shouldRefreshBeforeRequest) {
    return currentAccessToken;
  }

  const refreshed = await tryRefreshSession();
  return refreshed ? getAccessToken() : null;
};

export const ensureAccessToken = async () => {
  const authorizationHeader = await getReadyAccessToken(true);

  if (!authorizationHeader) {
    handleAuthenticationFailure();
    throw new Error(AUTH_REQUIRED_MESSAGE);
  }

  return authorizationHeader;
};

const addAuthorizationInterceptor = (
  instance: AxiosInstance,
  options: { refreshBeforeRequest?: boolean; requireAccessToken?: boolean } = {},
) => {
  instance.interceptors.request.use(async (config) => {
    const authorizationHeader = await getReadyAccessToken(
      options.refreshBeforeRequest ?? false,
    );

    // 서버가 모든 엔드포인트에서 토큰을 요구하므로, 헤더 없이 보내면 401만 돌아온다.
    if (!authorizationHeader) {
      if (!options.requireAccessToken) return config;

      handleAuthenticationFailure();
      throw new Error(AUTH_REQUIRED_MESSAGE);
    }

    const nextHeaders = axios.AxiosHeaders.from(config.headers) as AxiosHeaders;
    if (!nextHeaders.has("Authorization")) {
      nextHeaders.set("Authorization", authorizationHeader);
    }
    config.headers = nextHeaders;
    return config;
  });
};

const addFormDataInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    if (!(config.data instanceof FormData)) {
      return config;
    }

    const nextHeaders = axios.AxiosHeaders.from(
      config.headers,
    ) as AxiosHeaders;
    nextHeaders.delete("Content-Type");
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

// 세션 없이 호출되는 엔드포인트. 여기서 온 401은 만료가 아니라 인증 실패이므로
// 재발급을 시도하거나 로그인 페이지로 되돌리면 안 된다.
const SESSIONLESS_AUTH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/signup",
  "/api/v1/auth/refresh",
];

const isSessionlessAuthRequest = (config?: RetryableRequestConfig) => {
  const requestUrl = config?.url ?? "";

  return SESSIONLESS_AUTH_PATHS.some((path) => requestUrl.includes(path));
};

const addRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;
      const isSessionlessRequest = isSessionlessAuthRequest(originalRequest);

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isSessionlessRequest
      ) {
        originalRequest._retry = true;
        const refreshed = await tryRefreshSession();
        if (refreshed) {
          const nextHeaders = axios.AxiosHeaders.from(
            originalRequest.headers,
          ) as AxiosHeaders;
          nextHeaders.delete("Authorization");
          originalRequest.headers = nextHeaders;

          return instance(originalRequest);
        }
      }

      if (error.response?.status === 401 && !isSessionlessRequest) {
        handleAuthenticationFailure();
      }
      return Promise.reject(error);
    },
  );
};

addAccessTokenSyncInterceptor(authInstance);
addAccessTokenSyncInterceptor(apiInstance);
addAccessTokenSyncInterceptor(chatInstance);
addRefreshInterceptor(authInstance);
addRefreshInterceptor(apiInstance);
addRefreshInterceptor(chatInstance);
addFormDataInterceptor(apiInstance);
addAuthorizationInterceptor(authInstance);
addAuthorizationInterceptor(apiInstance, {
  refreshBeforeRequest: true,
  requireAccessToken: true,
});
addAuthorizationInterceptor(chatInstance, {
  refreshBeforeRequest: true,
  requireAccessToken: true,
});
