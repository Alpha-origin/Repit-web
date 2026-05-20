import { useParams } from "react-router-dom";

const FeedbackDetail = () => {
  const { id } = useParams();

  return <div>상세 피드백 페이지 {id}</div>;
};

export default FeedbackDetail;
