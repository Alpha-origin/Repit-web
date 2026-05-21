import styled from 'styled-components';

export const Container = styled.div`
  --panel-width: clamp(52.5rem, 58vw, 70rem);
  --panel-height: clamp(43.75rem, 81vh, 53.75rem);
  --content-width: min(100%, 62.5rem);
  --panel-padding: clamp(2.375rem, 4.4vh, 3.125rem) clamp(1.75rem, 2.3vw, 2.25rem);
  --section-gap: clamp(2.75rem, 5.7vh, 3.625rem);
  --section-inner-gap: clamp(1rem, 2.1vh, 1.375rem);
  --title-size: clamp(1.65rem, 1.26rem + 0.52vw, 2.05rem);
  --control-gap: clamp(1.375rem, 2.2vw, 2.125rem);
  --control-height: clamp(2.625rem, 4.8vh, 3rem);
  --control-font-size: clamp(1.04rem, 0.96rem + 0.1vw, 1.12rem);
  --control-padding-x: clamp(1rem, 1vw, 1.25rem);
  --interviewer-gap: clamp(1.375rem, 2vw, 2.125rem);
  --interviewer-height: clamp(11.5rem, 21.5vh, 12.875rem);
  --interviewer-padding-y: clamp(1rem, 1.6vh, 1.25rem);
  --interviewer-padding-x: clamp(0.875rem, 0.9vw, 1.125rem);
  --interviewer-title-size: clamp(1.36rem, 1.12rem + 0.3vw, 1.56rem);
  --interviewer-text-size: clamp(1.05rem, 0.94rem + 0.14vw, 1.16rem);
  --action-button-width: clamp(16.25rem, 18.8vw, 21.25rem);
  --action-button-height: clamp(3rem, 5.4vh, 3.625rem);
  --action-gap: clamp(1.75rem, 2.1vw, 2.625rem);
  --action-font-size: clamp(1.13rem, 1.02rem + 0.14vw, 1.24rem);
  --action-top-gap: clamp(3rem, 6vh, 3.75rem);

  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  justify-items: center;
  align-items: center;
  overflow: hidden;
  padding: clamp(1rem, 2.4vh, 1.75rem) clamp(1rem, 2.4vw, 2rem) clamp(1.5rem, 4vh, 3rem);

  @media (max-width: 64rem) {
    --content-width: 100%;
    --panel-width: min(90vw, 57.5rem);
    --panel-height: min(100%, 47.5rem);
  }

  @media (max-width: 48rem) {
    --panel-width: calc(100vw - 2rem);
    --panel-height: auto;
    --panel-padding: 1.5rem;
    --section-gap: 1.75rem;
    --title-size: 1.75rem;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  width: min(100%, var(--panel-width));
  height: min(100%, var(--panel-height));
  min-height: 0;
  box-sizing: border-box;
  overflow-y: auto;
  background: #ffffff;
  border-radius: clamp(1.25rem, 2vw, 1.75rem);
  padding: var(--panel-padding);
  box-shadow: 0 1rem 2.5rem rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 48rem) {
    height: auto;
    max-height: 100%;
    padding: 1.5rem;
    border-radius: 1.25rem;
  }
`;

export const Sections = styled.div`
  width: var(--content-width);
  margin: 0 auto;
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
  font-size: var(--title-size);
  font-weight: 700;
  line-height: 1.1;
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

export const SelectButton = styled.button`
  min-height: var(--control-height);
  padding: 0.875rem var(--control-padding-x);
  border: 0.0625rem solid #d9dce3;
  border-radius: 0.95rem;
  background: #ffffff;
  color: #555;
  font-size: var(--control-font-size);
  font-weight: 600;
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

export const InterviewerCard = styled.div`
  min-height: var(--interviewer-height);
  padding: var(--interviewer-padding-y) var(--interviewer-padding-x);
  border: 0.0625rem solid #edf0f5;
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 0.5rem 1.5rem rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  text-align: center;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-0.2rem);
    border-color: #2f80ed;
    box-shadow: 0 0.75rem 2rem rgba(47, 128, 237, 0.12);
  }
`;

export const InterviewerTitle = styled.h3`
  margin-bottom: 0.25rem;
  font-size: var(--interviewer-title-size);
  font-weight: 700;
  line-height: 1.15;
  color: #4a4d69;
`;

export const CardText = styled.span`
  font-size: var(--interviewer-text-size);
  font-weight: 500;
  line-height: 1.45;
  color: #666;
`;

export const BottomButtonWrapper = styled.div`
  width: var(--content-width);
  position: absolute;
  left: 50%;
  bottom: clamp(1.75rem, 4.2vh, 2.625rem);
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--action-gap);
  flex-wrap: wrap;

  @media (max-width: 40rem) {
    position: static;
    width: 100%;
    margin: var(--action-top-gap) auto 0;
    transform: none;
    flex-direction: column;
    align-items: stretch;
  }
`;

const baseButton = styled.button`
  width: min(100%, var(--action-button-width));
  min-height: var(--action-button-height);
  border: none;
  border-radius: 1rem;
  font-size: var(--action-font-size);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;


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
  background: #2f80ed;
  color: #ffffff;
  box-shadow: 0 0.75rem 1.75rem rgba(47, 128, 237, 0.24);

  &:hover {
    background: #1f72df;
    box-shadow: 0 1rem 2rem rgba(47, 128, 237, 0.28);
  }
`;
