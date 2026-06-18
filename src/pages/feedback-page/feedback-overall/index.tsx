import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import { FEEDBACK_OVERALL_CONTENT } from "@/shared/fixtures/feedback-page/feedback-overall";
import FeedbackSummaryCard from "@/widgets/feedback-page/feedback-summary-card";
import FeedbackOverallBottomSection from "@/widgets/feedback-page/feedback-overall/bottom-section";
import FeedbackOverallMiddleSection from "@/widgets/feedback-page/feedback-overall/middle-section";
import FeedbackOverallTopSection from "@/widgets/feedback-page/feedback-overall/top-section";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackOverallPage = () => {
  const { id } = useParams();
  const { bottomSection, middleSection, topSection } = FEEDBACK_OVERALL_CONTENT;
  const { errorMessage, interview, isLoading, refetch } = useFeedbackInterview(id);

  return (
    <S.Page>
      <S.Panel>
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
              notice="현재 이 상단 카드의 면접 정보는 실제 API 데이터입니다. 아래 종합 점수와 분석 내용은 전용 피드백 조회 API가 연결되기 전까지 샘플 데이터로 표시됩니다."
            />
            <FeedbackOverallTopSection content={topSection} />
            <FeedbackOverallMiddleSection content={middleSection} />
            <FeedbackOverallBottomSection content={bottomSection} />
          </>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackOverallPage;
