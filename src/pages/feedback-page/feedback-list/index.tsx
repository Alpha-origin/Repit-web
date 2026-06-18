import { useFeedbackList } from "@/features/feedback-page/feedback-list/model/useFeedbackList";
import { FEEDBACK_LIST_TITLE } from "@/shared/fixtures/feedback-page/feedback-list";
import FeedbackList from "@/widgets/feedback-page/feedback-list";

const FeedbackListPage = () => {
  const { errorMessage, isLoading, items, refetch } = useFeedbackList();

  return (
    <FeedbackList
      errorMessage={errorMessage}
      isLoading={isLoading}
      items={items}
      onRetry={() => {
        void refetch();
      }}
      title={FEEDBACK_LIST_TITLE}
    />
  );
};

export default FeedbackListPage;
