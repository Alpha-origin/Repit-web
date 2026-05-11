import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth-page/login/api/login';

import type { LoginFormData } from './types';

export function useLoginForm() {
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit(async (formData) => {
    setSubmitError('');

    const errorMessage = await login(formData);

    if (errorMessage) {
      setSubmitError(errorMessage);
    }
  });

  return {
    errors,
    isSubmitting,
    onSubmit,
    register,
    submitError,
  };
}
