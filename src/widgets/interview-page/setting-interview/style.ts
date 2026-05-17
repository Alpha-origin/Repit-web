import styled from 'styled-components';

export const Container = styled.div`
  --panel-width: clamp(840px, 58vw, 1120px);
  --panel-height: clamp(700px, 81vh, 860px);
  --content-width: min(100%, 1000px);
  --panel-padding: clamp(38px, 4.4vh, 50px) clamp(28px, 2.3vw, 36px);
  --section-gap: clamp(44px, 5.7vh, 58px);
  --section-inner-gap: clamp(16px, 2.1vh, 22px);
  --title-size: clamp(1.65rem, 1.26rem + 0.52vw, 2.05rem);
  --control-gap: clamp(22px, 2.2vw, 34px);
  --control-height: clamp(42px, 4.8vh, 48px);
  --control-font-size: clamp(1.04rem, 0.96rem + 0.1vw, 1.12rem);
  --control-padding-x: clamp(16px, 1vw, 20px);
  --interviewer-gap: clamp(22px, 2vw, 34px);
  --interviewer-height: clamp(184px, 21.5vh, 206px);
  --interviewer-padding-y: clamp(16px, 1.6vh, 20px);
  --interviewer-padding-x: clamp(14px, 0.9vw, 18px);
  --interviewer-title-size: clamp(1.36rem, 1.12rem + 0.3vw, 1.56rem);
  --interviewer-text-size: clamp(1.05rem, 0.94rem + 0.14vw, 1.16rem);
  --action-button-width: clamp(260px, 18.8vw, 340px);
  --action-button-height: clamp(48px, 5.4vh, 58px);
  --action-gap: clamp(28px, 2.1vw, 42px);
  --action-font-size: clamp(1.13rem, 1.02rem + 0.14vw, 1.24rem);
  --action-top-gap: clamp(48px, 6vh, 60px);

  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  justify-items: center;
  align-items: center;
  overflow: hidden;
  padding: clamp(16px, 2.4vh, 28px) clamp(16px, 2.4vw, 32px) clamp(24px, 4vh, 48px);

  @media (max-width: 64rem) {
    --content-width: 100%;
    --panel-width: min(90vw, 920px);
    --panel-height: min(100%, 760px);
  }

  @media (max-width: 48rem) {
    --panel-width: calc(100vw - 32px);
    --panel-height: auto;
    --panel-padding: 24px;
    --section-gap: 28px;
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
  border: 1px solid #d9dce3;
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
    transform: translateY(-1px);
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
  border: 1px solid #edf0f5;
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
  bottom: clamp(28px, 4.2vh, 42px);
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

  &:hover {
    transform: translateY(-1px);
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
  background: #2f80ed;
  color: #ffffff;
  box-shadow: 0 0.75rem 1.75rem rgba(47, 128, 237, 0.24);

  &:hover {
    background: #1f72df;
    box-shadow: 0 1rem 2rem rgba(47, 128, 237, 0.28);
  }
`;
