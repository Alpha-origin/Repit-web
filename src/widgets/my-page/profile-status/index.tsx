import type { LatestProfile } from "@/features/profile/api";
import { formatProfileCompletedAt, getProfileFailureMessage } from "@/features/profile/model/profileMessages";
import { GithubIcon } from "../portfolio/icons";
import * as S from "./style";

interface ProfileStatusCardProps {
  profile: LatestProfile | null;
  isLoading: boolean;
  errorMessage: string;
  errorAction?: "refresh" | "reanalyze";
  isRestarting: boolean;
  onRefresh: () => void;
  onReanalyze: () => void;
  onEdit: () => void;
  onReplaceFile: () => void;
  onGoToInterview: () => void;
  isSaving: boolean;
  // 분석 실패 문구를 직무에 맞추는 데 쓴다. 저장된 직무다.
  jobRole?: string | null;
}

const ProfileStatusCard = ({
  profile,
  isLoading,
  errorMessage,
  errorAction = "refresh",
  isRestarting,
  onRefresh,
  onReanalyze,
  onEdit,
  onReplaceFile,
  onGoToInterview,
  isSaving,
  jobRole,
}: ProfileStatusCardProps) => {
  const isSubmitting = isSaving || isRestarting;
  const isAnalyzing = !isLoading && profile?.status === "PENDING";
  const isWorking = isSubmitting || isAnalyzing;
  const hasFailed = !isSubmitting && profile?.status === "FAILED";
  const hasError = !!errorMessage || hasFailed;
  const isComplete = !isLoading && !isWorking && !hasError && profile?.status === "COMPLETED";
  const completedAt = formatProfileCompletedAt(profile?.completedAt ?? null);
  const failureReason = profile?.failureReason;
  // 저장소 공개 설정을 바꾼 뒤에는 자료가 그대로라 저장이 아니라 다시 분석해야 한다.
  const action = failureReason === "INVALID_MATERIAL" || failureReason === "UNREADABLE_DOCUMENT" ? onReplaceFile
    : failureReason === "INSUFFICIENT_EVIDENCE" ? onEdit : onReanalyze;
  const actionLabel = failureReason === "INVALID_MATERIAL" || failureReason === "UNREADABLE_DOCUMENT" ? "파일 교체"
    : failureReason === "INSUFFICIENT_EVIDENCE" ? "자료 보강" : "다시 분석";
  const title = isSaving ? "자료를 저장하고 있어요…"
    : isRestarting ? "자료 분석을 요청하고 있어요…"
    : isLoading ? "분석 상태를 확인하고 있어요"
    : isAnalyzing ? "자료를 분석하고 있어요…"
    : isComplete ? "분석 완료!"
    : hasFailed ? "자료 분석을 완료하지 못했어요"
    : hasError && errorAction === "reanalyze" ? "자료 분석을 시작하지 못했어요"
    : hasError ? "분석 상태를 확인하지 못했어요"
    : "자료를 등록하면 면접 질문을 준비해요";

  return (
    <S.Card role="status" aria-live="polite" $hasError={hasError}>
      <S.StatusIcon aria-hidden="true" $hasError={hasError}>
        {isComplete ? (
          <S.CompleteIcon viewBox="0 0 24 24" fill="none">
            <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </S.CompleteIcon>
        ) : hasError && !isWorking ? "!" : <GithubIcon />}
      </S.StatusIcon>
      <S.Content>
        <S.Title $hasError={hasError}>{title}</S.Title>
        {isWorking ? (
          <S.Message>
            {isSubmitting ? "잠시만 기다려 주세요. 저장된 자료로 면접을 준비합니다."
              : "보통 1~3분 소요되며, 이 페이지를 나가도 분석은 계속됩니다."}
          </S.Message>
        ) : isComplete ? (
          <S.Message>
            {completedAt ? `${completedAt} · 면접 준비가 완료되었어요.` : "분석 및 면접 준비가 완료되었어요."}
          </S.Message>
        ) : hasFailed && profile ? (
          <>
            <S.Message>{getProfileFailureMessage(profile, jobRole)}</S.Message>
            <S.Action type="button" onClick={action}>{actionLabel}</S.Action>
          </>
        ) : null}
        {errorMessage && (
          <>
            <S.Message role="alert">{errorMessage}</S.Message>
            <S.Action type="button" onClick={errorAction === "reanalyze" ? onReanalyze : onRefresh}>
              {errorAction === "reanalyze" ? "다시 분석" : "상태 다시 확인"}
            </S.Action>
          </>
        )}
      </S.Content>
      {isComplete && (
        <S.InterviewButton type="button" onClick={onGoToInterview}>면접 보러가기</S.InterviewButton>
      )}
      {isWorking && (
        <S.ProgressTrack role="progressbar" aria-label={title} aria-valuetext="완료 결과를 기다리고 있어요">
          <S.ProgressFill key={isSubmitting ? "submitting" : profile?.jobId ?? "analyzing"} />
        </S.ProgressTrack>
      )}
    </S.Card>
  );
};

export default ProfileStatusCard;
