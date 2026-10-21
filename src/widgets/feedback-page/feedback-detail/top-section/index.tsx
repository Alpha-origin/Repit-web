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
      {question.competencyChips?.length || question.responseNote ? (
        <S.CompetencySection>
          {question.competencyChips?.length ? <>
            <S.CompetencySectionTitle>평가 역량</S.CompetencySectionTitle>
            <S.CompetencyChipList>
              {question.competencyChips.map((chip, index) => (
                <S.CompetencyChip key={`${chip.label}-${index}`}>
                  <S.CompetencyChipHeading>
                    <S.CompetencyChipLabel>{chip.label}</S.CompetencyChipLabel>
                    <S.CompetencyChipMeta>{chip.roleLabel} · {chip.verdictLabel}</S.CompetencyChipMeta>
                  </S.CompetencyChipHeading>
                  {chip.quotes.map((quote, quoteIndex) => (
                    <S.CompetencyQuote key={`${quote}-${quoteIndex}`}>
                      <span aria-hidden="true">✓</span> “{quote}”
                    </S.CompetencyQuote>
                  ))}
                </S.CompetencyChip>
              ))}
            </S.CompetencyChipList>
          </> : null}
          {question.responseNote ? <S.ResponseNote>{question.responseNote}</S.ResponseNote> : null}
        </S.CompetencySection>
      ) : null}
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
