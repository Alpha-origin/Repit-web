import { getApiErrorMessage, signUp } from "@/shared/api/auth";
import AuthSidePanel from "@/widgets/auth-page/auth-side";
import SignUpPanel from "@/widgets/auth-page/signup-page";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import type { SignUpFormData } from "../type";

import * as S from "../style";

const SignUpPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoginPage = pathname.includes("login");
  const switchAuthLabel = isLoginPage ? "회원가입" : "로그인";
  const switchAuthPath = isLoginPage ? "/signup" : "/login";
  const welcomeDescription = isLoginPage
    ? "로그인을 하고 레핏을 이용해보세요"
    : "회원가입을 하고 레핏을 시작해보세요";
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    mode: "onSubmit",
  });

  const onSubmit = async ({
    nickname,
    name,
    email,
    password,
  }: SignUpFormData) => {
    setSubmitError("");

    try {
      await signUp({
        nickname: nickname.trim(),
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    }
  };

  return (
    <S.Container $isLogin={isLoginPage}>
      <AuthSidePanel
        description={welcomeDescription}
        imageAlt="리핏 회원가입 안내 이미지"
        switchAuthLabel={switchAuthLabel}
        onSwitchAuth={() => navigate(switchAuthPath)}
      />

      <SignUpPanel
        errors={errors}
        isSubmitting={isSubmitting}
        onNavigateToLogin={() => navigate("/login")}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        submitError={submitError}
      />
    </S.Container>
  );
};

export default SignUpPage;
