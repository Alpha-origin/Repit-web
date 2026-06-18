import LoginPanel from '@/widgets/auth-page/login-page';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '@/features/auth-page/login/model/useLoginForm';
import Loading from '@/shared/components/loading';

const LoginForm = () => {
  const navigate = useNavigate();
  const form = useLoginForm(() => navigate('/main'));
  if (form.isSubmitting) return <Loading />;
  return <LoginPanel {...form} />;
};

export default LoginForm;