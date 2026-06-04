import SignUpPanel from '@/widgets/auth-page/signup-page';
import { useNavigate } from 'react-router-dom';
import { useSignUpForm } from '@/features/auth-page/signup/model/useSignUpForm';
import Loading from '@/shared/components/loading'; 

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useSignUpForm(() => navigate('/login'));

  const { isLoading, ...rest } = form as typeof form & { isLoading: boolean };

  if (isLoading) return <Loading />;

  return <SignUpPanel {...rest} />;
};

export default SignUpForm;