import * as S from "../style";
import type {
  FeedbackOverallBarItem,
  FeedbackOverallComparisonCard,
  FeedbackOverallTopSectionProps,
} from "../type";
import { useNavigate, useParams } from "react-router-dom";

interface ChartProps {
  bars: readonly FeedbackOverallBarItem[];
}

const AverageScoreChart = ({ bars }: ChartProps) => {
  return (
    <S.BarChart>
      {bars.map((bar) => (
        <S.BarColumn key={bar.label}>
          <S.BarTrack>
            <S.BarFill $score={bar.score} $tone={bar.tone}>
              <S.BarValue $tone={bar.tone}>{bar.score}점</S.BarValue>
            </S.BarFill>
          </S.BarTrack>
          <S.BarLabel>{bar.label}</S.BarLabel>
        </S.BarColumn>
      ))}
    </S.BarChart>
  );
};

const ComparisonScoreChart = ({ bars }: ChartProps) => {
  return (
    <S.ComparisonBarChart>
      {bars.map((bar) => (
        <S.ComparisonBarColumn key={bar.label}>
          <S.BarTrack>
            <S.BarFill $score={bar.score} $tone={bar.tone}>
              <S.BarValue $tone={bar.tone}>{bar.score}점</S.BarValue>
            </S.BarFill>
          </S.BarTrack>
          <S.BarLabel>{bar.label}</S.BarLabel>
        </S.ComparisonBarColumn>
      ))}
    </S.ComparisonBarChart>
  );
};

interface ComparisonCardProps {
  card: FeedbackOverallComparisonCard;
}

const ComparisonCard = ({ card }: ComparisonCardProps) => {
  return (
    <S.ComparisonCard>
      <S.ComparisonHeader>
        <S.CardHeading>{card.title}</S.CardHeading>
        {card.highlightText && (
          <S.HighlightText>{card.highlightText}</S.HighlightText>
        )}
      </S.ComparisonHeader>
      <ComparisonScoreChart bars={card.bars} />
    </S.ComparisonCard>
  );
};

const FeedbackOverallTopSection = ({
  content,
}: FeedbackOverallTopSectionProps) => {
  const { averageComparison, comparisonCards, summary, tabs } = content;
  const { activeTab, detailLabel, overallLabel } = tabs;
  const navigate = useNavigate();
  const { id } = useParams();
  const feedbackId = id ?? "1";

  return (
    <S.SectionBlock>
      <S.TabGroup>
        <S.TabButton
          $active={activeTab === "overall"}
          type="button"
          onClick={() => navigate(`/main/feedback/overall/${feedbackId}`)}
        >
          {overallLabel}
        </S.TabButton>
        <S.TabButton
          $active={activeTab === "detail"}
          type="button"
          onClick={() => navigate(`/main/feedback/detail/${feedbackId}`)}
        >
          {detailLabel}
        </S.TabButton>
      </S.TabGroup>

      <S.SectionShell>
        <S.TopGrid>
          <S.LeftColumn>
            <S.ScoreCard>
              <S.SectionLabel>{summary.title}</S.SectionLabel>
              <S.MainScore>{summary.score}점</S.MainScore>
              <S.DescriptionBlock>
                {summary.description.map((line) => (
                  <S.DescriptionLine key={line}>{line}</S.DescriptionLine>
                ))}
              </S.DescriptionBlock>
            </S.ScoreCard>

            <S.ChartCard>
              <S.CardHeading>{averageComparison.title}</S.CardHeading>
              <AverageScoreChart bars={averageComparison.bars} />
            </S.ChartCard>
          </S.LeftColumn>

          <S.ComparisonPanel>
            {comparisonCards.map((card) => (
              <ComparisonCard key={card.title} card={card} />
            ))}
          </S.ComparisonPanel>
        </S.TopGrid>
      </S.SectionShell>
    </S.SectionBlock>
  );
};

export default FeedbackOverallTopSection;
