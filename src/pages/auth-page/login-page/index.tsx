import LoginForm from '@/features/auth-page/login/ui';
import * as S from '@/pages/auth-page/style';
import AuthSidePanel from '@/widgets/auth-page/auth-side';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <S.Container $isLogin>
      <AuthSidePanel
        description="로그인을 하고 레핏을 이용해보세요"
        imageAlt="리핏 로그인 안내 이미지"
        switchAuthLabel="회원가입"
        onSwitchAuth={() => navigate('/signup')}
      />

      <LoginForm />
    </S.Container>
  );
};

export default LoginPage;
