import * as S from "../style";
import type { FeedbackDetailTopSectionProps } from "../type";

const FeedbackDetailTopSection = ({ content, question }: FeedbackDetailTopSectionProps) => (
  <S.SectionBlock>
    <S.QuestionCard>
      <S.DetailCardTitle>{question.label}</S.DetailCardTitle>
      <S.QuestionText>{question.question}</S.QuestionText>
      <S.IntentSection>
        <S.IntentBadge>{content.intentionTitle}</S.IntentBadge>
        <S.QuestionText>{question.intention}</S.QuestionText>
      </S.IntentSection>
    </S.QuestionCard>
    <S.AnswerGrid>
      <S.DetailCard>
        <S.DetailCardTitle>{content.myAnswerTitle}</S.DetailCardTitle>
        <S.DetailCardText>{question.myAnswer}</S.DetailCardText>
      </S.DetailCard>
      <S.ModelAnswerCard>
        <S.DetailCardTitle>{content.modelAnswerTitle}</S.DetailCardTitle>
        <S.DetailCardText>{question.modelAnswer}</S.DetailCardText>
      </S.ModelAnswerCard>
      <S.DetailCard>
        <S.DetailCardTitle>{content.followUpTitle}</S.DetailCardTitle>
        <S.DetailCardText>{question.followUpQuestion}</S.DetailCardText>
      </S.DetailCard>
    </S.AnswerGrid>
  </S.SectionBlock>
);

export default FeedbackDetailTopSection;
