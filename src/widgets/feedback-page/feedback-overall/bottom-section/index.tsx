import * as S from "../style";
import type { FeedbackOverallBottomSectionProps } from "../type";

const FeedbackOverallBottomSection = ({
  content,
  isDownloadingPdf = false,
  onDownloadPdf,
}: FeedbackOverallBottomSectionProps) => {
  const { keywords, reliability, speechMetrics } = content;

  return (
    <S.SectionBlock>
      <S.SpeechCard>
        <S.TextCardTitle>음성 분석 결과</S.TextCardTitle>
        <S.SpeechMetricGrid>
          {speechMetrics.map((metric) => (
            <S.SpeechMetricCard key={metric.label}>
              <S.MetricHeader>
                <S.MetricLabel>{metric.label}</S.MetricLabel>
                <S.MetricValue>{metric.score === null ? "분석 대기" : `${metric.score}점`}</S.MetricValue>
              </S.MetricHeader>
              <S.ProgressTrack aria-hidden="true">
                <S.ProgressFill $score={metric.score ?? 0} />
              </S.ProgressTrack>
              <S.MetricDescription>{metric.description}</S.MetricDescription>
            </S.SpeechMetricCard>
          ))}
        </S.SpeechMetricGrid>
      </S.SpeechCard>

      <S.BottomGrid>
        <S.KeywordCard aria-label="자주 사용한 단어">
          {keywords.items.length > 0 ? (
            <S.KeywordCanvas>
              {keywords.items.map((item) => (
                <S.KeywordWord
                  key={item.text}
                  $size={item.size}
                  style={{ top: item.top, left: item.left }}
                >
                  {item.text}
                </S.KeywordWord>
              ))}
            </S.KeywordCanvas>
          ) : <S.EmptyText>분석된 키워드가 아직 없습니다.</S.EmptyText>}
        </S.KeywordCard>
        <S.BottomSideColumn>
          <S.ReliabilityCard>
            <S.TextCardTitle>{reliability.title}</S.TextCardTitle>
            <S.ReliabilityBadges>
              <S.ReliabilityBadge>{reliability.scoreLabel}</S.ReliabilityBadge>
              <S.ReliabilityBadge>{reliability.levelLabel}</S.ReliabilityBadge>
            </S.ReliabilityBadges>
          </S.ReliabilityCard>
          {onDownloadPdf ? (
            <S.PdfButton
              type="button"
              disabled={isDownloadingPdf}
              onClick={onDownloadPdf}
              data-html2canvas-ignore="true"
            >
              {isDownloadingPdf ? "PDF 저장 중..." : content.pdfActionLabel}
            </S.PdfButton>
          ) : null}
        </S.BottomSideColumn>
      </S.BottomGrid>
    </S.SectionBlock>
  );
};

export default FeedbackOverallBottomSection;
