import type { LoginPanelProps } from '@/pages/auth-page/type';
import RepitLogo from '@/shared/img/logo/Repit.svg?react';

import * as S from './style';

const LoginPanel = ({
  errors,
  isSubmitDisabled,
  onSubmit,
  register,
}: LoginPanelProps) => {
  return (
    <S.Section>
      <S.Logo aria-label="Repit">
        <RepitLogo />
      </S.Logo>

      <S.Panel>
        <S.Title>로그인</S.Title>

        <S.Form onSubmit={onSubmit}>
          <S.InputWrapper>
            <S.Input
              type="email"
              placeholder="이메일"
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
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다.',
                },
              })}
            />

            {errors.password && <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>}
          </S.InputWrapper>

          <S.SubmitButton type="submit" disabled={isSubmitDisabled}>
            로그인
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
