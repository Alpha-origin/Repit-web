import { FEEDBACK_DETAIL_CONTENT } from "@/shared/constants/feedback-page/feedback-detail";
import FeedbackDetailBottomSection from "@/widgets/feedback-page/feedback-detail/bottom-section";
import FeedbackDetailMiddleSection from "@/widgets/feedback-page/feedback-detail/middle-section";
import FeedbackDetailTopSection from "@/widgets/feedback-page/feedback-detail/top-section";
import * as S from "./style";

const FeedbackDetailPage = () => {
  const { bottomSection, middleSection, topSection } = FEEDBACK_DETAIL_CONTENT;

  return (
    <S.Page>
      <S.Panel>
        <FeedbackDetailTopSection content={topSection} />
        <FeedbackDetailMiddleSection content={middleSection} />
        <FeedbackDetailBottomSection content={bottomSection} />
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackDetailPage;
