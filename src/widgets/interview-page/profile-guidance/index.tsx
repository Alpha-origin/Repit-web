import { Link } from "react-router-dom";
import * as S from "./style";

interface ProfileGuidanceProps {
  message: string;
  showMyPageLink: boolean;
  onRetry?: () => void;
}

const ProfileGuidance = ({ message, showMyPageLink, onRetry }: ProfileGuidanceProps) => (
  <S.Container role="status" aria-live="polite">
    {message ? <span>{message}</span> : null}
    {showMyPageLink ? <Link to="/main/mypage">마이페이지로 이동</Link> : null}
    {onRetry ? <button type="button" onClick={onRetry}>상태 다시 확인</button> : null}
  </S.Container>
);

export default ProfileGuidance;
