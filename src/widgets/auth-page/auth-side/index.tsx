import authSideImage from '@/shared/img/auth-page/repit-auth.svg?url';

import * as S from './style';

interface AuthSidePanelProps {
  description: string;
  imageAlt: string;
  switchAuthLabel: string;
  onSwitchAuth: () => void;
}

const AuthSidePanel = ({
  description,
  imageAlt,
  switchAuthLabel,
  onSwitchAuth,
}: AuthSidePanelProps) => {
  return (
    <S.Section>
      <S.BackgroundImage src={authSideImage} alt={imageAlt} />
      <S.Content>
        <S.Title>
          Hello
          <br />
          WELCOME!
        </S.Title>
        <S.Description>{description}</S.Description>
        <S.SwitchButton
          type="button"
          aria-label={switchAuthLabel}
          onClick={onSwitchAuth}
        >
          {switchAuthLabel}
        </S.SwitchButton>
      </S.Content>
    </S.Section>
  );
};

export default AuthSidePanel;
