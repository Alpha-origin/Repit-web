import { useState } from 'react';
import { signUp, getApiErrorMessage } from '@/shared/api/auth';
import RepitLogo from '@/shared/img/logo/Repit.svg?react';
import loginSideImage from '@/shared/img/auth-page/repit-auth.svg?url';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SignUpFormData } from '../type';

import * as S from '../login-page/style';

const SignUpPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLogin = pathname.includes('login');
  const switchAuthLabel = isLogin ? '회원가입' : '로그인';
  const switchAuthPath = isLogin ? '/signup' : '/login';
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = async ({ name, email, password }: SignUpFormData) => {
    setSubmitError('');

    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigate('/login');
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.'),
      );
    }
  };

  return (
    <S.Container $isLogin={isLogin}>
      <S.LeftSection>
        <S.LeftImage src={loginSideImage} alt="리핏 회원가입 안내 이미지" />
        <S.SwitchAuthButton
          type="button"
          aria-label={switchAuthLabel}
          onClick={() => navigate(switchAuthPath)}
        >
          {switchAuthLabel}
        </S.SwitchAuthButton>
      </S.LeftSection>

      <S.RightSection>
        <S.Logo aria-label="Repit">
          <RepitLogo />
        </S.Logo>

        <S.LoginBox>
          <S.Title>회원가입</S.Title>

          <S.Form onSubmit={handleSubmit(onSubmit)}>
            <S.InputWrapper>
              <S.Input
                type="text"
                placeholder="이름"
                disabled={isSubmitting}
                {...register('name', {
                  required: '이름을 입력해주세요.',
                })}
              />

              {errors.name && <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>}
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

              {errors.email && <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>}
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
                    value === formValues.password || '비밀번호가 일치하지 않습니다.',
                })}
              />

              {errors.passwordConfirm && (
                <S.ErrorMessage>{errors.passwordConfirm.message}</S.ErrorMessage>
              )}
            </S.InputWrapper>

            {submitError && <S.StatusMessage role="alert">{submitError}</S.StatusMessage>}

            <S.LoginButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '가입 중...' : '회원가입'}
            </S.LoginButton>
          </S.Form>

          <S.LinkWrapper>
            <S.LinkText type="button" onClick={() => navigate('/login')}>
              이미 계정이 있나요? 로그인
            </S.LinkText>
          </S.LinkWrapper>
        </S.LoginBox>
      </S.RightSection>
    </S.Container>
  );
};

export default SignUpPage;
