import RepitLogo from "@/shared/img/logo/Repit.svg?react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <S.Header>
      <S.Logo>
        <span aria-hidden="true">
          <RepitLogo />
        </span>
        <span>e:pit</span>
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
