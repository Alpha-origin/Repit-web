import type { SignUpFormData } from '@/features/auth-page/signup/model/types';

const NOT_READY_MESSAGE =
  '아직 안함 ㅋㅋ';

export async function signUp(formData: SignUpFormData): Promise<string | null> {
  const nickname = formData.nickname.trim();
  const name = formData.name.trim();
  const email = formData.email.trim();
  const password = formData.password;

  // signUp api
  void nickname;
  void name;
  void email;
  void password;

  return NOT_READY_MESSAGE;
}
