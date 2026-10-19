import FeedbackTabs from "@/widgets/feedback-page/feedback-tabs";
import * as S from "../style";
import type { FeedbackOverallTopSectionProps } from "../type";

const FeedbackOverallTopSection = ({ content }: FeedbackOverallTopSectionProps) => {
  const { evaluation, metrics, summary } = content;

  return (
    <S.SectionBlock>
      <S.HeadingRow>
        <S.PageHeading>종합 피드백</S.PageHeading>
        <FeedbackTabs />
      </S.HeadingRow>

      <S.TopGrid>
        <S.ScoreCard>
          <S.ScoreRing>
            <S.ScoreRingGraphic viewBox="0 0 160 160" aria-hidden="true">
              <circle cx="80" cy="80" r="75" fill="none" stroke="#e6e6e6" strokeWidth="10" />
              <circle
                cx="80" cy="80" r="75" fill="none" stroke="currentColor"
                strokeWidth="10" strokeLinecap="round" pathLength="100"
                strokeDasharray={`${summary.score ?? 0} 100`}
                transform="rotate(-90 80 80)"
                opacity={summary.score === null || summary.score === 0 ? 0 : 1}
              />
            </S.ScoreRingGraphic>
            <S.ScoreRingInner>
              <S.ScoreRingLabel>{summary.title}</S.ScoreRingLabel>
              <S.MainScore>{summary.score === null ? "—" : `${summary.score}점`}</S.MainScore>
              <S.ScoreMaximum>100점</S.ScoreMaximum>
            </S.ScoreRingInner>
          </S.ScoreRing>
          <S.DescriptionBlock>
            {summary.description.map((line) => (
              <S.DescriptionLine key={line}>{line}</S.DescriptionLine>
            ))}
          </S.DescriptionBlock>
        </S.ScoreCard>

        <S.MetricsCard>
          <div>
            <S.TextCardTitle>종합 점수</S.TextCardTitle>
            <S.SectionCaption>평가 가능한 항목의 점수와 가중치를 반영한 결과입니다.</S.SectionCaption>
          </div>
          <S.MetricGrid>
            {metrics.map((metric) => (
              <S.MetricCard key={metric.label}>
                <S.MetricLabel>{metric.label}</S.MetricLabel>
                <S.MetricValue>{metric.score === null ? metric.emptyLabel ?? "미제공" : `${metric.score}점`}</S.MetricValue>
                {metric.score !== null ? <S.ProgressTrack aria-hidden="true">
                  <S.ProgressFill $score={metric.score ?? 0} />
                </S.ProgressTrack> : null}
              </S.MetricCard>
            ))}
          </S.MetricGrid>
          <S.TextCardBody>{evaluation}</S.TextCardBody>
        </S.MetricsCard>
      </S.TopGrid>
    </S.SectionBlock>
  );
};

export default FeedbackOverallTopSection;
