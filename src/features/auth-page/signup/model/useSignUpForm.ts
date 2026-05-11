import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signUp } from '@/features/auth-page/signup/api/signUp';

import type { SignUpFormData } from './types';

export function useSignUpForm() {
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit(async (formData) => {
    setSubmitError('');

    const errorMessage = await signUp(formData);

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
