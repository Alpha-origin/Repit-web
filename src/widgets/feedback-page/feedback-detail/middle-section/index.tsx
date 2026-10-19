import * as S from "../style";
import type { FeedbackDetailMiddleSectionProps } from "../type";

const FeedbackDetailMiddleSection = ({ content, question }: FeedbackDetailMiddleSectionProps) => (
  <S.SummaryGrid>
    {content.cards.map((card) => (
      <S.SummaryCard key={card.title} $tone={card.tone}>
        <S.SummaryTitle $tone={card.tone}>
          <S.FaceIcon viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <circle cx="8.5" cy="9" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="9" r="0.7" fill="currentColor" stroke="none" />
            <path d={card.tone === "positive" ? "M7 13.5c1 5 9 5 10 0" : "M7 17c1-5 9-5 10 0"} />
          </S.FaceIcon>
          {card.title}
        </S.SummaryTitle>
        {(card.tone === "positive" ? question.strengths : question.improvements).map((paragraph, index) => (
          <S.SummaryText key={index}>{paragraph}</S.SummaryText>
        ))}
      </S.SummaryCard>
    ))}
  </S.SummaryGrid>
);

export default FeedbackDetailMiddleSection;
