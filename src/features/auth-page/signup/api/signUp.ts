import axios from 'axios';

import type { SignUpFormData } from '@/features/auth-page/signup/model/types';
import { authInstance } from '@/shared/api/axiosInstance';

const SIGN_UP_URL = '/api/v1/auth/signup';

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

export async function signUp(formData: SignUpFormData): Promise<string | null> {
  const signUpData = {
    nickname: formData.nickname.trim(),
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
  };

  try {
    await authInstance.post(SIGN_UP_URL, signUpData);
    return null;
  } catch (error) {
    return getErrorMessage(error, '회원가입에 실패했습니다.');
  }
}
