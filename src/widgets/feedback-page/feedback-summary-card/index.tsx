import type { InterviewSummary } from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getCareerLabel,
  getFormattedDate,
  getInterviewMajorLabel,
  getInterviewStatusLabel,
  getInterviewStyleLabel,
  getInterviewTitle,
  getInterviewerName,
} from "@/features/feedback-page/model/interviewDisplay";

import * as S from "./style";

interface FeedbackSummaryCardProps {
  interview: InterviewSummary;
  notice: string;
}

const FeedbackSummaryCard = ({
  interview,
  notice,
}: FeedbackSummaryCardProps) => {
  const persona = interview.persona;

  return (
    <S.Card>
      <S.HeaderRow>
        <S.HeaderText>
          <S.Eyebrow>실제 연결된 면접 정보</S.Eyebrow>
          <S.Title>{getInterviewTitle(persona?.major)}</S.Title>
          <S.Description>
            {getFormattedDate(interview.createdAt)}에 진행된{" "}
            {getInterviewerName(interview)} 면접입니다.
          </S.Description>
        </S.HeaderText>

        <S.StatusBadge>{getInterviewStatusLabel(interview.status)}</S.StatusBadge>
      </S.HeaderRow>

      <S.MetaGrid>
        <S.MetaCard>
          <S.MetaLabel>면접관</S.MetaLabel>
          <S.MetaValue>{getInterviewerName(interview)}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>분야</S.MetaLabel>
          <S.MetaValue>{getInterviewMajorLabel(persona?.major)}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>면접 스타일</S.MetaLabel>
          <S.MetaValue>{getInterviewStyleLabel(persona?.type)}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>경력 기준</S.MetaLabel>
          <S.MetaValue>{getCareerLabel(persona?.career)}</S.MetaValue>
        </S.MetaCard>
      </S.MetaGrid>

      <S.Notice>{notice}</S.Notice>
    </S.Card>
  );
};

export default FeedbackSummaryCard;
