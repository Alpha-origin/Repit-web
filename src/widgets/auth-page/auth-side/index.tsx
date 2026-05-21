import authSideImage from '@/shared/img/auth-page/repit-auth.svg?url';

import * as S from './style';
import type { AuthSidePanelProps } from './type';

const AuthSidePanel = ({
  description,
  imageAlt,
  switchAuthLabel,
  onSwitchAuth,
}: AuthSidePanelProps) => {
  return (
    <S.Section $backgroundImage={authSideImage} aria-label={imageAlt}>
      <S.Content>
        <S.ContentStack>
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
        </S.ContentStack>
      </S.Content>
    </S.Section>
  );
};

export default AuthSidePanel;
