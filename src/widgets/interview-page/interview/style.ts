import styled, { css } from "styled-components";

interface ModeButtonProps {
  $active: boolean;
}

interface CameraVideoProps {
  $visible: boolean;
}

interface VoiceLayoutProps {
  $voiceMode?: boolean;
}

interface TextLayoutProps {
  $textMode?: boolean;
}

interface VoiceLevelProps {
  $voiceLevel?: number;
}

export const Container = styled.section<VoiceLayoutProps & TextLayoutProps>`
  width: 100vw;
  max-width: 100vw;
  height: 100%;
  min-height: 100%;
  align-self: stretch;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  padding: clamp(0.4rem, 1vh, 0.9rem) clamp(1rem, 2.4vw, 1.9rem)
    clamp(1.4rem, 2.8vh, 2.15rem);
  box-sizing: border-box;

  ${({ $voiceMode, $textMode }) =>
    ($voiceMode || $textMode) &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}

  @media (max-width: 48rem) {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    overflow: auto;
    padding: 0.5rem 1rem 1rem;
  }

  @media (max-height: 56rem) {
    overflow-y: auto;
    padding: 0.35rem 1rem 0.9rem;
  }
`;

export const Content = styled.div<VoiceLayoutProps & TextLayoutProps>`
  width: ${({ $voiceMode, $textMode }) =>
    $voiceMode ? "min(100%, 88rem)" : $textMode ? "min(100%, 80rem)" : "100%"};
  height: ${({ $voiceMode, $textMode }) => ($voiceMode || $textMode ? "auto" : "100%")};
  min-height: ${({ $voiceMode, $textMode }) =>
    $voiceMode || $textMode ? "0" : "100%"};
  margin: 0 auto;
  padding-top: clamp(0.65rem, 1.4vh, 1rem);
  gap: clamp(2.2rem, 4.2vh, 3rem);
  box-sizing: border-box;

  ${({ $voiceMode, $textMode }) =>
    $voiceMode
      ? css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        `
      : $textMode
        ? css`
            height: auto;
            min-height: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            flex: 0 0 auto;
          `
      : css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        `}

  @media (max-height: 56rem) {
    padding-top: 0.25rem;
    gap: 1.25rem;

    ${({ $voiceMode, $textMode }) =>
      $voiceMode
        ? css`
            align-items: center;
            justify-content: center;
          `
        : $textMode &&
          css`
            align-items: stretch;
          `}
  }
`;

export const InterviewBody = styled.div<VoiceLayoutProps & TextLayoutProps>`
  width: min(100%, 78rem);
  gap: clamp(1.5rem, 2.2vh, 1.95rem);
  min-height: 0;

  ${({ $voiceMode, $textMode }) =>
    $voiceMode
      ? css`
          height: auto;
          display: grid;
          grid-template-rows: auto auto;
          align-content: center;
          align-items: center;
          justify-items: center;
        `
      : $textMode
        ? css`
            height: clamp(29rem, 56vh, 34rem);
            display: grid;
            grid-template-rows: minmax(0, 1fr) auto auto;
            align-content: stretch;
            justify-items: center;
          `
      : css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}

  @media (max-height: 56rem) {
    gap: 0.9rem;

    ${({ $textMode }) =>
      $textMode &&
      css`
        height: auto;
        grid-template-rows: auto auto auto;
        align-content: start;
      `}
  }
`;

export const PreviewSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const PreviewFrame = styled.div`
  position: relative;
  width: min(100%, clamp(30rem, 33vw, 34rem));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #f6faff;
  border: none;
  box-shadow: 0 0.75rem 2rem rgba(69, 100, 167, 0.12);

  @media (max-width: 40rem) {
    width: 100%;
    border-radius: 0.85rem;
  }

  @media (max-height: 56rem) {
    width: min(100%, clamp(24rem, 29vw, 28rem));
  }

  @media (max-height: 46rem) {
    width: min(100%, clamp(21rem, 26vw, 24rem));
  }
`;

export const CameraVideo = styled.video<CameraVideoProps>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scaleX(-1);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

export const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.04));
`;

export const CameraFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.55rem;
  padding: 0 1.5rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(237, 244, 255, 0.96));
`;

export const CameraFallbackTitle = styled.strong`
  color: #1a73e8;
  font-size: clamp(1rem, 1.35vw, 1.18rem);
  font-weight: 800;
  letter-spacing: -0.04rem;
`;

export const CameraFallbackText = styled.p`
  color: #5d6b86;
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const QuestionCard = styled.article<VoiceLayoutProps & TextLayoutProps>`
  width: 100%;
  min-height: clamp(18.5rem, 29vh, 20.75rem);
  padding: clamp(1.55rem, 2vw, 1.95rem) clamp(2rem, 2.6vw, 2.45rem)
    clamp(1.35rem, 1.8vw, 1.65rem);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.98);
  border: 0.0625rem solid rgba(220, 232, 251, 0.76);
  box-shadow: 0 1rem 2.5rem rgba(112, 143, 206, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  min-width: 0;

  ${({ $voiceMode, $textMode }) =>
    $voiceMode
      ? css`
          min-height: clamp(16.5rem, 25vh, 18.5rem);
          padding: clamp(1.4rem, 1.85vw, 1.7rem) clamp(1.85rem, 2.4vw, 2.25rem)
            clamp(1.2rem, 1.55vw, 1.4rem);
          align-self: start;
        `
      : $textMode &&
        css`
          height: 100%;
          min-height: 0;
        `}

  @media (max-width: 40rem) {
    border-radius: 0.9rem;
  }

  @media (max-height: 56rem) {
    min-height: clamp(14.75rem, 23vh, 16.5rem);
    padding: 1.15rem 1.5rem 1.05rem;
    gap: 0.7rem;
  }

  @media (max-height: 46rem) {
    min-height: clamp(13.25rem, 21vh, 14.75rem);
    padding: 1rem 1.35rem 0.95rem;
  }
`;

export const QuestionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

export const QuestionLabel = styled.span`
  color: #6b7a95;
  font-size: clamp(1.7rem, 2.1vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.05rem;

  @media (max-height: 56rem) {
    font-size: 1.45rem;
  }
`;

export const Timer = styled.time`
  color: #050505;
  font-size: clamp(2.35rem, 3.3vw, 3.1rem);
  font-weight: 800;
  letter-spacing: -0.08rem;

  @media (max-height: 56rem) {
    font-size: 2.35rem;
  }
`;

export const QuestionBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.45rem, 0.9vw, 0.85rem) 0 clamp(0.2rem, 0.5vw, 0.45rem);

  @media (max-height: 56rem) {
    padding: 0.15rem 0;
  }
`;

export const QuestionContentStack = styled.div`
  width: min(100%, 58rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.2rem, 2vh, 1.8rem);

  @media (max-height: 56rem) {
    width: min(100%, 52rem);
    gap: 1rem;
  }
`;

export const QuestionText = styled.p`
  width: 100%;
  margin: 0;
  text-align: center;
  color: #111111;
  font-size: clamp(1.75rem, 2.05vw, 2.15rem);
  font-weight: 500;
  line-height: 1.46;
  letter-spacing: -0.05rem;

  @media (max-height: 56rem) {
    font-size: 1.5rem;
    line-height: 1.38;
  }

  @media (max-height: 46rem) {
    font-size: 1.28rem;
  }
`;

export const QuestionFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 1rem;

  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.85rem;
  }
`;

export const FooterSpacer = styled.div`
  min-width: 0;

  @media (max-width: 40rem) {
    display: none;
  }
`;

export const QuestionAudioButton = styled.button`
  justify-self: start;
  min-width: 6.8rem;
  min-height: 2.8rem;
  padding: 0.55rem 1rem;
  border: 0.0625rem solid #d8e6fb;
  border-radius: 999rem;
  background: rgba(255, 255, 255, 0.96);
  color: #256fdb;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #f4f9ff;
    border-color: #b8d5ff;
    transform: translateY(-0.04rem);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  @media (max-width: 40rem) {
    justify-self: center;
  }

  @media (max-height: 56rem) {
    min-height: 2.5rem;
    padding: 0.5rem 0.9rem;
    font-size: 0.88rem;
  }
`;

export const AnswerStatus = styled.p`
  margin: 0;
  text-align: center;
  justify-self: center;
  color: #5b6ce1;
  font-size: clamp(1.2rem, 1.45vw, 1.55rem);
  font-weight: 700;

  @media (max-height: 56rem) {
    font-size: 1.08rem;
  }
`;

export const ModeControl = styled.div`
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem;
  border-radius: 0.7rem;
  border: 0.0625rem solid #d8e6fb;
  background: #ffffff;
  box-shadow: 0 0.35rem 1rem rgba(107, 122, 149, 0.08);

  @media (max-width: 40rem) {
    justify-self: center;
  }

  @media (max-height: 56rem) {
    padding: 0.2rem;
  }
`;

export const ModeButton = styled.button<ModeButtonProps>`
  min-width: 4.3rem;
  padding: 0.42rem 0.9rem;
  border: none;
  border-radius: 0.64rem;
  background: ${({ $active }) => ($active ? "#2f6df6" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#2f6df6" : "#f3f6fb")};
  }

  @media (max-height: 56rem) {
    min-width: 3.85rem;
    padding: 0.36rem 0.75rem;
    font-size: 0.88rem;
  }
`;

export const ActionRow = styled.div`
  width: min(100%, 34rem);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 1.6vw, 1.4rem);

  @media (max-width: 40rem) {
    width: 100%;
    gap: 0.9rem;
  }

  @media (max-height: 56rem) {
    width: min(100%, 31rem);
    gap: 0.85rem;
  }
`;

const actionButtonBase = styled.button`
  width: clamp(9.8rem, 11vw, 10.8rem);
  min-height: clamp(3.45rem, 4.9vh, 3.9rem);
  border: 0.0625rem solid transparent;
  border-radius: 0.95rem;
  font-size: clamp(1.15rem, 1.35vw, 1.3rem);
  font-weight: 800;
  cursor: pointer;
  flex: 0 0 auto;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
  }

  @media (max-height: 56rem) {
    width: 8.75rem;
    min-height: 3rem;
    font-size: 1.02rem;
  }
`;

export const SecondaryAction = styled(actionButtonBase)`
  background: rgba(255, 255, 255, 0.96);
  border-color: #d8e6fb;
  color: #111111;

  &:hover {
    background: #f7fbff;
    border-color: #b8d5ff;
  }
`;

export const PrimaryAction = styled(actionButtonBase)`
  background: #3388f7;
  color: #ffffff;

  &:hover {
    background: #2a79e5;
  }
`;

export const InlineVisualizerWrap = styled.div<VoiceLevelProps>`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: ${({ $voiceLevel = 0 }) =>
    `drop-shadow(0 0 ${0.55 + $voiceLevel * 0.95}rem rgba(51, 136, 247, ${0.14 + $voiceLevel * 0.18}))`};
  transition: filter 90ms linear;

  &::before {
    content: "";
    position: absolute;
    width: clamp(5.2rem, 6.4vw, 6.2rem);
    aspect-ratio: 1;
    border-radius: 999rem;
    background: radial-gradient(
      circle,
      rgba(51, 136, 247, 0.2) 0%,
      rgba(51, 136, 247, 0.08) 45%,
      rgba(51, 136, 247, 0) 72%
    );
    opacity: ${({ $voiceLevel = 0 }) => 0.12 + $voiceLevel * 0.32};
    transform: ${({ $voiceLevel = 0 }) => `scale(${0.92 + $voiceLevel * 0.48})`};
    transition:
      opacity 90ms linear,
      transform 90ms linear;
  }
`;

export const InlineVisualizerIcon = styled.img<VoiceLevelProps>`
  width: clamp(4.6rem, 5.6vw, 5.4rem);
  position: relative;
  z-index: 1;
  height: auto;
  display: block;
  filter: none;
  transform-origin: center;
  transform: ${({ $voiceLevel = 0 }) =>
    `scale(${0.94 + $voiceLevel * 0.42}) translateY(${-0.2 * $voiceLevel}rem)`};
  opacity: ${({ $voiceLevel = 0 }) => 0.88 + $voiceLevel * 0.12};
  transition:
    transform 90ms linear,
    opacity 90ms linear;

  @media (max-height: 56rem) {
    width: 4.2rem;
  }
`;

export const TextAnswerCard = styled.div`
  width: 100%;
  min-height: clamp(5.9rem, 9.5vh, 6.8rem);
  height: auto;
  padding: 0.9rem 1.2rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.97);
  border: 0.0625rem solid #dce3ee;
  box-shadow: 0 0.4rem 1.2rem rgba(15, 23, 42, 0.06);
  min-width: 0;
  box-sizing: border-box;

  @media (max-height: 56rem) {
    min-height: 5.2rem;
    padding: 0.8rem 1rem;
  }
`;

export const TextAnswerField = styled.textarea`
  width: 100%;
  height: auto;
  min-height: clamp(4.4rem, 7vh, 5.1rem);
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: #111111;
  font-size: clamp(1.15rem, 1.45vw, 1.32rem);
  line-height: 1.7;

  &::placeholder {
    color: #98a2b3;
  }

  @media (max-height: 56rem) {
    min-height: 3.9rem;
    font-size: 1rem;
    line-height: 1.55;
  }
`;

export const TextActionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  padding-inline: clamp(0.2rem, 1vw, 0.6rem);
  box-sizing: border-box;

  & > button {
    flex: 0 0 auto;
  }

  @media (max-width: 40rem) {
    width: 100%;
    gap: 0.75rem;
    padding-inline: 0;

    & > button {
      width: clamp(7.6rem, 42vw, 9.6rem);
    }
  }

  @media (max-height: 56rem) {
    gap: 0.85rem;
  }
`;
