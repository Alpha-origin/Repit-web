import styled, { css } from "styled-components";

const cardSurface = css`
  min-width: 0;
  border: 1px solid #dcdde0;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
`;

export const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: 12.5rem minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 44rem) {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  padding: 1.25rem;
  border-right: 1px solid #c9cbd0;
  background: #f8f9ff;

  @media (max-width: 44rem) {
    flex-shrink: 0;
    padding: 1rem;
    border-right: 0;
    border-bottom: 1px solid #dcdde0;
  }
`;

export const SideTitle = styled.h1`
  display: flex;
  align-items: center;
  min-height: 2.375rem;
  margin: 0;
  padding: 0.5rem 1.375rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
`;

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;

  @media (max-width: 44rem) {
    flex-direction: row;
    overflow-x: auto;
    padding: 2px 2px 0.25rem;
  }
`;

export const QuestionItemButton = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${({ $active }) => $active ? "#6fa2ff" : "#d0ddf5"};
  border-radius: 0.375rem;
  background: ${({ $active, theme }) => $active ? theme.colors.white : "transparent"};
  color: ${({ $active, theme }) => $active ? theme.colors.brand.blue : theme.colors.text.default};
  text-align: left;
  cursor: pointer;

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: -2px; }

  @media (max-width: 44rem) { width: 10rem; }
`;

export const QuestionItemHeading = styled.span`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
  color: ${({ theme }) => theme.colors.brand.blue};
`;

export const QuestionNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

export const QuestionPersona = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
`;

export const QuestionPreview = styled.span`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 0.75rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
`;

export const SideActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;

  @media (max-width: 44rem) {
    flex-direction: row;
    padding-top: 0;
    > button { flex: 1; }
  }
`;

const actionButton = css`
  min-height: 2.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ReplayButton = styled.button`
  ${actionButton}
  border: 1px solid #d6e3ff;
  background: ${({ theme }) => theme.colors.white};
  color: #555555;
  cursor: not-allowed;
`;

export const PdfButton = styled.button`
  ${actionButton}
  border: 1px solid #a2c6ff;
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(34, 68, 114, 0.15);
  cursor: pointer;
  &:disabled { opacity: 0.65; cursor: wait; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand.blue}; outline-offset: 2px; }
`;

export const DetailScrollArea = styled.div`
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 0.75rem 2.375rem 1.5rem 1.375rem;

  @media (max-width: 60rem) { padding: 0.75rem 1.25rem 1.5rem; }
  @media (max-width: 44rem) { flex-shrink: 0; overflow: visible; padding: 0.75rem 1rem 1.5rem; }
`;

export const DetailContent = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(100%, 80rem);
  min-width: 0;
  margin: 0 auto;
`;

export const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.125rem;
  margin-bottom: 0.25rem;

  @media (max-width: 54rem) { flex-wrap: wrap; gap: 0.5rem; }
`;

export const Breadcrumb = styled.p`
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 500;
  span { color: ${({ theme }) => theme.colors.brand.blue}; }

  @media (max-width: 54rem) { width: 100%; }
`;

export const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const DetailCard = styled.article`
  ${cardSurface}
  min-height: 6.5rem;
  padding: 1.125rem 1.375rem;
`;

export const DetailCardTitle = styled.h2`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
`;

export const DetailCardText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const QuestionCard = styled(DetailCard)`
  min-height: 11.75rem;
  padding: 1.375rem 2rem 1.75rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 44rem) { padding: 1.25rem; }
`;

export const QuestionText = styled(DetailCardText)`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
`;

export const IntentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  margin-top: 1.5rem;
`;

export const IntentBadge = styled.span`
  padding: 0.25rem 1rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.brand.blue};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
`;

export const AnswerGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.025fr);
  grid-template-rows: repeat(2, minmax(6.5rem, auto));
  gap: 0.625rem 0.5rem;

  @media (max-width: 44rem) { grid-template-columns: 1fr; grid-template-rows: auto; }
`;

export const ModelAnswerCard = styled(DetailCard)`
  grid-column: 2;
  grid-row: 1 / 3;
  padding: 1.625rem;
  @media (max-width: 44rem) { grid-column: auto; grid-row: auto; padding: 1.125rem 1.375rem; }
`;

export const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #dcdde0;
  border-radius: 0.75rem;
  @media (max-width: 44rem) { grid-template-columns: 1fr; }
`;

export const SummaryCard = styled.article<{ $tone: "positive" | "negative" }>`
  min-width: 0;
  min-height: 9.125rem;
  padding: 1.625rem 1.75rem;
  background: ${({ $tone }) => $tone === "positive" ? "#eaf2fa" : "#f7eeee"};
  & + & { border-left: 1px solid #dcdde0; }
  @media (max-width: 44rem) { & + & { border-left: 0; border-top: 1px solid #dcdde0; } }
`;

export const SummaryTitle = styled.h2<{ $tone: "positive" | "negative" }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  color: ${({ $tone, theme }) => $tone === "positive" ? theme.colors.brand.blue : "#ff482b"};
  font-size: 1.125rem;
  font-weight: 600;
`;

export const FaceIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-linecap: round;
`;

export const SummaryText = styled(DetailCardText)`
  color: ${({ theme }) => theme.colors.text.default};
  & + & { margin-top: 0.5rem; }
`;

export const CoachCard = styled.article`
  ${cardSurface}
  display: flex;
  align-items: center;
  gap: 1.625rem;
  min-height: 7.25rem;
  margin-top: 0.375rem;
  padding: 1.375rem 2rem;
  border-color: #cccccc;
  background: ${({ theme }) => theme.colors.white};
  @media (max-width: 44rem) { gap: 1rem; padding: 1.25rem; }
`;

export const CoachIllustration = styled.div`
  width: 4rem;
  flex-shrink: 0;
  @media (max-width: 44rem) { width: 3rem; }
`;

export const RobotImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

export const CoachText = styled.p`
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
`;
