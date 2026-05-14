import RepitLogo from "@/shared/img/logo/Repit-logo.svg?url";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <S.Header>
      <S.Logo aria-label="Repit">
        <S.LogoImage src={RepitLogo} alt="Repit" />
      </S.Logo>

      <S.Nav>
        <S.SignUp type="button" onClick={() => navigate("/signup")}>
          회원가입
        </S.SignUp>
        <S.Login type="button" onClick={() => navigate("/login")}>
          로그인
        </S.Login>
      </S.Nav>
    </S.Header>
  );
};

export default LandingPageHeader;
