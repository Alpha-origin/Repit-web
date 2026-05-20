import { FEEDBACK_OVERALL_CONTENT } from "@/shared/fixtures/feedback-page/feedback-overall";
import FeedbackOverallBottomSection from "@/widgets/feedback-page/feedback-overall/bottom-section";
import FeedbackOverallMiddleSection from "@/widgets/feedback-page/feedback-overall/middle-section";
import FeedbackOverallTopSection from "@/widgets/feedback-page/feedback-overall/top-section";
import * as S from "./style";

const FeedbackOverallPage = () => {
  const { bottomSection, middleSection, topSection } = FEEDBACK_OVERALL_CONTENT;

  return (
    <S.Page>
      <S.Panel>
        <FeedbackOverallTopSection content={topSection} />
        <FeedbackOverallMiddleSection content={middleSection} />
        <FeedbackOverallBottomSection content={bottomSection} />
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackOverallPage;
