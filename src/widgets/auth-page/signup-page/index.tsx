import type { FormEventHandler } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { SignUpFormData } from '@/features/auth-page/signup/model/types';
import RepitLogo from '@/shared/img/logo/Repit.svg?react';

import * as S from './style';

interface SignUpPanelProps {
  errors: FieldErrors<SignUpFormData>;
  isSubmitting: boolean;
  onNavigateToLogin: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<SignUpFormData>;
  submitError: string;
}

const SignUp = ({
  errors,
  isSubmitting,
  onNavigateToLogin,
  onSubmit,
  register,
  submitError,
}: SignUpPanelProps) => {
  return (
    <S.Section>
      <S.Logo aria-label="Repit">
        <RepitLogo />
      </S.Logo>

      <S.Panel>
        <S.Title>회원가입</S.Title>

        <S.Form onSubmit={onSubmit}>
          <S.InputWrapper>
            <S.Input
              type="text"
              placeholder="닉네임"
              disabled={isSubmitting}
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
              })}
            />

            {errors.nickname && (
              <S.ErrorMessage>{errors.nickname.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>
          <S.InputWrapper>
            <S.Input
              type="text"
              placeholder="이름"
              disabled={isSubmitting}
              {...register('name', {
                required: '이름을 입력해주세요.',
              })}
            />

            {errors.name && (
              <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          <S.InputWrapper>
            <S.Input
              type="email"
              placeholder="이메일"
              disabled={isSubmitting}
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다.',
                },
              })}
            />

            {errors.email && (
              <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          <S.InputWrapper>
            <S.Input
              type="password"
              placeholder="비밀번호"
              disabled={isSubmitting}
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다.',
                },
              })}
            />

            {errors.password && (
              <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          <S.InputWrapper>
            <S.Input
              type="password"
              placeholder="비밀번호 확인"
              disabled={isSubmitting}
              {...register('passwordConfirm', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: (value, formValues) =>
                  value === formValues.password ||
                  '비밀번호가 일치하지 않습니다.',
              })}
            />

            {errors.passwordConfirm && (
              <S.ErrorMessage>{errors.passwordConfirm.message}</S.ErrorMessage>
            )}
          </S.InputWrapper>

          {submitError && (
            <S.StatusMessage role="alert">{submitError}</S.StatusMessage>
          )}

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </S.SubmitButton>
        </S.Form>

        <S.LinkWrapper>
          <S.LinkText>
            이미 계정이 있나요?{' '}
            <S.GoLoginButton type="button" onClick={onNavigateToLogin}>
              로그인
            </S.GoLoginButton>
          </S.LinkText>
        </S.LinkWrapper>
      </S.Panel>
    </S.Section>
  );
};

export default SignUp;
