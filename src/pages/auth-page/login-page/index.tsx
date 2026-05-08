import LoginPanel from "@/widgets/auth-page/login-page";
import AuthSidePanel from "@/widgets/auth-page/auth-side";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "../style";
import type { LoginFormData } from "../type";

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
      <AuthSidePanel
        description={welcomeDescription}
        imageAlt="리핏 로그인 안내 이미지"
        switchAuthLabel={switchAuthLabel}
        onSwitchAuth={() => navigate(switchAuthPath)}
      />

      <LoginPanel
        errors={errors}
        isSubmitDisabled={!!errors.email || !!errors.password}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
      />
    </S.Container>
  );
};

export default LoginPage;
