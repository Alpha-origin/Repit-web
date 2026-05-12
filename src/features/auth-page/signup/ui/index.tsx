import SignUpPanel from '@/widgets/auth-page/signup-page';
import { useNavigate } from 'react-router-dom';

import { useSignUpForm } from '@/features/auth-page/signup/model/useSignUpForm';

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useSignUpForm(() => navigate('/login'));

  return <SignUpPanel {...form} />;
};

export default SignUpForm;
