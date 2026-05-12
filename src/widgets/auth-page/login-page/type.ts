import type { FormEventHandler } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { LoginFormData } from '@/features/auth-page/login/model/types';

export interface LoginPanelProps {
  errors: FieldErrors<LoginFormData>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<LoginFormData>;
  submitError: string;
}
