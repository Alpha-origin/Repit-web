import RepitLogo from '@/shared/img/logo/Repit-R.svg?url';
import { useNavigate } from 'react-router-dom';

import * as S from './style';
import type { LoginPanelProps } from './type';

const LoginPanel = ({
  errors,
  isSubmitting,
  onSubmit,
  register,
  submitError,
}: LoginPanelProps) => {
  const navigate = useNavigate();

  return (
    <S.Section>
      <S.Logo type="button" aria-label="Repit 홈으로 이동" onClick={() => navigate('/')}>
        <img src={RepitLogo} alt="Repit" />
      </S.Logo>

      <S.Panel>
        <S.Title>로그인</S.Title>

        <S.Form onSubmit={onSubmit}>
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

          {submitError && (
            <S.StatusMessage role="alert">{submitError}</S.StatusMessage>
          )}

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '확인 중...' : '로그인'}
          </S.SubmitButton>
        </S.Form>

        <S.LinkWrapper>
          <S.LinkText type="button">아이디 찾기</S.LinkText>
          <S.Divider>|</S.Divider>
          <S.LinkText type="button">비밀번호 찾기</S.LinkText>
        </S.LinkWrapper>
      </S.Panel>
    </S.Section>
  );
};

export default LoginPanel;
