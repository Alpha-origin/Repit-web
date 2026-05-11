import SignUpForm from '@/features/auth-page/signup/ui';
import * as S from '@/pages/auth-page/style';
import AuthSidePanel from '@/widgets/auth-page/auth-side';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <S.Container $isLogin={false}>
      <AuthSidePanel
        description="회원가입을 하고 레핏을 시작해보세요"
        imageAlt="리핏 회원가입 안내 이미지"
        switchAuthLabel="로그인"
        onSwitchAuth={() => navigate('/login')}
      />

      <SignUpForm />
    </S.Container>
  );
};

export default SignUpPage;
