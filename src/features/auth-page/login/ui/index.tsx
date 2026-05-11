import Login from '@/widgets/auth-page/login-page';

import { useLoginForm } from '@/features/auth-page/login/model/useLoginForm';

const LoginForm = () => {
  const form = useLoginForm();

  return <Login {...form} />;
};

export default LoginForm;
