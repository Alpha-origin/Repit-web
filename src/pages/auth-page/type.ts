import type { ComponentProps } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface AuthPageStyleProps {
  $isLogin: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  nickname: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthSidePanelProps {
  description: string;
  imageAlt: string;
  switchAuthLabel: string;
  onSwitchAuth: () => void;
}

export interface LoginPanelProps {
  errors: FieldErrors<LoginFormData>;
  isSubmitDisabled: boolean;
  onSubmit: ComponentProps<'form'>['onSubmit'];
  register: UseFormRegister<LoginFormData>;
}

export interface SignUpPanelProps {
  errors: FieldErrors<SignUpFormData>;
  isSubmitting: boolean;
  onNavigateToLogin: () => void;
  onSubmit: ComponentProps<'form'>['onSubmit'];
  register: UseFormRegister<SignUpFormData>;
  submitError: string;
}
