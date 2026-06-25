import type { SignUpFormData } from '@/features/auth-page/signup/model/types';
import { extractErrorMessage } from '@/shared/api/errorMessage';
import { authInstance } from '@/shared/api/axiosInstance';

const SIGN_UP_URL = '/api/v1/auth/signup';

export async function signUp(formData: SignUpFormData): Promise<string | null> {
  const signUpData = {
    nickname: formData.nickname.trim(),
    username: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
  };

  try {
    await authInstance.post(SIGN_UP_URL, signUpData);

    return null;
  } catch (error) {
    return extractErrorMessage(error, '회원가입에 실패했습니다.');
  }
}
