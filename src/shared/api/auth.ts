import axios from 'axios';

import { deleteCookie, getCookie, setAccessToken } from '@/shared/util/cookie';
import { buildAuthUrl, publicInstance } from './axiosInstance';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export interface SignUpRequest {
  nickname: string;
  name: string;
  email: string;
  password: string;
}

export async function signUp(payload: SignUpRequest) {
  const signUpPaths = ['/auth/signup', '/auth/register', '/signup'];
  let lastError: unknown;

  for (const path of signUpPaths) {
    try {
      return await axios.post(buildAuthUrl(path), payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      lastError = error;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404 || status === 405) {
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError ?? new Error('회원가입 API 경로를 찾지 못했습니다.');
}

export function getApiErrorMessage(
  error: unknown,
  fallback = '요청 처리 중 오류가 발생했습니다.',
) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function tokenRefresh() {
  const refreshToken = getCookie('refreshToken');
  const username = getCookie('username');

  if (refreshToken && username) {
    publicInstance.post(`/auth/refresh`, {
      username: username,
      refreshToken: refreshToken,
    })
      .then((response) => {
        const newToken = response.data;
        setAccessToken(newToken);
        return newToken;
      })
      .catch((error) => {
        alert(getApiErrorMessage(error, '세션을 갱신하지 못했습니다.'));
        logout();
      });
  }

  return false;
}

export function isLoggedIn() {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');

  if (accessToken) {
    return true;
  } else {
    if (refreshToken) {
      tokenRefresh();
      return true;
    } else {
      return false;
    }
  }
}

export function logout() {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  deleteCookie('username');
  window.location.replace('/login');
}
