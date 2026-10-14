import { useNavigate, useParams } from "react-router-dom";
import * as S from "../style";
import type { FeedbackOverallTopSectionProps } from "../type";

const FeedbackOverallTopSection = ({ content }: FeedbackOverallTopSectionProps) => {
  const { evaluation, metrics, summary, tabs } = content;
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <S.SectionBlock>
      <S.HeadingRow>
        <S.PageHeading>종합 피드백</S.PageHeading>
        <S.TabGroup aria-label="피드백 종류">
          <S.TabButton
            $active={tabs.activeTab === "overall"}
            aria-current={tabs.activeTab === "overall" ? "page" : undefined}
            type="button"
            onClick={() => navigate(`/main/feedback/overall/${id}`)}
          >
            {tabs.overallLabel}
          </S.TabButton>
          <S.TabButton
            $active={tabs.activeTab === "detail"}
            type="button"
            onClick={() => navigate(`/main/feedback/detail/${id}`)}
          >
            {tabs.detailLabel}
          </S.TabButton>
        </S.TabGroup>
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
            <S.SectionCaption>아래 4가지 평가 기준을 종합해 산출한 최종 점수입니다.</S.SectionCaption>
          </div>
          <S.MetricGrid>
            {metrics.map((metric) => (
              <S.MetricCard key={metric.label}>
                <S.MetricLabel>{metric.label}</S.MetricLabel>
                <S.MetricValue>{metric.score === null ? "분석 대기" : `${metric.score}점`}</S.MetricValue>
                <S.ProgressTrack aria-hidden="true">
                  <S.ProgressFill $score={metric.score ?? 0} />
                </S.ProgressTrack>
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
