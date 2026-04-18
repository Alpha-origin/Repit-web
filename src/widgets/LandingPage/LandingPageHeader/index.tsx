import RepitLogo from "@/shared/img/Repit.svg?react";
import * as S from "./style";
import type { LandingPageHeaderComponent } from "./type";

const LandingPageHeader: LandingPageHeaderComponent = () => {
  return (
    <S.Header>
      <S.Logo>
        <span aria-hidden="true">
          <RepitLogo />
        </span>
        <span>e:pit</span>
      </S.Logo>

      <S.Nav>
        <S.SignUp>Sign Up</S.SignUp>
        <S.Login>Login</S.Login>
      </S.Nav>
    </S.Header>
  );
};

export default LandingPageHeader;
