export interface AuthPageStyleProps {
  $isLogin: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
