import SignUpForm from '@/features/auth-page/signup/ui';
import * as S from '@/pages/auth-page/style';
import { AUTH_PAGE_SIDE_CONTENT } from '@/shared/constants/auth-page';
import AuthSidePanel from '@/widgets/auth-page/auth-side';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const sideContent = AUTH_PAGE_SIDE_CONTENT.signup;

  return (
    <S.Container $isLogin={false}>
      <AuthSidePanel
        description={sideContent.description}
        imageAlt={sideContent.imageAlt}
        switchAuthLabel={sideContent.switchAuthLabel}
        onSwitchAuth={() => navigate(sideContent.switchAuthPath)}
      />

      <SignUpForm />
    </S.Container>
  );
};

export default SignUpPage;
