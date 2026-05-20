import * as S from "../style";
import type {
  FeedbackOverallBottomSectionProps,
  FeedbackOverallKeywordItem,
} from "../type";

interface KeywordCloudProps {
  items: readonly FeedbackOverallKeywordItem[];
}

const KeywordCloud = ({ items }: KeywordCloudProps) => {
  return (
    <S.KeywordCard>
      <S.KeywordCanvas>
        {items.map((item) => (
          <S.KeywordWord
            key={`${item.text}-${item.top}-${item.left}`}
            $left={item.left}
            $size={item.size}
            $top={item.top}
          >
            {item.text}
          </S.KeywordWord>
        ))}
      </S.KeywordCanvas>
    </S.KeywordCard>
  );
};

const FeedbackOverallBottomSection = ({
  content,
}: FeedbackOverallBottomSectionProps) => {
  const { keywords, questionFit, reliability } = content;

  return (
    <S.BottomSectionShell>
      <S.BottomGrid>
        <S.BottomLeftColumn>
          <S.ReliabilityCard>
            <S.TextCardTitle>{reliability.title}</S.TextCardTitle>
            <S.ReliabilityBadges>
              <S.ReliabilityBadge>{reliability.scoreLabel}</S.ReliabilityBadge>
              <S.ReliabilityBadge>{reliability.levelLabel}</S.ReliabilityBadge>
            </S.ReliabilityBadges>
          </S.ReliabilityCard>

          <S.QuestionCard>
            <S.TextCardTitle>{questionFit.title}</S.TextCardTitle>
            <S.TextCardBody>{questionFit.content}</S.TextCardBody>
          </S.QuestionCard>
        </S.BottomLeftColumn>

        <KeywordCloud items={keywords.items} />
      </S.BottomGrid>
    </S.BottomSectionShell>
  );
};

export default FeedbackOverallBottomSection;
