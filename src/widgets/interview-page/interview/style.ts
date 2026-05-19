import styled from "styled-components";

interface ModeButtonProps {
  $active: boolean;
}

interface CameraVideoProps {
  $visible: boolean;
}

export const Container = styled.section`
  width: 100%;
  min-height: 100%;
  overflow: visible;
  padding: clamp(0.35rem, 0.8vw, 0.85rem) clamp(1rem, 2.2vw, 1.75rem)
    clamp(1.5rem, 3vw, 2.5rem);
`;

export const Content = styled.div`
  width: min(100%, 90rem);
  min-height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: clamp(0.75rem, 1.4vh, 1.2rem);
  gap: clamp(3.9rem, 5.6vh, 4.5rem);
`;

export const InterviewBody = styled.div`
  width: min(100%, 86rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.9rem, 2.5vh, 2.15rem);
`;

export const PreviewSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const PreviewFrame = styled.div`
  position: relative;
  width: min(100%, clamp(28rem, 33vw, 36rem));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.95rem;
  background: #f6faff;
  border: none;

  @media (max-width: 40rem) {
    width: 100%;
    border-radius: 1rem;
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

export const QuestionCard = styled.article`
  width: 100%;
  min-height: clamp(20.5rem, 31vh, 23rem);
  padding: clamp(1.8rem, 2.4vw, 2.25rem) clamp(2.1rem, 2.8vw, 2.7rem)
    clamp(1.45rem, 1.9vw, 1.8rem);
  border-radius: 1.45rem;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #dce8fb;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;

  @media (max-width: 40rem) {
    border-radius: 1.15rem;
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
  font-size: clamp(1.55rem, 2vw, 1.95rem);
  font-weight: 800;
  letter-spacing: -0.05rem;
`;

export const Timer = styled.time`
  color: #050505;
  font-size: clamp(2.2rem, 3.2vw, 2.95rem);
  font-weight: 800;
  letter-spacing: -0.08rem;
`;

export const QuestionBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  place-items: center;
  padding: clamp(0.7rem, 1.1vw, 1.15rem) 0;
`;

export const QuestionText = styled.p`
  width: min(100%, 61rem);
  text-align: center;
  color: #111111;
  font-size: clamp(1.55rem, 2vw, 1.95rem);
  font-weight: 500;
  line-height: 1.42;
  letter-spacing: -0.05rem;
`;

export const AnswerStatus = styled.p`
  text-align: center;
  color: #5b6ce1;
  font-size: clamp(1.2rem, 1.45vw, 1.45rem);
  font-weight: 700;
`;

export const ModeControl = styled.div`
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem;
  border-radius: 0.8rem;
  border: 1px solid #d8e6fb;
  background: #f8fbff;

  @media (max-width: 40rem) {
    align-self: center;
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
`;

export const ActionRow = styled.div`
  width: min(100%, 38rem);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1.2rem, 1.9vw, 1.75rem);

  @media (max-width: 40rem) {
    width: 100%;
    gap: 0.9rem;
  }
`;

const actionButtonBase = styled.button`
  width: clamp(10.8rem, 12vw, 11.9rem);
  min-height: clamp(3.7rem, 5.4vh, 4.1rem);
  border: 1px solid transparent;
  border-radius: 1.1rem;
  font-size: clamp(1.22rem, 1.5vw, 1.45rem);
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

export const VisualizerButton = styled.button`
  width: clamp(6.6rem, 7.6vw, 7.2rem);
  min-width: 0;
  padding: 0.25rem 0.2rem;
  border: none;
  background: transparent;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const VisualizerIcon = styled.img`
  width: clamp(5.8rem, 7vw, 7rem);
  height: auto;
  display: block;
  filter: none;
`;

export const TextAnswerCard = styled.div`
  width: 100%;
  min-height: clamp(10.5rem, 18vh, 11.5rem);
  padding: 1.25rem 1.5rem;
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #dce3ee;
  box-shadow: 0 0.4rem 1.2rem rgba(15, 23, 42, 0.06);
`;

export const TextAnswerField = styled.textarea`
  width: 100%;
  min-height: clamp(8rem, 13vh, 9rem);
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
`;

export const TextActionRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 40rem) {
    flex-direction: column;
    align-items: stretch;
  }
`;
