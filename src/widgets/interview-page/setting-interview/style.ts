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
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: visible;
  padding: clamp(1.75rem, 4vh, 2.7rem) clamp(1.25rem, 6.8vw, 6.125rem)
    clamp(2rem, 4.6vh, 3.6rem);
  box-sizing: border-box;

  @media (max-width: 48rem) {
    padding: 1.25rem 1rem 2rem;
  }
`;

export const ContentWrapper = styled.div`
  width: min(100%, 76.5rem);
  min-height: min(100%, 42.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.4vh, 1.6rem);
  box-sizing: border-box;
`;

export const Sections = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(20rem, 26.5rem) minmax(0, 1fr);
  gap: clamp(2rem, 4.6vw, 3.75rem);
  align-items: start;

  @media (max-width: 64rem) {
    grid-template-columns: minmax(18rem, 23rem) minmax(0, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 52rem) {
    grid-template-columns: 1fr;
  }

`;

export const ControlColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(3.2rem, 8vh, 5rem);

  @media (max-width: 52rem) {
    gap: 2rem;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const Title = styled.h2`
  margin: 0;
  color: #4d5570;
  font-size: clamp(1.35rem, 1.2rem + 0.24vw, 1.5rem);
  font-weight: 800;
  line-height: 1.25;
`;

export const StyleOptionGroup = styled.div`
  display: grid;
  gap: 0.95rem;
`;

export const StyleOptionButton = styled.button<SelectedProps>`
  width: 100%;
  min-height: 5.35rem;
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.85rem 0.95rem 1.25rem;
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
  gap: 0.9rem;

  @media (max-width: 30rem) {
    grid-template-columns: 1fr;
  }
`;

export const DifficultyButton = styled.button<SelectedProps>`
  min-height: 4rem;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.4rem, 2.6vw, 1.85rem);

  @media (max-width: 34rem) {
    grid-template-columns: 1fr;
  }
`;

export const InterviewerCard = styled.button<SelectedProps>`
  position: relative;
  overflow: hidden;
  min-width: 0;
  min-height: clamp(16.75rem, 31vh, 18.4rem);
  padding: 0;
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
`;

export const InterviewerImage = styled.img`
  width: 100%;
  height: clamp(8.6rem, 15vw, 10rem);
  display: block;
  object-fit: cover;
`;

export const InterviewerBody = styled.div<SelectedProps>`
  min-height: 8.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem clamp(1.1rem, 2.8vw, 2.65rem) 1.25rem;
  background: ${({ $selected }) => ($selected ? '#eef6ff' : '#ffffff')};
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
  margin: 0;
  color: #4b4b4b;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
`;

export const BottomButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: clamp(0.85rem, 2vh, 1.25rem);

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
