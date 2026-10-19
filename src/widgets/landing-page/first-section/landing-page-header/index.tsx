import RepitLogo from "@/shared/img/logo/Logo2.svg?url";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const LandingPageHeader = ({ isGuide = false }: { isGuide?: boolean }) => {
  const navigate = useNavigate();

  return (
    <S.Header>
      <S.Logo aria-label="Repit" onClick={() => navigate(isGuide ? "/main" : "/")}>
        <S.LogoImage src={RepitLogo} alt="Repit" />
      </S.Logo>
      

      <S.Nav>
        {isGuide ? (
          <S.Login type="button" onClick={() => navigate("/main")}>
            돌아가기
          </S.Login>
        ) : (
          <>
            <S.SignUp type="button" onClick={() => navigate("/signup")}>
              회원가입
            </S.SignUp>
            <S.Login type="button" onClick={() => navigate("/login")}>
              로그인
            </S.Login>
          </>
        )}
      </S.Nav>
    </S.Header>
  );
};

export default LandingPageHeader;
