import RepitLogo from "@/shared/img/logo/Repit.svg?react";
import * as S from "./style";

const LandingPageHeader = () => {
  return (
    <S.Header>
      <S.Logo>
        <span aria-hidden="true">
          <RepitLogo />
        </span>
        <span>e:pit</span>
      </S.Logo>

      <S.Nav>
        <S.SignUp>회원가입</S.SignUp>
        <S.Login>로그인</S.Login>
      </S.Nav>
    </S.Header>
  );
};

export default LandingPageHeader;
