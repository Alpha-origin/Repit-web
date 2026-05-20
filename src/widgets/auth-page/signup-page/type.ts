import type { FormEventHandler } from 'react';
import type {
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form';

import type { SignUpFormData } from '@/features/auth-page/signup/model/types';

export interface SignUpPanelProps {
  errors: FieldErrors<SignUpFormData>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<SignUpFormData>;
  submitError: string;
  trigger: UseFormTrigger<SignUpFormData>;
}
