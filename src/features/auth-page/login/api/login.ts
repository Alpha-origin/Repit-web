import type { LoginFormData } from '@/features/auth-page/login/model/types';

const NOT_READY_MESSAGE =
  '아직 안함 ㅋㅋ';

export async function login(formData: LoginFormData): Promise<string | null> {
  const email = formData.email.trim();
  const password = formData.password;

  // login api
  void email;
  void password;

  return NOT_READY_MESSAGE;
}
