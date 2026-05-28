import styled, { css } from "styled-components";

interface TabButtonProps {
  $active: boolean;
}

interface BarFillProps {
  $score: number;
  $tone: "primary" | "muted";
}

interface BarValueProps {
  $tone: "primary" | "muted";
}

interface KeywordWordProps {
  $left: string;
  $size: "xs" | "sm" | "md" | "xl";
  $top: string;
}

const cardSurface = css`
  background: rgba(255, 255, 255, 0.9);
  border: 0.0625rem solid rgba(223, 232, 247, 0.96);
  border-radius: 1.55rem;
  box-shadow: 0 1.1rem 2.6rem rgba(61, 102, 171, 0.08);
`;

const keywordSizeMap = {
  xs: css`
    font-size: 1.16rem;
    font-weight: 600;
    opacity: 0.82;
  `,
  sm: css`
    font-size: 1.58rem;
    font-weight: 700;
    opacity: 0.88;
  `,
  md: css`
    font-size: 2.3rem;
    font-weight: 800;
    opacity: 0.94;
  `,
  xl: css`
    font-size: 3.75rem;
    font-weight: 800;
    opacity: 1;
  `,
};

const getBarHeight = (score: number) => {
  const scaledHeight = score * 0.88 + 20;

  return `${Math.min(100, Math.max(28, scaledHeight))}%`;
};

export const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 48rem) {
    gap: 0.8rem;
  }
`;

export const SectionShell = styled.div`
  padding: 1rem;
  border-radius: 1.7rem;
  background: linear-gradient(
    180deg,
    rgba(234, 242, 255, 0.72),
    rgba(243, 247, 255, 0.82)
  );
  border: 0.0625rem solid rgba(217, 228, 247, 0.92);
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.55);

  @media (max-width: 48rem) {
    padding: 0.8rem;
    border-radius: 1.25rem;
  }
`;

export const BottomSectionShell = styled(SectionShell)`
  padding-bottom: 1.4rem;

  @media (max-width: 48rem) {
    padding-bottom: 1rem;
  }
`;

export const TabGroup = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 1.05rem;
  box-shadow: 0 0.85rem 2rem rgba(60, 102, 173, 0.08);
`;

export const TabButton = styled.button<TabButtonProps>`
  min-width: 13.2rem;
  height: 2.1rem;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.85rem;
  background: ${({ $active }) =>
    $active ? "linear-gradient(180deg, #2f75e7, #2667da)" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#2f75e7")};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 40rem) {
    min-width: 9rem;
    height: 2rem;
    font-size: 0.94rem;
  }
`;

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.2fr);
  gap: 1rem;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: grid;
  gap: 1rem;
`;

export const ScoreCard = styled.article`
  ${cardSurface}
  min-height: 10.5rem;
  border: 0.22rem solid rgba(132, 182, 245, 0.95);
  padding: 1.25rem 1.35rem 1.3rem;
`;

export const SectionLabel = styled.p`
  margin: 0;
  color: #111111;
  font-size: 1.3rem;
  font-weight: 700;
`;

export const MainScore = styled.h2`
  margin: 0.45rem 0 0.6rem;
  color: #2b74e3;
  font-size: clamp(1.3rem, 2.8vw, 2.85rem);
  font-weight: 550;
  letter-spacing: -0.08rem;
  line-height: 1;
`;

export const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const DescriptionLine = styled.p`
  margin: 0;
  color: #222222;
  font-size: 1.14rem;
  font-weight: 600;
  line-height: 1.45;
`;

export const ChartCard = styled.article`
  ${cardSurface}
  min-height: 12.8rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.05rem 1.15rem 1rem;
`;

export const CardHeading = styled.h3`
  margin: 0;
  color: #121212;
  font-size: 1.24rem;
  font-weight: 700;
`;

export const ComparisonPanel = styled.section`
  ${cardSurface}
  min-height: 24rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 1.3rem 1.2rem;
  background: linear-gradient(180deg, rgba(219, 228, 249, 0.88), rgba(228, 235, 251, 0.94));

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.article`
  ${cardSurface}
  min-height: 20rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem 1rem 1rem;
`;

export const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const HighlightText = styled.p`
  margin: 0;
  color: #2b74e3;
  font-size: 1.14rem;
  font-weight: 800;
  text-align: right;
`;

export const BarChart = styled.div`
  position: relative;
  width: 100%;
  height: 11.9rem;
  margin-top: auto;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 1.2rem;
  padding: 0 0.45rem 0.1rem;
  box-sizing: border-box;
  overflow: visible;
`;

export const ComparisonBarChart = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 15.2rem;
  margin-top: 0.35rem;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 1.35rem;
  padding: 0 0.45rem 0.18rem;
  box-sizing: border-box;
  overflow: visible;
`;

export const BarColumn = styled.div`
  position: relative;
  width: min(100%, 6.7rem);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 1.35rem;
  box-sizing: border-box;
`;

export const ComparisonBarColumn = styled.div`
  position: relative;
  width: min(100%, 7.2rem);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 1.55rem;
  box-sizing: border-box;
`;

export const BarTrack = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
`;

export const BarFill = styled.div<BarFillProps>`
  width: 100%;
  height: ${({ $score }) => getBarHeight($score)};
  border-radius: 0.6rem 0.6rem 0.18rem 0.18rem;
  background: ${({ $tone }) =>
    $tone === "primary"
      ? "linear-gradient(180deg, #2f75e7, #2a6cdd)"
      : "linear-gradient(180deg, rgba(228, 234, 246, 0.95), rgba(214, 223, 240, 0.98))"};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0.75rem;
`;

export const BarValue = styled.span<BarValueProps>`
  color: ${({ $tone }) => ($tone === "primary" ? "#ffffff" : "#2f75e7")};
  font-size: 1.08rem;
  font-weight: 800;
`;

export const BarLabel = styled.p`
  margin: 0;
  position: absolute;
  left: 50%;
  bottom: 0.1rem;
  width: 100%;
  transform: translateX(-50%);
  color: #2f75e7;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.25;
  word-break: keep-all;
`;

export const MiddleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`;

export const TextCard = styled.article`
  ${cardSurface}
  min-height: 13.6rem;
  padding: 1.2rem 1.3rem 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const TextCardTitle = styled.h3`
  margin: 0;
  color: #2b74e3;
  font-size: 2.02rem;
  font-weight: 800;
  letter-spacing: -0.04rem;
`;

export const TextCardBody = styled.p`
  margin: 0;
  color: #1b1b1b;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.7;
  word-break: keep-all;
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.25fr);
  gap: 0.9rem;
  align-items: start;
  padding-bottom: 0.4rem;
  box-sizing: border-box;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 48rem) {
    padding-bottom: 0.2rem;
  }
`;

export const BottomLeftColumn = styled.div`
  display: grid;
  gap: 0.7rem;
  align-content: start;
`;

export const ReliabilityCard = styled.article`
  ${cardSurface}
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 1.15rem;

  @media (max-width: 40rem) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ReliabilityBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

export const ReliabilityBadge = styled.div`
  min-width: 5.6rem;
  height: 2.9rem;
  padding: 0 1rem;
  border: 0.0625rem solid rgba(189, 201, 224, 0.95);
  border-radius: 0.55rem;
  background: rgba(255, 255, 255, 0.9);
  color: #111111;
  font-size: 1.12rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const QuestionCard = styled.article`
  ${cardSurface}
  min-height: 11.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 1.25rem 1.25rem;
`;

export const KeywordCard = styled.article`
  ${cardSurface}
  min-height: 17rem;
  align-self: start;
  padding: 1.1rem 1.25rem;
`;

export const KeywordCanvas = styled.div`
  position: relative;
  width: 100%;
  min-height: 15rem;
`;

export const KeywordWord = styled.span<KeywordWordProps>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  color: #2b74e3;
  letter-spacing: -0.05rem;
  transform: translate(-50%, -50%);
  ${({ $size }) => keywordSizeMap[$size]}
`;
