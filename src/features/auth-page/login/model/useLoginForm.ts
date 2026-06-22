import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth-page/login/api/login';

import type { LoginFormData } from './types';

export function useLoginForm(onSuccess?: () => void) {
  const [submitError, setSubmitError] = useState('');
  const isLoginRequestPendingRef = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });

  async function submitLogin(formData: LoginFormData) {
    if (isLoginRequestPendingRef.current) {
      return;
    }

    isLoginRequestPendingRef.current = true;
    setSubmitError('');

    try {
      const errorMessage = await login(formData);

      if (errorMessage) {
        setSubmitError(errorMessage);
        return;
      }

      onSuccess?.();
    } finally {
      isLoginRequestPendingRef.current = false;
    }
  }

  return {
    errors,
    isSubmitting,
    onSubmit: handleSubmit(submitLogin),
    register,
    submitError,
  };
}
