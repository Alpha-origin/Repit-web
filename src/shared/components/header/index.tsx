import { useRef, useState } from "react";
import { finishActiveInterview } from "@/features/interview-page/interview/model/activeInterviewLifecycle";
import { waitForRecordingUploads } from "@/features/interview-page/interview/model/interviewRecordingStore";
import { clearAccessToken } from "@/shared/api/accessToken";
import { useEnsureCurrentUser } from "@/shared/model/useEnsureCurrentUser";
import { useUserStore } from "@/shared/store/userStore";
import Repit from "@/shared/img/logo/Repit-logo.svg?url";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./style";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const actionRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const pathname = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";

  useEnsureCurrentUser();
  const nickname = useUserStore((state) => state.nickname);
  const name = useUserStore((state) => state.name);
  const resetUser = useUserStore((state) => state.reset);
  const displayName = nickname || name || "회원";

  const isInterviewPage =
    pathname === "/main" ||
    pathname.startsWith("/main/interview") ||
    pathname.startsWith("/main/setting/interview");
  const isFeedbackPage =
    pathname === "/main/feedback/list" ||
    pathname.startsWith("/main/feedback/detail/") ||
    pathname.startsWith("/main/feedback/overall/");
  const isMypage = pathname === "/main/mypage";

  const handleLeave = async (path: string, logout = false) => {
    if (actionRef.current) return;
    actionRef.current = true;
    setIsLeaving(true);
    setLogoutError(null);
    try {
      await finishActiveInterview();
      if (logout) {
        if (!(await waitForRecordingUploads())) {
          setLogoutError("업로드에 실패한 파일이 있습니다. 다시 시도하거나 파일을 폐기한 뒤 로그아웃해주세요.");
          return;
        }
        clearAccessToken();
        resetUser();
      }
      navigate(path);
    } finally {
      actionRef.current = false;
      setIsLeaving(false);
    }
  };
  const handleNavigate = (path: string) => { void handleLeave(path); };
  const handleLogout = () => { void handleLeave("/login", true); };

  return (
    <S.Header $compact={pathname.startsWith("/main/feedback/overall/")}>
      <S.LogoImage src={Repit} alt="Repit" onClick={() => handleNavigate("/main")} />

      <S.TopButtons>
        <S.TopButton
          disabled={isLeaving}
          onClick={() => handleNavigate("/main")}
          $active={isInterviewPage}
        >
          면접
        </S.TopButton>
        <S.TopButton
          disabled={isLeaving}
          onClick={() => handleNavigate("/main/feedback/list")}
          $active={isFeedbackPage}
        >
          피드백
        </S.TopButton>
        <S.TopButton
          disabled={isLeaving}
          onClick={() => handleNavigate("/main/mypage")}
          $active={isMypage}
        >
          마이페이지
        </S.TopButton>
      </S.TopButtons>

      <S.StatusButtons>
        <S.LogoutButton disabled={isLeaving} onClick={handleLogout}>{isLeaving ? "저장 중..." : "로그아웃"}</S.LogoutButton>
        <S.StatusButton>{displayName}님</S.StatusButton>
      </S.StatusButtons>
      {logoutError ? <S.ErrorMessage role="alert">{logoutError}</S.ErrorMessage> : null}
    </S.Header>
  );
};

export default Header;
