import styled, { css } from "styled-components";
import type { FeedbackOverallKeywordItem } from "./type";

const cardSurface = css`
  min-width: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid #dedfe2;
  border-radius: 0.375rem;
`;

const cardShadow = css`
  box-shadow: 0 2px 4px rgba(34, 68, 114, 0.07);
`;

export const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`;

export const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 1.875rem;
  margin-bottom: -0.5rem;
`;

export const PageHeading = styled.h1`
  color: #4a4d53;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.025em;
`;

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.44fr) minmax(0, 1fr);
  gap: 0.5rem;

  @media (max-width: 42rem) { grid-template-columns: 1fr; }
`;

export const ScoreCard = styled.article`
  ${cardSurface}
  ${cardShadow}
  min-height: 16rem;
  padding: 1.625rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
`;

export const ScoreRing = styled.div`
  position: relative;
  width: 9.375rem;
  height: 9.375rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
`;

export const ScoreRingGraphic = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  color: ${({ theme }) => theme.colors.brand.blue};
`;

export const ScoreRingInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const ScoreRingLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.strong};
`;

export const MainScore = styled.h2`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
`;

export const ScoreMaximum = styled.span`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.875rem;
`;

export const DescriptionBlock = styled.div`
  margin-top: 0.125rem;
`;

export const DescriptionLine = styled.p`
  font-size: 0.75rem;
  line-height: 1.4;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const ResponseLabel = styled.p`
  margin-top: 0.5rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const MetricsCard = styled.article`
  ${cardSurface}
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.375rem;
  padding: 2rem;

  @media (max-width: 48rem) { padding: 1.25rem; }
`;

export const TextCardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
`;

export const SectionCaption = styled.p`
  margin-top: 0.1875rem;
  font-size: 0.625rem;
  line-height: 1.4;
`;

export const MetricGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 4 }) => $columns}, minmax(0, 1fr));
  gap: 0.625rem;

  @media (max-width: 48rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const MetricCard = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 0.8125rem;
  border: 1px solid #e1e1e1;
  border-radius: 0.1875rem;
`;

export const MetricLabel = styled.span`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
`;

export const MetricValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.2;
`;

export const MetricVerdict = styled.span`
  width: fit-content;
  padding: 0.1875rem 0.4375rem;
  border-radius: 999px;
  background: #eaf2ff;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const MetricNote = styled.span`
  color: #687383;
  font-size: 0.625rem;
  line-height: 1.3;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.25rem;
  overflow: hidden;
  border-radius: 1rem;
  background: #d0e0ff;
`;

export const ProgressFill = styled.div<{ $score: number }>`
  width: ${({ $score }) => `${Math.min(100, Math.max(0, $score))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.blue};
`;

export const TextCardBody = styled.p`
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 0.75rem;
  line-height: 1.3;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.6fr) minmax(0, 1fr);
  gap: 0.75rem;

  @media (max-width: 48rem) { grid-template-columns: 1fr; }
`;

export const InsightGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #dedfe2;
  border-radius: 0.375rem;

  @media (max-width: 30rem) { grid-template-columns: 1fr; }
`;

export const InsightCard = styled.article<{ $tone: "positive" | "negative" }>`
  min-width: 0;
  min-height: 14.25rem;
  padding: 1.375rem 2rem;
  background: ${({ $tone }) => $tone === "positive" ? "#eaf2fb" : "#f7eeee"};
  color: ${({ $tone, theme }) => $tone === "positive" ? theme.colors.brand.blue : "#ff3b21"};

  & + & { border-left: 1px solid #dedfe2; }

  @media (max-width: 36rem) { padding: 1.25rem; }
  @media (max-width: 30rem) {
    min-height: 0;
    & + & { border-left: 0; border-top: 1px solid #dedfe2; }
  }
`;

export const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.875rem;
`;

export const InsightIcon = styled.svg`
  width: 1.375rem;
  height: 1.375rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
`;

export const InsightTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

export const InsightList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const InsightItem = styled.li`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem;
`;

export const InsightNumber = styled.span`
  font-size: 1rem;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`;

export const ComparisonCard = styled.article`
  ${cardSurface}
  min-height: 14.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.625rem 1.5rem 1rem;
  gap: 0.25rem;
`;

export const ComparisonTitle = styled.h3`
  color: #555555;
  font-size: 0.875rem;
  line-height: 1.3;
  text-align: center;
`;

export const ComparisonDescription = styled.div`
  font-size: 0.8125rem;
  white-space: nowrap;
`;

export const ComparisonNote = styled.p`
  max-width: 15rem;
  margin-top: 0.625rem;
  color: #687383;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.5;
  white-space: normal;
`;

export const ComparisonHighlight = styled.strong`
  margin-right: 0.125rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.25rem;
  font-weight: 600;
`;

export const BarChart = styled.div`
  width: 100%;
  max-width: 14rem;
  height: 8.375rem;
  margin-top: auto;
  display: flex;
  justify-content: center;
  gap: 0.875rem;
`;

export const BarColumn = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const BarTrack = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
`;

export const BarFill = styled.div<{ $score: number; $tone: "primary" | "muted" }>`
  width: 100%;
  min-height: 1.25rem;
  height: ${({ $score }) => `${Math.min(100, Math.max(0, $score))}%`};
  border-radius: 0.3125rem;
  background: ${({ $tone, theme }) => $tone === "primary" ? theme.colors.brand.blue : "#edf1f9"};
  display: flex;
  justify-content: center;
  padding-top: 0.625rem;
`;

export const BarValue = styled.span<{ $tone: "primary" | "muted" }>`
  color: ${({ $tone, theme }) => $tone === "primary" ? theme.colors.white : theme.colors.brand.blue};
  font-size: 0.625rem;
  font-weight: 600;
`;

export const BarLabel = styled.p`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.5rem;
  line-height: 1.4;
  text-align: center;
`;

export const PersonaFeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const MotivationCard = styled.article`
  ${cardSurface}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;

  @media (max-width: 30rem) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const MotivationTitle = styled.h3`
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const MotivationNote = styled.p`
  margin-top: 0.25rem;
  color: #687383;
  font-size: 0.75rem;
  line-height: 1.4;
`;

export const MotivationScore = styled.strong`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  font-weight: 600;
`;

export const PersonaFeedbackCard = styled.article`
  ${cardSurface}
  ${cardShadow}
  min-height: 5rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5625rem 0.8125rem 0.5625rem 0.625rem;

  @media (max-width: 36rem) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.75rem;
  }
`;

export const PersonaImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 0.25rem;
  background: #e8edf5;
`;

export const PersonaFeedbackBody = styled.div`
  min-width: 0;
  flex: 1;
`;

export const PersonaFeedbackTitle = styled.h3`
  margin-bottom: 0.375rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const PersonaFeedbackText = styled(TextCardBody)`
  color: ${({ theme }) => theme.colors.text.strong};
  line-height: 1.25;
`;

export const PersonaScore = styled.span`
  min-width: 4.625rem;
  min-height: 2.375rem;
  padding: 0.625rem 1.125rem;
  flex-shrink: 0;
  border: 1px solid #c4daff;
  border-radius: 0.1875rem;
  background: #e8f0fe;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 36rem) { grid-column: 2; justify-self: start; }
`;

export const EmptyText = styled.p`
  color: #687383;
  font-size: 0.75rem;
  line-height: 1.5;
  text-align: center;
`;

export const PersonaEmpty = styled(EmptyText)`
  ${cardSurface}
  padding: 1.5rem;
`;

export const SpeechRetryButton = styled.button`
  align-self: flex-start;
  padding: 0.5rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 0.375rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  background: ${({ theme }) => theme.colors.white};
  font: inherit;
  cursor: pointer;

  &:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
`;

export const SpeechCard = styled.article`
  ${cardSurface}
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.5rem 1.75rem;
`;

export const SpeechMetricGrid = styled(MetricGrid)`
  gap: 0.5rem;
`;

export const SpeechMetricCard = styled(MetricCard)`
  padding: 0.875rem 0.9375rem 0.75rem;
  gap: 0.3125rem;
`;

export const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const MetricDescription = styled.p`
  margin-top: 0.125rem;
  color: #666666;
  font-size: 0.5625rem;
  line-height: 1.4;
  word-break: keep-all;
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3.25fr) minmax(0, 1fr);
  gap: 0.5rem;

  @media (max-width: 42rem) { grid-template-columns: 1fr; }
`;

export const KeywordCard = styled.article`
  ${cardSurface}
  ${cardShadow}
  min-height: 10.625rem;
  display: grid;
  align-items: center;
  padding: 0.75rem;
`;

export const KeywordCanvas = styled.div`
  position: relative;
  height: 100%;
  min-height: 9rem;
`;

const keywordSizeMap = { xs: "0.625rem", sm: "0.875rem", md: "1.25rem", lg: "1.875rem", xl: "2.75rem" };

export const KeywordWord = styled.span<{ $size: FeedbackOverallKeywordItem["size"] }>`
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 22%;
  color: ${({ $size, theme }) => $size === "xl" ? theme.colors.brand.blue : $size === "xs" ? "#5274a3" : "#4c8be4"};
  font-size: ${({ $size }) => keywordSizeMap[$size]};
  font-weight: ${({ $size }) => $size === "xs" ? 500 : 600};
  line-height: 1.1;
  text-align: center;
  overflow-wrap: anywhere;

  @media (max-width: 30rem) { font-size: ${({ $size }) => $size === "xl" ? "2rem" : keywordSizeMap[$size]}; }
`;

export const BottomSideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const ReliabilityCard = styled.article`
  ${cardSurface}
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8125rem;
  padding: 1.5rem 1.125rem;
`;

export const ReliabilityBadges = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

export const ReliabilityBadge = styled.span`
  min-width: 0;
  padding: 0.375rem 0.25rem;
  border: 1px solid #dedfe2;
  border-radius: 0.3125rem;
  color: #555555;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
`;

export const CredibilityIssueList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.75rem;
`;

export const CredibilityIssue = styled.li`
  min-width: 0;
  padding: 0.625rem;
  border-radius: 0.375rem;
  background: #fff5ec;
`;

export const CredibilityIssueTitle = styled.strong`
  display: block;
  margin-bottom: 0.375rem;
  color: #80501d;
  font-size: 0.75rem;
  line-height: 1.4;
`;

export const CredibilityQuote = styled.p`
  margin-top: 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 0.6875rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

export const PdfButton = styled.button`
  ${cardShadow}
  width: 100%;
  min-height: 2.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid #bbd3fa;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) { filter: brightness(0.96); }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 3px; }
  &:disabled { cursor: wait; opacity: 0.65; }
`;
