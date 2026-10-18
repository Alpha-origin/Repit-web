import type { FeedbackData, InterviewSummary } from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import { readCompanyBadge } from "@/features/interview-page/company/model/type";
import { readCompanyFit, type CompanyFitItem } from "@/features/feedback-page/model/companyFit";
import * as S from "./style";

const CompanyFeedback = ({ feedback, interview }: { feedback: FeedbackData; interview: InterviewSummary | null }) => {
  const company = readCompanyBadge(feedback.company === undefined ? interview?.company : feedback.company);
  if (!company) return null;
  const fit = readCompanyFit(feedback.companyFit, feedback.feedbacks ?? []);
  const interviewId = feedback.interviewId ?? interview?.interviewId ?? interview?.id;
  const items = (title: string, entries: CompanyFitItem[]) => entries.length ? (
    <div>
      <h3>{title}</h3>
      <ul>{entries.map((entry) => (
        <li key={entry.factId}>
          <strong>{entry.focus}</strong>
          <p>{entry.text}</p>
          {entry.questions.map((question) => (
            <S.QuestionLink key={question.questionId} to={`/main/feedback/detail/${interviewId}?questionId=${encodeURIComponent(question.questionId)}#feedback-question-content`}>
              {question.label} 질문·답변 보기
            </S.QuestionLink>
          ))}
        </li>
      ))}</ul>
    </div>
  ) : null;
  return (
    <S.Section aria-label="기업 관점 코멘트">
      <h2>{company.displayName} 관점으로 돌아보기</h2>
      <p>공개 자료를 바탕으로 한 연습용 코멘트입니다.</p>
      {fit ? <>
        <p>{fit.comment}</p>
        {items("잘 드러난 점", fit.matchedFocus)}
        {items("보완할 점", fit.gaps)}
      </> : <p>기업 관점 코멘트를 제공하지 못했습니다</p>}
    </S.Section>
  );
};

export default CompanyFeedback;
