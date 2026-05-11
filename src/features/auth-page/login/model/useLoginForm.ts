import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth-page/login/api/login';

import type { LoginFormData } from './types';

export function useLoginForm(onSuccess?: () => void) {
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });

  async function submitLogin(formData: LoginFormData) {
    setSubmitError('');

    const errorMessage = await login(formData);

    if (errorMessage) {
      setSubmitError(errorMessage);
      return;
    }

    onSuccess?.();
  }

  return {
    errors,
    isSubmitting,
    onSubmit: handleSubmit(submitLogin),
    register,
    submitError,
  };
}
