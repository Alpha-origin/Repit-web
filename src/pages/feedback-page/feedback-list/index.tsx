import {
  FEEDBACK_LIST_ITEMS,
  FEEDBACK_LIST_TITLE,
} from "@/shared/fixtures/feedback-page/feedback-list";
import FeedbackList from "@/widgets/feedback-page/feedback-list";

const FeedbackListPage = () => {
  return (
    <FeedbackList items={FEEDBACK_LIST_ITEMS} title={FEEDBACK_LIST_TITLE} />
  );
};

export default FeedbackListPage;
