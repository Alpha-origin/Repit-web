import * as S from "../style";
import type { FeedbackOverallMiddleSectionProps } from "../type";

const FeedbackOverallMiddleSection = ({
  content,
}: FeedbackOverallMiddleSectionProps) => {
  return (
    <S.SectionShell>
      <S.MiddleGrid>
        {content.cards.map((card) => (
          <S.TextCard key={card.title}>
            <S.TextCardTitle>{card.title}</S.TextCardTitle>
            <S.TextCardBody>{card.content}</S.TextCardBody>
          </S.TextCard>
        ))}
      </S.MiddleGrid>
    </S.SectionShell>
  );
};

export default FeedbackOverallMiddleSection;
