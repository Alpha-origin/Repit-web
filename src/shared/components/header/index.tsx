import Repit from "@/shared/img/logo/Repit-logo.svg?url";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./style";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";

  const isInterviewPage =
    pathname === "/main" ||
    pathname.startsWith("/main/interview") ||
    pathname.startsWith("/main/before/interview");
  const isFeedbackPage = pathname === "/main/feedback";
  const isMypage = pathname === "/main/mypage";

  return (
    <S.Header>
      <S.LogoImage src={Repit} alt="Repit" />

      <S.TopButtons>
        <S.TopButton onClick={() => navigate("/main")} $active={isInterviewPage}>
          면접
        </S.TopButton>
        <S.TopButton onClick={() => navigate("/main/feedback")} $active={isFeedbackPage}>
          피드백
        </S.TopButton>
        <S.TopButton onClick={() => navigate("/main/mypage")} $active={isMypage}>
          마이페이지
        </S.TopButton>
      </S.TopButtons>

      <S.StatusButtons>
        <S.LogoutButton>로그아웃</S.LogoutButton>
        <S.StatusButton>한석주님</S.StatusButton>
      </S.StatusButtons>
    </S.Header>
  );
};

export default Header;
