import * as S from "../style";
import type { FeedbackDetailMiddleSectionProps } from "../type";

const FeedbackDetailMiddleSection = ({
  content,
}: FeedbackDetailMiddleSectionProps) => {
  return (
    <S.SummaryShell>
      <S.SummaryGrid>
        {content.cards.map((card) => (
          <S.SummaryCard key={card.title}>
            <S.SummaryTitle>{card.title}</S.SummaryTitle>
            {card.paragraphs.map((paragraph) => (
              <S.SummaryText key={paragraph}>{paragraph}</S.SummaryText>
            ))}
          </S.SummaryCard>
        ))}
      </S.SummaryGrid>
    </S.SummaryShell>
  );
};

export default FeedbackDetailMiddleSection;
