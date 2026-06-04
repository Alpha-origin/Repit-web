import styled, { css } from "styled-components";

interface TabButtonProps {
  $active: boolean;
}

interface QuestionItemButtonProps {
  $active: boolean;
}

const cardSurface = css`
  background: rgba(255, 255, 255, 0.92);
  border: 0.0625rem solid rgba(220, 230, 246, 0.96);
  border-radius: 0.8rem;
  box-shadow: 0 1rem 2.2rem rgba(60, 101, 168, 0.07);
`;

export const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionShell = styled.div`
  padding: 1rem;
  border-radius: 1.25rem;
  background: linear-gradient(
    180deg,
    rgba(234, 242, 255, 0.72),
    rgba(243, 247, 255, 0.82)
  );
  border: 0.0625rem solid rgba(217, 228, 247, 0.92);
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.55);

  @media (max-width: 48rem) {
    padding: 0.8rem;
    border-radius: 0.95rem;
  }
`;

export const TabGroup = styled.div`
  width: fit-content;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0.8rem;
  box-shadow: 0 0.85rem 2rem rgba(60, 102, 173, 0.08);
`;

export const TabButton = styled.button<TabButtonProps>`
  min-width: 13.2rem;
  height: 2.1rem;
  padding: 0 0.9rem;
  border: none;
  border-radius: 0.62rem;
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
  grid-template-columns: minmax(20rem, 23rem) minmax(0, 1fr);
  gap: 1rem;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
  }
`;

export const QuestionListCard = styled.article`
  ${cardSurface}
  border-radius: 0.95rem;
  padding: 1rem;
`;

export const SideTitle = styled.h3`
  margin: 0 0 0.9rem;
  color: #2b74e3;
  font-size: 1.28rem;
  font-weight: 700;
`;

export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const QuestionItemButton = styled.button<QuestionItemButtonProps>`
  width: 100%;
  min-height: 5.45rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 1rem 0.95rem;
  border-radius: 0.72rem;
  border: ${({ $active }) =>
    $active
      ? "0.125rem solid rgba(47, 117, 231, 0.92)"
      : "0.0625rem solid rgba(194, 214, 241, 0.95)"};
  background: #ffffff;
  box-shadow: ${({ $active }) =>
    $active ? "0 0.7rem 1.4rem rgba(47, 117, 231, 0.08)" : "none"};
  text-align: left;
  cursor: pointer;
`;

export const QuestionNumber = styled.span`
  min-width: 2.4rem;
  color: #2b74e3;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.5;
`;

export const QuestionPreview = styled.span`
  display: -webkit-box;
  color: #1c1c1c;
  font-size: 1.08rem;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const DetailColumn = styled.div`
  display: grid;
  grid-template-rows: auto auto auto minmax(8.5rem, 1fr);
  gap: 0.95rem;
  height: 100%;
  align-self: stretch;
  align-content: stretch;

  @media (max-width: 72rem) {
    grid-template-rows: none;
    height: auto;
    align-self: start;
    align-content: start;
  }
`;

export const QuestionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
`;

export const IntentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  margin-top: 2.2rem;
`;

export const DetailCard = styled.article`
  ${cardSurface}
  padding: 1.25rem 1.35rem;
`;

export const AnswerCard = styled(DetailCard)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
`;

export const DetailCardTitle = styled.h3`
  margin: 0;
  color: #2b74e3;
  font-size: 1.34rem;
  font-weight: 700;
`;

export const DetailCardText = styled.p`
  margin: 0;
  color: #191919;
  font-size: 1.14rem;
  font-weight: 500;
  line-height: 1.7;
  word-break: keep-all;
`;

export const IntentBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.5rem 1rem;
  border-radius: 0.32rem;
  background: linear-gradient(180deg, #2f75e7, #2667da);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
`;

export const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 36rem) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const AnswerToggleButton = styled.button`
  min-width: 8.8rem;
  height: 2.5rem;
  padding: 0 1rem;
  flex-shrink: 0;
  border-radius: 0.42rem;
  border: 0.0625rem solid rgba(213, 223, 239, 0.96);
  background: #ffffff;
  color: #5b5b5b;
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`;

export const SummaryShell = styled.section`
  padding: 1rem;
  border-radius: 1.15rem;
  background: linear-gradient(
    180deg,
    rgba(209, 222, 247, 0.92),
    rgba(223, 232, 250, 0.96)
  );
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 56rem) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.article`
  ${cardSurface}
  padding: 1.25rem 1.35rem;
`;

export const SummaryTitle = styled.h3`
  margin: 0 0 0.9rem;
  color: #2b74e3;
  font-size: 1.32rem;
  font-weight: 700;
`;

export const SummaryText = styled.p`
  margin: 0;
  color: #1d1d1d;
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.7;
  word-break: keep-all;

  & + & {
    margin-top: 0.7rem;
  }
`;

export const BottomBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CoachCard = styled.article`
  display: flex;
  align-items: flex-end;
  gap: 1.55rem;
  min-height: 11.6rem;
  padding: 1.75rem 1.8rem 1.35rem;
  border-radius: 0.75rem;
  background: #dcebfe;

  @media (max-width: 48rem) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    min-height: auto;
    padding: 1rem 1rem 1.15rem;
  }
`;

export const CoachIllustration = styled.div`
  width: clamp(3.4rem, 6vw, 4.5rem);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 0.15rem;
`;

export const RobotImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const CoachBubble = styled.div`
  position: relative;
  flex: 1;
  min-height: 9.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.8rem 1.5rem 1.55rem;
  background: transparent;
  overflow: hidden;

  @media (max-width: 48rem) {
    width: 100%;
    min-height: 7.8rem;
    padding: 0.7rem 0.8rem 0.85rem;
  }
`;

export const CoachBubbleImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
  user-select: none;
`;

export const CoachTextBox = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  width: min(100%, 85%);
  text-align: left;
  @media (max-width: 48rem) {
    width: min(100%, 92%);
  }
`;

export const CoachText = styled.p`
  margin: 0;
  color: #171717;
  max-width: 100%;
  font-size: 1.2rem;
  font-weight: 550;
  line-height: 1.58;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 0.35rem;

  @media (max-width: 40rem) {
    flex-direction: column;
  }
`;

const actionButton = css`
  min-width: 12.2rem;
  height: 3.1rem;
  padding: 0 1.35rem;
  border-radius: 0.62rem;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;

  @media (max-width: 40rem) {
    width: 100%;
  }
`;

export const SecondaryActionButton = styled.button`
  ${actionButton}
  border: 0.0625rem solid rgba(214, 224, 240, 0.96);
  background: #ffffff;
  color: #2b74e3;

  &:disabled {
    cursor: wait;
    opacity: 0.72;
  }
`;

export const PrimaryActionButton = styled.button`
  ${actionButton}
  border: none;
  background: linear-gradient(180deg, #2f75e7, #2667da);
  color: #ffffff;
`;
