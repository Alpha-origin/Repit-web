import { useFeedbackList } from "@/features/feedback-page/feedback-list/model/useFeedbackList";
import Loading from "@/shared/components/loading";
import { FEEDBACK_LIST_TITLE } from "@/shared/fixtures/feedback-page/feedback-list";
import FeedbackList from "@/widgets/feedback-page/feedback-list";

const FeedbackListPage = () => {
  const { errorMessage, isLoading, items, refetch } = useFeedbackList();

  if (isLoading) {
    return <Loading message="지난 면접 목록을 불러오는 중입니다." />;
  }

  return (
    <FeedbackList
      errorMessage={errorMessage}
      items={items}
      onRetry={() => {
        void refetch();
      }}
      title={FEEDBACK_LIST_TITLE}
    />
  );
};

export default FeedbackListPage;
