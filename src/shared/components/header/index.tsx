import Repit from "@/shared/img/logo/Repit-logo.svg?url";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./style";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInterviewPage = location.pathname.includes('/main/Interview');
  const isFeedbackPage = location.pathname.includes('/main/Feedback');
  const isMypage = location.pathname.includes('/main/Mypage');
  
  return (
    <S.Header>
      <S.LogoImage src={Repit} alt="Repit" />

      <S.TopButtons>
        <S.TopButton onClick={() => navigate("/main/Interview")} $active={isInterviewPage}>
          면접
        </S.TopButton>
        <S.TopButton onClick={() => navigate("/main/Feedback")} $active={isFeedbackPage}>
          피드백
        </S.TopButton>
        <S.TopButton onClick={() => navigate("/main/Mypage")} $active={isMypage}>
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
