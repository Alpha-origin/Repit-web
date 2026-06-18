import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import { FEEDBACK_DETAIL_CONTENT } from "@/shared/fixtures/feedback-page/feedback-detail";
import { exportElementToPdf } from "@/shared/utils/exportElementToPdf";
import FeedbackDetailBottomSection from "@/widgets/feedback-page/feedback-detail/bottom-section";
import FeedbackDetailMiddleSection from "@/widgets/feedback-page/feedback-detail/middle-section";
import FeedbackDetailTopSection from "@/widgets/feedback-page/feedback-detail/top-section";
import FeedbackSummaryCard from "@/widgets/feedback-page/feedback-summary-card";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackDetailPage = () => {
  const { bottomSection, middleSection, topSection } = FEEDBACK_DETAIL_CONTENT;
  const { id } = useParams();
  const { errorMessage, interview, isLoading, refetch } = useFeedbackInterview(id);
  const panelRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!panelRef.current || isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportElementToPdf(panelRef.current, {
        fileName: `repit-feedback-detail-${id ?? "1"}.pdf`,
      });
    } catch (error) {
      console.error(error);
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
            <S.StateText>면접 정보를 불러오는 중입니다.</S.StateText>
          </S.StateCard>
        ) : errorMessage || !interview ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage ?? "면접 정보를 찾을 수 없습니다."}</S.StateText>
            <S.RetryButton
              type="button"
              onClick={() => {
                void refetch();
              }}
            >
              다시 시도
            </S.RetryButton>
          </S.StateCard>
        ) : (
          <>
            <FeedbackSummaryCard
              interview={interview}
              notice="현재 이 상단 카드의 면접 정보는 실제 API 데이터입니다. 질문별 분석, 모범 답변, 예상 꼬리질문은 전용 상세 피드백 조회 API가 연결되기 전까지 샘플 데이터로 표시됩니다."
            />
            <FeedbackDetailTopSection content={topSection} />
            <FeedbackDetailMiddleSection content={middleSection} />
            <FeedbackDetailBottomSection
              content={bottomSection}
              isDownloadingPdf={isDownloadingPdf}
              onDownloadPdf={handleDownloadPdf}
            />
          </>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackDetailPage;
