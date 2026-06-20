import {
  clearActiveInterviewSessionId,
  getActiveInterviewSessionId,
  quitInterview,
} from "@/features/interview-page/interview/api";
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
    pathname.startsWith("/main/setting/interview");
  const isFeedbackPage =
    pathname === "/main/feedback/list" ||
    pathname.startsWith("/main/feedback/detail/") ||
    pathname.startsWith("/main/feedback/overall/");
  const isMypage = pathname === "/main/mypage";

  const quitActiveInterviewSession = () => {
    if (!pathname.startsWith("/main/interview")) {
      return;
    }

    const sessionId = getActiveInterviewSessionId(location.state);

    if (!sessionId) {
      return;
    }

    clearActiveInterviewSessionId();
    void quitInterview(sessionId);
  };

  const handleNavigate = (path: string) => {
    quitActiveInterviewSession();
    navigate(path);
  };

  return (
    <S.Header>
      <S.LogoImage src={Repit} alt="Repit" onClick={() => handleNavigate("/main")} />

      <S.TopButtons>
        <S.TopButton
          onClick={() => handleNavigate("/main")}
          $active={isInterviewPage}
        >
          면접
        </S.TopButton>
        <S.TopButton
          onClick={() => handleNavigate("/main/feedback/list")}
          $active={isFeedbackPage}
        >
          피드백
        </S.TopButton>
        <S.TopButton
          onClick={() => handleNavigate("/main/mypage")}
          $active={isMypage}
        >
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
