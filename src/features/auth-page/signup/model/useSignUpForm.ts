import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signUp } from '@/features/auth-page/signup/api/signUp';

import type { SignUpFormData } from './types';

export function useSignUpForm(onSuccess?: () => void) {
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
  });

  async function submitSignUp(formData: SignUpFormData) {
    setSubmitError('');

    const errorMessage = await signUp(formData);

    if (errorMessage) {
      setSubmitError(errorMessage);
      return;
    }

    onSuccess?.();
  }

  return {
    errors,
    isSubmitting,
    onSubmit: handleSubmit(submitSignUp),
    register,
    submitError,
  };
}
