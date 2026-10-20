import CompanyFeedback from "@/widgets/feedback-page/company-feedback";
import { buildFeedbackDetailContent } from "@/features/feedback-page/model/feedbackDisplay";
import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import { exportElementToPdf } from "@/shared/utils/exportElementToPdf";
import FeedbackDetail from "@/widgets/feedback-page/feedback-detail";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const {
    answers,
    answersErrorMessage,
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    isLoading,
    isRetryingFeedback,
    refetch,
    retryFeedback,
  } = useFeedbackInterview(id);
  const isAnalysisPending =
    feedback?.status === "PENDING" || feedback?.status === "IN_PROGRESS";
  const isAnalysisFailed = feedback?.status === "FAILED";
  const hasQuestionFeedback = (feedback?.feedbacks?.length ?? 0) > 0;
  const content =
    interview?.status === "COMPLETED" && feedback && !isAnalysisPending && !isAnalysisFailed && hasQuestionFeedback
      ? buildFeedbackDetailContent(feedback, answers)
      : null;
  const panelRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (interview?.status !== "COMPLETED" || !panelRef.current || isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportElementToPdf(panelRef.current, {
        fileName: `repit-feedback-detail-${id ?? "unknown"}.pdf`,
      });
    } catch {
      window.alert("PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <S.Page>
        {isLoading ? (
          <S.StateCard aria-live="polite">
            <S.StateText>면접 정보를 불러오는 중입니다.</S.StateText>
          </S.StateCard>
        ) : errorMessage || answersErrorMessage || !interview ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage ?? answersErrorMessage ?? "면접 정보를 찾을 수 없습니다."}</S.StateText>
            <S.RetryButton type="button" onClick={() => void refetch()}>
              다시 시도
            </S.RetryButton>
          </S.StateCard>
        ) : !content ? (
          <S.StateCard aria-live="polite">
            <S.StateText>
              {isAnalysisPending
                ? feedbackErrorMessage ?? "질문별 피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다."
                : isAnalysisFailed
                  ? feedbackErrorMessage ?? feedback?.errorMessage ?? "피드백 분석에 실패했습니다."
                  : feedback && !hasQuestionFeedback
                    ? "표시할 질문별 피드백이 없습니다."
                    : feedbackErrorMessage ?? "피드백 분석 결과를 불러오지 못했습니다."}
            </S.StateText>
            <S.RetryButton
              type="button"
              onClick={() => void (isAnalysisFailed ? retryFeedback() : refetch())}
              disabled={isAnalysisFailed && isRetryingFeedback}
            >
              {isAnalysisFailed && isRetryingFeedback ? "요청 중…" : "다시 시도"}
            </S.RetryButton>
          </S.StateCard>
        ) : (
          <FeedbackDetail
            key={id}
            ref={panelRef}
            content={content}
            companySection={<CompanyFeedback feedback={feedback!} interview={interview} />}
            isDownloadingPdf={isDownloadingPdf}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
    </S.Page>
  );
};

export default FeedbackDetailPage;
