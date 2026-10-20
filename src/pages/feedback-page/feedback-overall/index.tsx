import { useFeedbackAudioAnalysis } from "@/features/feedback-page/model/useFeedbackAudioAnalysis";
import CompanyFeedback from "@/widgets/feedback-page/company-feedback";
import { buildFeedbackOverallContent } from "@/features/feedback-page/model/feedbackDisplay";
import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import FeedbackOverallBottomSection from "@/widgets/feedback-page/feedback-overall/bottom-section";
import FeedbackOverallMiddleSection from "@/widgets/feedback-page/feedback-overall/middle-section";
import FeedbackOverallTopSection from "@/widgets/feedback-page/feedback-overall/top-section";
import { exportElementToPdf } from "@/shared/utils/exportElementToPdf";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackOverallPage = () => {
  const { id } = useParams();
  const {
    onAnalysisError,
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    previousFeedback,
    isLoading,
    isRetryingFeedback,
    isSavingInterview,
    refetch,
    retryFeedback,
  } = useFeedbackInterview(id, true);
  const isAnalysisPending =
    feedback?.status === "PENDING" || feedback?.status === "IN_PROGRESS";
  const isAnalysisFailed = feedback?.status === "FAILED";
  const content =
    interview?.status === "COMPLETED" && feedback && !isAnalysisPending && !isAnalysisFailed
      ? buildFeedbackOverallContent(feedback, interview, previousFeedback)
      : null;
  const audio = useFeedbackAudioAnalysis(interview?.interviewId ?? interview?.id, interview?.answerMode, interview?.status === "COMPLETED" && content !== null, onAnalysisError);
  const panelRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (interview?.status !== "COMPLETED" || !panelRef.current || isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportElementToPdf(panelRef.current, {
        fileName: `repit-feedback-overall-${id ?? "unknown"}.pdf`,
      });
    } catch {
      window.alert("PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <S.Page>
      <S.Panel ref={panelRef}>
        {isLoading ? (
          <S.StateCard aria-live="polite">
            <S.StateText>
              {isSavingInterview ? "면접 기록을 저장하고 있어요" : "면접 정보를 불러오는 중입니다."}
            </S.StateText>
          </S.StateCard>
        ) : errorMessage || !interview ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage ?? "면접 정보를 찾을 수 없습니다."}</S.StateText>
            <S.RetryButton type="button" onClick={() => void refetch()}>
              다시 시도
            </S.RetryButton>
          </S.StateCard>
        ) : !content ? (
          <S.StateCard aria-live="polite">
            <S.StateText>
              {isAnalysisPending
                ? feedbackErrorMessage ?? "피드백을 분석 중입니다. 완료되면 자동으로 표시됩니다."
                : isAnalysisFailed
                  ? feedbackErrorMessage ?? feedback?.errorMessage ?? "피드백 분석에 실패했습니다."
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
          <>
            <FeedbackOverallTopSection content={content.topSection} />
            <FeedbackOverallMiddleSection content={content.middleSection} />
            <CompanyFeedback feedback={feedback!} interview={interview} />
            <FeedbackOverallBottomSection
              content={content.bottomSection}
              speechAnalysis={audio.view}
              onRetrySpeechAnalysis={audio.retry}
              isDownloadingPdf={isDownloadingPdf}
              onDownloadPdf={handleDownloadPdf}
            />
          </>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackOverallPage;
