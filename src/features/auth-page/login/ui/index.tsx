import LoginPanel from '@/widgets/auth-page/login-page';
import { useNavigate } from 'react-router-dom';

import { useLoginForm } from '@/features/auth-page/login/model/useLoginForm';

const LoginForm = () => {
  const navigate = useNavigate();
  const form = useLoginForm(() => navigate('/'));

  return <LoginPanel {...form} />;
};

export default LoginForm;
