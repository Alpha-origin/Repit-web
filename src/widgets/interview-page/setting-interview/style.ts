import styled, { css, keyframes } from 'styled-components';
import type {
  ActionButtonProps,
  SelectedProps,
  StyleIconProps,
} from './type';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const loadingDots = keyframes`
  0%, 20% {
    content: '.';
  }

  40%, 60% {
    content: '..';
  }

  80%, 100% {
    content: '...';
  }
`;

const focusRing = css`
  &:focus-visible {
    outline: 0.125rem solid rgba(47, 128, 237, 0.34);
    outline-offset: 0.125rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  padding: clamp(0.7rem, 2.4vh, 1.75rem)
    clamp(1.25rem, 6.8vw, 6.125rem)
    clamp(0.55rem, 1.8vh, 1.25rem);
  box-sizing: border-box;

  @media (max-width: 52rem) {
    height: auto;
    min-height: 100%;
    align-items: flex-start;
    overflow-y: auto;
    padding: 1.25rem 1rem 2rem;
  }
`;

export const ContentWrapper = styled.div`
  width: min(100%, 76.5rem);
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vh, 1rem);
  box-sizing: border-box;

  @media (max-width: 52rem) {
    height: auto;
    min-height: 100%;
  }
`;

export const Sections = styled.div`
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(20rem, 26.5rem) minmax(0, 1fr);
  gap: clamp(2rem, 4.6vw, 3.75rem);
  align-items: stretch;

  @media (max-width: 64rem) {
    grid-template-columns: minmax(18rem, 23rem) minmax(0, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 52rem) {
    flex: 0 0 auto;
    min-height: auto;
    grid-template-columns: 1fr;
  }

`;

export const ControlColumn = styled.div`
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(1rem, 4vh, 3rem);

  @media (max-width: 52rem) {
    min-height: auto;
    gap: 2rem;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(0.45rem, 1.3vh, 0.9rem);
`;

export const Title = styled.h2`
  margin: 0;
  color: #4d5570;
  font-size: clamp(1rem, 1.8vh, 1.5rem);
  font-weight: 800;
  line-height: 1.25;
`;

export const StyleOptionGroup = styled.div`
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  height: clamp(11rem, 30vh, 16rem);
  gap: 0.95rem;
`;

export const StyleOptionButton = styled.button<SelectedProps>`
  width: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 1.25rem 0.55rem 1rem;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  color: #171717;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-width: 30rem) {
    grid-template-columns: 2.1rem minmax(0, 1fr) 1.35rem;
    padding-inline: 1rem;
  }
`;

export const StyleIcon = styled.span<StyleIconProps>`
  position: relative;
  width: 2rem;
  height: 2rem;
  border: 0.125rem solid #111111;
  border-radius: 50%;
  box-sizing: border-box;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0.58rem;
    left: 0.52rem;
    width: 0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    background: #111111;
    box-shadow: 0.68rem 0 0 #111111;
  }

  span {
    position: absolute;
    left: 50%;
    bottom: ${({ $variant }) => ($variant === 'pressure' ? '0.42rem' : '0.48rem')};
    width: 0.82rem;
    height: ${({ $variant }) => ($variant === 'neutral' ? '0.12rem' : '0.42rem')};
    border: ${({ $variant }) =>
      $variant === 'neutral' ? 'none' : '0.125rem solid #111111'};
    border-top: 0;
    border-radius: 0 0 999rem 999rem;
    background: ${({ $variant }) => ($variant === 'neutral' ? '#111111' : 'transparent')};
    transform: translateX(-50%)
      ${({ $variant }) => ($variant === 'pressure' ? 'rotate(180deg)' : '')};
    transform-origin: center;
  }

`;

export const StyleTextGroup = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OptionLabel = styled.span`
  color: #171717;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
`;

export const OptionDescription = styled.span`
  color: #262626;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.35;
`;

export const SelectionCircle = styled.span<SelectedProps>`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.125rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#c8cbd0')};
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    display: ${({ $selected }) => ($selected ? 'block' : 'none')};
    left: 0.34rem;
    top: 0.18rem;
    width: 0.36rem;
    height: 0.62rem;
    border: solid #3388f7;
    border-width: 0 0.125rem 0.125rem 0;
    transform: rotate(45deg);
  }
`;

export const DifficultyGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: clamp(2.75rem, 6vh, 4rem);
  gap: 0.9rem;

  @media (max-width: 30rem) {
    grid-template-columns: 1fr;
  }
`;

export const DifficultyButton = styled.button<SelectedProps>`
  min-height: 0;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  color: #171717;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

`;

export const DifficultyIcon = styled.img`
  width: 2.15rem;
  height: 2.15rem;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;

  @media (max-height: 44rem) {
    width: 2rem;
    height: 2rem;
  }
`;

export const InterviewerGrid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(0.7rem, 2vh, 1.45rem);

  @media (max-width: 34rem) {
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  @media (max-width: 52rem) {
    height: auto;
    grid-template-rows: none;
  }
`;

export const InterviewerCard = styled.button<SelectedProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 0;
  appearance: none;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.5rem;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 1rem 2rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-width: 52rem) {
    height: auto;
    min-height: 16.75rem;
  }
`;

export const InterviewerImage = styled.img`
  width: 100%;
  height: clamp(5.25rem, 14vh, 10rem);
  flex: 0 0 auto;
  display: block;
  object-fit: cover;
  object-position: center;

  @media (max-width: 52rem) {
    height: 8.6rem;
  }
`;

export const InterviewerBody = styled.div<SelectedProps>`
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: clamp(0.55rem, 1.5vh, 1rem)
    clamp(0.7rem, 1.8vw, 1.5rem)
    clamp(0.6rem, 1.7vh, 1.25rem);
  background: ${({ $selected }) => ($selected ? '#eef6ff' : '#ffffff')};

  @media (max-width: 52rem) {
    min-height: 8.25rem;
  }
`;

export const InterviewerSelectedBadge = styled.span`
  position: absolute;
  top: 1.15rem;
  right: 1.15rem;
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 50%;
  background: #1f7bf2;
  box-shadow: 0 0.4rem 1rem rgba(31, 123, 242, 0.24);

  &::after {
    content: '';
    position: absolute;
    left: 0.48rem;
    top: 0.31rem;
    width: 0.38rem;
    height: 0.68rem;
    border: solid #ffffff;
    border-width: 0 0.15rem 0.15rem 0;
    transform: rotate(45deg);
  }
`;

export const InterviewerTitle = styled.h3`
  margin: 0;
  color: #3c3c3c;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.2;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 1rem;
  padding: 0.08rem 0.32rem;
  border: 0.0625rem solid #94c3ff;
  border-radius: 0.12rem;
  background: #eaf4ff;
  color: #1376ef;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const InterviewerDescription = styled.p`
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #4b4b4b;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const BottomButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: clamp(0.25rem, 1vh, 0.75rem);

  @media (max-width: 52rem) {
    margin-top: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;
  }

  @media (max-width: 34rem) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: #d14343;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
`;

const baseButton = styled.button<ActionButtonProps>`
  width: min(100%, 9.5rem);
  height: clamp(2.85rem, 5.8vh, 3.35rem);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 0.5rem;
  box-sizing: border-box;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.2;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:disabled {
    transform: none;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-width: 34rem) {
    width: 100%;
  }

  @media (max-height: 44rem) {
    height: 2.65rem;
    font-size: 1rem;
  }
`;

export const BackButton = styled(baseButton)`
  border: 0.0625rem solid #dde3ed;
  background: #ffffff;
  color: #171717;

  &:not(:disabled):hover {
    border-color: #cbd3df;
    box-shadow: 0 0.75rem 1.6rem rgba(15, 23, 42, 0.08);
  }
`;

export const NextButton = styled(baseButton)`
  border: 0.0625rem solid
    ${({ $disabled }) => ($disabled ? '#b9c7db' : '#257ee8')};
  background: ${({ $disabled }) => ($disabled ? '#b9c7db' : '#257ee8')};
  color: #ffffff;

  &:not(:disabled):hover {
    background: #176fd9;
    border-color: #176fd9;
    box-shadow: 0 0.85rem 1.7rem rgba(37, 126, 232, 0.2);
  }
`;

export const LoadingDots = styled.span`
  display: inline-block;
  width: 1.2em;
  text-align: left;

  &::after {
    content: '.';
    animation: ${loadingDots} 1.2s steps(1, end) infinite;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
`;

export const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 0.25rem solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.85s linear infinite;
`;

export const LoadingMessage = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
`;
