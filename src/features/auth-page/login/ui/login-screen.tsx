import { useNavigate } from 'react-router-dom';

import * as S from '@/pages/auth-page/style';
import { AUTH_PAGE_SIDE_CONTENT } from '@/shared/constants/auth-page';
import AuthSidePanel from '@/widgets/auth-page/auth-side';

import LoginForm from './index';

const LoginScreen = () => {
  const navigate = useNavigate();
  const sideContent = AUTH_PAGE_SIDE_CONTENT.login;

  return (
    <S.Container $isLogin>
      <AuthSidePanel
        description={sideContent.description}
        imageAlt={sideContent.imageAlt}
        switchAuthLabel={sideContent.switchAuthLabel}
        onSwitchAuth={() => navigate(sideContent.switchAuthPath)}
      />

      <LoginForm />
    </S.Container>
  );
};

export default LoginScreen;
