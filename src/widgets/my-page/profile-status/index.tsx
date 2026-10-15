import type { LatestProfile } from "@/features/profile/api";
import { formatProfileCompletedAt, getProfileFailureMessage } from "@/features/profile/model/profileMessages";
import * as S from "./style";

interface ProfileStatusCardProps {
  profile: LatestProfile | null;
  isLoading: boolean;
  errorMessage: string;
  isRestarting: boolean;
  onRefresh: () => void;
  onReanalyze: () => void;
  onEdit: () => void;
  onReplaceFile: () => void;
  onSave: () => void;
  onGoToInterview: () => void;
  isSaving: boolean;
}

const STATUS_TEXT = {
  NONE: "자료를 등록하면 면접 질문을 준비해요",
  PENDING: "자료를 분석하고 있어요. 잠시만 기다려 주세요",
  COMPLETED: "자료 분석이 완료됐어요. 면접을 시작할 수 있어요",
  FAILED: "자료 분석을 완료하지 못했어요",
};

const ProfileStatusCard = ({
  profile,
  isLoading,
  errorMessage,
  isRestarting,
  onRefresh,
  onReanalyze,
  onEdit,
  onReplaceFile,
  onSave,
  onGoToInterview,
  isSaving,
}: ProfileStatusCardProps) => {
  const hasError = !!errorMessage || profile?.status === "FAILED";
  const isComplete = !isLoading && !hasError && profile?.status === "COMPLETED";
  const completedAt = formatProfileCompletedAt(profile?.completedAt ?? null);
  const failureReason = profile?.failureReason;
  const action = failureReason === "REPO_NOT_PUBLIC" ? onSave
    : failureReason === "INVALID_MATERIAL" ? onReplaceFile
    : failureReason === "INSUFFICIENT_EVIDENCE" ? onEdit : onReanalyze;
  const actionLabel = failureReason === "REPO_NOT_PUBLIC" ? "다시 저장"
    : failureReason === "INVALID_MATERIAL" ? "파일 교체"
    : failureReason === "INSUFFICIENT_EVIDENCE" ? "자료 보강" : "다시 분석";

  return (
    <S.Card role="status" aria-live="polite" $hasError={hasError}>
      <S.StatusIcon aria-hidden="true" $isComplete={isComplete}>
        {isComplete ? "✓" : hasError ? "!" : "i"}
      </S.StatusIcon>
      <S.Content>
        <S.Title>자료 분석 상태</S.Title>
        <S.Message>
          {isLoading ? "분석 상태를 확인하고 있어요"
            : profile?.status === "FAILED" ? getProfileFailureMessage(profile)
            : profile ? STATUS_TEXT[profile.status] : "분석 상태를 확인하지 못했어요"}
        </S.Message>
        {isComplete ? (
          <>
            {completedAt ? <S.Message>{completedAt}</S.Message> : null}
            <S.Action type="button" onClick={onGoToInterview}>면접 보러 가기</S.Action>
          </>
        ) : null}
        {profile?.status === "FAILED" ? (
          <S.Action type="button" disabled={isRestarting || isSaving} onClick={action}>
            {isRestarting ? "분석 요청 중…" : actionLabel}
          </S.Action>
        ) : null}
        {errorMessage ? (
          <>
            <S.Message role="alert">{errorMessage}</S.Message>
            <S.Action type="button" onClick={onRefresh}>상태 다시 확인</S.Action>
          </>
        ) : null}
      </S.Content>
    </S.Card>
  );
};

export default ProfileStatusCard;
