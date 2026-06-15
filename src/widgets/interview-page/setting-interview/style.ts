import styled from 'styled-components';

interface SelectButtonProps {
  $selected: boolean;
}

interface InterviewerCardProps {
  $selected: boolean;
}

interface ActionButtonProps {
  $disabled?: boolean;
}

export const Container = styled.div`
  --page-inline-padding: clamp(0.75rem, 4.4vw, 4.5rem);
  --panel-max-width: 52rem;
  --panel-padding: clamp(3rem, 5.4vh, 3.8rem)
    clamp(2.2rem, 3vw, 3rem)
    clamp(2.8rem, 4.5vh, 3.5rem);
  --section-gap: clamp(2.15rem, 3.8vh, 2.9rem);
  --section-inner-gap: clamp(1rem, 1.7vh, 1.3rem);
  --title-size: clamp(1.72rem, 1.46rem + 0.45vw, 2.05rem);
  --control-gap: clamp(0.9rem, 1.4vw, 1.45rem);
  --control-height: clamp(2.95rem, 4.7vh, 3.35rem);
  --control-font-size: clamp(0.95rem, 0.93rem + 0.06vw, 1rem);
  --control-padding-x: 1rem;
  --interviewer-gap: clamp(1rem, 1.5vw, 1.45rem);
  --interviewer-height: clamp(11rem, 20vh, 13.5rem);
  --interviewer-padding-y: clamp(0.95rem, 1.5vh, 1.15rem);
  --interviewer-padding-x: clamp(0.9rem, 1vw, 1.1rem);
  --interviewer-title-size: clamp(1.3rem, 1.14rem + 0.16vw, 1.46rem);
  --interviewer-text-size: clamp(0.94rem, 0.91rem + 0.04vw, 0.99rem);
  --action-button-width: clamp(12rem, 15vw, 15.5rem);
  --action-button-height: clamp(2.85rem, 4.2vh, 3.2rem);
  --action-gap: clamp(1rem, 1.7vw, 1.8rem);
  --action-font-size: clamp(0.94rem, 0.9rem + 0.08vw, 1rem);
  --content-stack-gap: clamp(1.7rem, 2.9vh, 2.2rem);

  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: clamp(1.15rem, 2.8vh, 1.8rem) var(--page-inline-padding)
    clamp(1.5rem, 4vh, 2.6rem);
  box-sizing: border-box;

  @media (min-width: 90rem) and (min-height: 52rem) {
    --panel-padding: 3.35rem 2.45rem 3.15rem;
    --section-gap: 2.45rem;
    --section-inner-gap: 1.15rem;
    --interviewer-gap: 1.2rem;
    --content-stack-gap: 2.25rem;
    padding-top: 1.5rem;
    padding-bottom: 2.7rem;
  }

  @media (max-height: 46rem) {
    padding-top: 0.55rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 64rem) {
    --page-inline-padding: clamp(0.75rem, 3vw, 1.5rem);
    --panel-max-width: 47rem;
  }

  @media (max-width: 48rem) {
    --page-inline-padding: 1rem;
    --panel-max-width: 100%;
    --panel-padding: 2.2rem 1.6rem 2rem;
    --section-gap: 1.45rem;
    --section-inner-gap: 0.85rem;
    --title-size: 1.58rem;
    --control-gap: 0.8rem;
    --control-height: 2.8rem;
    --interviewer-gap: 0.8rem;
    --interviewer-height: 9.8rem;
    --interviewer-title-size: 1.18rem;
    --interviewer-text-size: 0.9rem;
    --action-button-width: 100%;
    --content-stack-gap: 1.25rem;
    padding: 0.35rem 1rem 1rem;
  }
`;

export const ContentWrapper = styled.div`
  width: min(100%, var(--panel-max-width));
  height: min(100%, clamp(38.5rem, 72vh, 52rem));
  min-height: 0;
  box-sizing: border-box;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: #ffffff;
  border-radius: 1.25rem;
  padding: var(--panel-padding);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--content-stack-gap);

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 48rem) {
    height: auto;
    min-height: auto;
    border-radius: 1rem;
  }
`;

export const Sections = styled.div`
  width: 100%;
  margin: 0;
  min-height: 0;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--section-gap);
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--section-inner-gap);
`;

export const Title = styled.h2`
  margin: 0;
  font-size: var(--title-size);
  font-weight: 700;
  line-height: 1.15;
  color: #4a4d69;
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--control-gap);

  @media (max-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 34rem) {
    grid-template-columns: 1fr;
  }
`;

export const SelectButton = styled.button<SelectButtonProps>`
  min-height: var(--control-height);
  padding: 0.7rem var(--control-padding-x);
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#2f80ed' : '#d8deea')};
  border-radius: 0.65rem;
  background: ${({ $selected }) =>
    $selected ? 'rgba(47, 128, 237, 0.1)' : '#ffffff'};
  color: ${({ $selected }) => ($selected ? '#2f80ed' : '#5b5b5b')};
  font-size: var(--control-font-size);
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  line-height: 1.2;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-0.0625rem);
    border-color: #2f80ed;
    color: #2f80ed;
    box-shadow: 0 0 1.5rem rgba(47, 128, 237, 0.12);
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(47, 128, 237, 0.28);
    outline-offset: 0.125rem;
  }
`;

export const InterviewerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--interviewer-gap);

  @media (max-width: 56rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 34rem) {
    grid-template-columns: 1fr;
  }
`;

export const InterviewerCard = styled.div<InterviewerCardProps>`
  min-height: var(--interviewer-height);
  padding: var(--interviewer-padding-y) var(--interviewer-padding-x);
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#2f80ed' : '#edf2fb')};
  border-radius: 1.2rem;
  background: ${({ $selected }) =>
    $selected ? 'rgba(47, 128, 237, 0.08)' : '#ffffff'};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 0.95rem 2rem rgba(47, 128, 237, 0.18)'
      : '0 0.75rem 1.75rem rgba(47, 128, 237, 0.09)'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: translateY(-0.2rem);
    border-color: #2f80ed;
    box-shadow: 0 0.75rem 2rem rgba(47, 128, 237, 0.12);
  }

  &:focus-visible {
    outline: 0.125rem solid rgba(47, 128, 237, 0.28);
    outline-offset: 0.125rem;
  }
`;

export const InterviewerTitle = styled.h3`
  margin: 0 0 0.2rem;
  font-size: var(--interviewer-title-size);
  font-weight: 700;
  line-height: 1.15;
  color: #4a4d69;
`;

export const CardText = styled.span`
  font-size: var(--interviewer-text-size);
  font-weight: 600;
  line-height: 1.4;
  color: #666;
`;

export const BottomButtonWrapper = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--action-gap);
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (max-width: 40rem) {
    width: 100%;
    margin-top: 0;
    flex-direction: column;
    align-items: stretch;
  }
`;

const baseButton = styled.button<ActionButtonProps>`
  width: min(100%, var(--action-button-width));
  min-height: var(--action-button-height);
  border: none;
  border-radius: 0.65rem;
  font-size: var(--action-font-size);
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:disabled {
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 40rem) {
    width: 100%;
  }
`;

export const BackButton = styled(baseButton)`
  background: #f1f3f7;
  color: #2f80ed;

  &:hover {
    background: #e8edf5;
    box-shadow: 0 0.5rem 1.5rem rgba(15, 23, 42, 0.08);
  }
`;

export const NextButton = styled(baseButton)`
  background: ${({ $disabled }) => ($disabled ? '#cfd8e7' : '#2f80ed')};
  color: #ffffff;
  box-shadow: ${({ $disabled }) =>
    $disabled ? 'none' : '0 0.75rem 1.75rem rgba(47, 128, 237, 0.24)'};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? '#cfd8e7' : '#1f72df')};
    box-shadow: ${({ $disabled }) =>
      $disabled ? 'none' : '0 1rem 2rem rgba(47, 128, 237, 0.28)'};
  }
`;
