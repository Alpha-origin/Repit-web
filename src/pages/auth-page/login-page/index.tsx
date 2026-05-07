import loginSideImage from "@/shared/img/auth-page/repit-auth.svg?url";
import RepitLogo from "@/shared/img/logo/Repit.svg?react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import type { LoginFormData } from "../type";
import * as S from "./style";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname.includes("login");
  const switchAuthLabel = isLoginPage ? "회원가입" : "로그인";
  const switchAuthPath = isLoginPage ? "/signup" : "/login";
  const welcomeDescription = isLoginPage
    ? "로그인을 하고 레핏을 이용해보세요"
    : "회원가입을 하고 레핏을 시작해보세요";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onSubmit",
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <S.Container $isLogin={isLoginPage}>
      <S.LeftSection>
        <S.LeftImage src={loginSideImage} alt="리핏 로그인 안내 이미지" />
        <S.LeftContent>
          <S.WelcomeTitle>
            Hello
            <br />
            WELCOME!
          </S.WelcomeTitle>
          <S.WelcomeDescription>{welcomeDescription}</S.WelcomeDescription>
          <S.SwitchAuthButton
            type="button"
            aria-label={switchAuthLabel}
            onClick={() => navigate(switchAuthPath)}
          >
            {switchAuthLabel}
          </S.SwitchAuthButton>
        </S.LeftContent>
      </S.LeftSection>

      <S.RightSection>
        <S.Logo aria-label="Repit">
          <RepitLogo />
        </S.Logo>

        <S.LoginBox>
          <S.Title>로그인</S.Title>

          <S.Form onSubmit={handleSubmit(onSubmit)}>
            <S.InputWrapper>
              <S.Input
                type="email"
                placeholder="이메일"
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                    message: "올바른 이메일 형식이 아닙니다.",
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
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자 이상이어야 합니다.",
                  },
                })}
              />

              {errors.password && (
                <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
              )}
            </S.InputWrapper>

            <S.LoginButton type="submit">로그인</S.LoginButton>
          </S.Form>

          <S.LinkWrapper>
            <S.LinkText type="button">아이디 찾기</S.LinkText>
            <S.Divider>|</S.Divider>
            <S.LinkText type="button">비밀번호 찾기</S.LinkText>
          </S.LinkWrapper>
        </S.LoginBox>
      </S.RightSection>
    </S.Container>
  );
};

export default LoginPage;
