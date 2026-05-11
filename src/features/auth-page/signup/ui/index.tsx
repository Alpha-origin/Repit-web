import { useNavigate } from 'react-router-dom';

import SignUp from '@/widgets/auth-page/signup-page';

import { useSignUpForm } from '@/features/auth-page/signup/model/useSignUpForm';

const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useSignUpForm();

  return (
    <SignUp
      {...form}
      onNavigateToLogin={() => navigate('/login')}
    />
  );
};

export default SignUpForm;
