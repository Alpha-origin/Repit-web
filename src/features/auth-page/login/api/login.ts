import axios from 'axios';

import type { LoginFormData } from '@/features/auth-page/login/model/types';
import { authInstance } from '@/shared/api/axiosInstance';

const LOGIN_URL = '/api/v1/auth/login';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }

    const data = error.response?.data as { message?: string; error?: string } | undefined;

    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export async function login(formData: LoginFormData): Promise<string | null> {
  const loginData = { 
    email: formData.email.trim(),
    password: formData.password,
  };

  try {
    await authInstance.post(LOGIN_URL, loginData);
    return null;
  } catch (error) {
    return getErrorMessage(error, '로그인에 실패했습니다.');
  }
}
