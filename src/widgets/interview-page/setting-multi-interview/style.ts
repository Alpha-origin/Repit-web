import styled, { css, keyframes } from "styled-components";

interface SlotButtonProps {
  $active: boolean;
  $filled: boolean;
}

interface CandidateCardProps {
  $disabled: boolean;
  $selected: boolean;
}

interface ActionButtonProps {
  $analyzing?: boolean;
}

const focusRing = css`
  &:focus-visible {
    outline: 0.15rem solid rgba(37, 126, 232, 0.48);
    outline-offset: 0.15rem;
  }
`;

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

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  overflow-x: hidden;
  overflow-y: auto;
  padding: clamp(1.65rem, 4.2vh, 2.15rem) clamp(1.25rem, 6.8vw, 6.5rem)
    clamp(1.25rem, 3vh, 1.55rem);
  box-sizing: border-box;

  @media (max-width: 52rem) {
    align-items: flex-start;
    padding: 0.9rem 1rem 1rem;
  }

  @media (max-height: 44rem) {
    padding-top: 0.55rem;
    padding-bottom: 0.55rem;
  }
`;

export const Content = styled.div`
  width: min(100%, 82rem);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(0.7rem, 1.8vh, 1.35rem);
  margin: 0 auto;
`;

export const MainGrid = styled.div`
  --interviewer-card-height: clamp(16rem, 30vh, 18rem);
  --setting-group-height: clamp(14rem, 30vh, 16rem);
  --interviewer-image-height: clamp(7.5rem, 18vh, 10rem);
  --setting-column-gap: clamp(1.5rem, 4vh, 2.75rem);
  --style-option-gap: clamp(0.65rem, 1.3vh, 0.85rem);

  display: grid;
  grid-template-columns: minmax(21rem, 28rem) minmax(0, 1fr);
  gap: clamp(1.7rem, 2.8vw, 2.75rem);
  align-items: stretch;

  @media (max-width: 64rem) {
    --interviewer-card-height: clamp(13.5rem, 28vh, 16rem);
    --setting-group-height: clamp(12.25rem, 27vh, 14rem);
    --interviewer-image-height: clamp(6.5rem, 16vh, 8.5rem);

    grid-template-columns: minmax(18.5rem, 23rem) minmax(0, 1fr);
    gap: 1.35rem;
  }

  @media (max-height: 52rem) {
    --interviewer-card-height: clamp(12rem, 26vh, 13.5rem);
    --setting-group-height: clamp(11.25rem, 25vh, 13rem);
    --interviewer-image-height: clamp(5.75rem, 14vh, 7rem);
    --setting-column-gap: clamp(1.25rem, 3.4vh, 2rem);
    --style-option-gap: 0.45rem;
  }

  @media (max-height: 44rem) {
    --interviewer-card-height: clamp(10.25rem, 25vh, 11.5rem);
    --setting-group-height: clamp(10.25rem, 24vh, 11.5rem);
    --interviewer-image-height: clamp(5rem, 12vh, 5.5rem);
    --setting-column-gap: 0.75rem;
    --style-option-gap: 0.4rem;
  }

  @media (max-width: 52rem) {
    --interviewer-card-height: 14.5rem;
    --setting-group-height: 13rem;
    --interviewer-image-height: 7.5rem;
    --setting-column-gap: 1.5rem;

    grid-template-columns: 1fr;
    align-items: start;
  }
`;

export const InterviewerColumn = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Section = styled.section`
  min-width: 0;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 0.7rem;
  color: #4d5570;
  font-size: clamp(1rem, 0.92rem + 0.25vw, 1.2rem);
  font-weight: 800;
  line-height: 1.25;
`;

export const SlotGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 0.65rem;

  @media (max-width: 64rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 32rem) {
    grid-template-columns: 1fr;
  }
`;

export const SlotButton = styled.button<SlotButtonProps>`
  min-height: clamp(9.5rem, 24vh, 12.75rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  border: 0.1rem solid
    ${({ $active, $filled }) => ($active ? "#3388f7" : $filled ? "#d3d8e1" : "#e2e6ed")};
  border-style: ${({ $filled }) => ($filled ? "solid" : "dashed")};
  border-radius: 0.5rem;
  background: ${({ $active }) => ($active ? "#eef4ff" : "#ffffff")};
  color: #171717;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.11);
  }

  ${focusRing}
`;

export const SlotImage = styled.img`
  width: 100%;
  height: clamp(4.5rem, 11vh, 6rem);
  object-fit: cover;
`;

export const SlotBody = styled.span`
  min-height: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem;
  text-align: center;
`;

export const SlotNumber = styled.span`
  color: #667085;
  font-size: 0.72rem;
  font-weight: 700;
`;

export const SlotName = styled.strong`
  color: #2479e8;
  font-size: clamp(0.9rem, 0.84rem + 0.18vw, 1.05rem);
  line-height: 1.25;
`;

export const SlotRole = styled.span`
  color: #4d5570;
  font-size: 0.74rem;
  font-weight: 700;
`;

export const SlotSpecialty = styled.span`
  overflow: hidden;
  max-width: 100%;
  color: #6b7280;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SlotPrompt = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  padding: 0.08rem 0.45rem;
  border: 0.0625rem solid #9bc5ff;
  border-radius: 999rem;
  color: #1976e8;
  font-size: 0.68rem;
  font-weight: 800;
`;

export const CandidateScroller = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  overflow: hidden;
  padding: 0;

  @media (max-width: 52rem) {
    grid-template-columns: repeat(5, minmax(10rem, 1fr));
    overflow-x: auto;
  }
`;

export const CandidateCard = styled.button<CandidateCardProps>`
  display: flex;
  min-width: 0;
  flex-direction: column;
  min-height: var(--interviewer-card-height);
  overflow: hidden;
  padding: 0;
  border: 0.1rem solid
    ${({ $selected, $disabled }) =>
      $selected ? "#aeb7c6" : $disabled ? "#e1e5eb" : "#cfd7e4"};
  border-radius: 0.5rem;
  background: ${({ $selected, $disabled }) =>
    $selected ? "#e5e7eb" : $disabled ? "#f8f9fb" : "#ffffff"};
  color: #171717;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.56 : 1)};
  scroll-snap-align: start;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:not(:disabled):hover {
    border-color: #3388f7;
    box-shadow: 0 0.85rem 1.8rem rgba(38, 111, 224, 0.12);
    transform: translateY(-0.08rem);
  }

  ${focusRing}
`;

export const CandidateImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: var(--interviewer-image-height);
  overflow: hidden;
  margin: 0;
  flex: 0 0 auto;
  background: #d8d3ce;
`;

export const CandidateImage = styled.img`
  position: absolute;
  top: -15%;
  left: 0;
  width: 100%;
  height: 130%;
  display: block;
  object-fit: cover;
`;

export const CandidateBody = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  padding: 0.7rem;
`;

export const CandidateName = styled.h3`
  margin: 0;
  color: #303642;
  font-size: 0.96rem;
  font-weight: 800;
`;

export const RoleBadge = styled.span`
  width: fit-content;
  padding: 0.12rem 0.35rem;
  border: 0.0625rem solid #9bc5ff;
  border-radius: 0.18rem;
  background: #eff6ff;
  color: #1976e8;
  font-size: 0.63rem;
  font-weight: 800;
`;

export const CandidateSpecialty = styled.p`
  margin: 0;
  color: #596273;
  font-size: 0.72rem;
  font-weight: 700;
`;

export const CandidateDescription = styled.p`
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: #667085;
  font-size: 0.7rem;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const CatalogHint = styled.p`
  margin: 0.65rem 0 0;
  color: #697386;
  font-size: 0.76rem;
  line-height: 1.4;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: #d14343;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.5rem;

  @media (max-width: 32rem) {
    flex-direction: column-reverse;
  }
`;

const actionButton = styled.button<ActionButtonProps>`
  width: ${({ $analyzing }) =>
    $analyzing ? 'min(100%, 8rem)' : 'min(100%, 9.5rem)'};
  height: ${({ $analyzing }) => ($analyzing ? '2.7rem' : '3rem')};
  border-radius: 0.5rem;
  font-size: ${({ $analyzing }) => ($analyzing ? '0.85rem' : '1rem')};
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  ${focusRing}

  @media (max-width: 32rem) {
    width: 100%;
  }
`;

export const BackButton = styled(actionButton)`
  border: 0.0625rem solid #dde3ed;
  background: #ffffff;
  color: #20242b;
`;

export const NextButton = styled(actionButton)`
  border: 0.0625rem solid ${({ disabled }) => (disabled ? "#b9c7db" : "#257ee8")};
  background: ${({ disabled }) => (disabled ? "#b9c7db" : "#257ee8")};
  color: #ffffff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
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
  z-index: 1000;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.58);
`;

export const LoadingSpinner = styled.span`
  width: 3.5rem;
  height: 3.5rem;
  border: 0.25rem solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.85s linear infinite;
`;

export const LoadingText = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
`;

export const OptionsLock = styled.fieldset`
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
`;

export const SettingsPanel = styled(OptionsLock)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ChoiceRow = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 0.7rem;
  & + & { margin-top: 0.7rem; }
`;

export const ChoiceButton = styled.button<{ $selected: boolean; $unavailable?: boolean }>`
  min-width: 0;
  min-height: 3rem;
  padding: 0.6rem 0.3rem;
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.colors.brand.blue : "#d3d8e1"};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $selected, theme }) => $selected ? theme.colors.surface.blueLight : theme.colors.white};
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    cursor: ${({ $unavailable }) => $unavailable ? "not-allowed" : "wait"};
    opacity: 0.65;
    ${({ $unavailable, theme }) => $unavailable ? `background: ${theme.colors.surface.subtle};` : ""}
  }
  ${focusRing}
`;

export const SelectedLabel = styled.span`
  display: block;
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 500;
`;

export const IdentityRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(5rem, 1fr));
  gap: 0.55rem;
  overflow-x: auto;
  padding-bottom: 0.3rem;
`;

export const IdentityButton = styled(ChoiceButton)`
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`;

export const IdentityImage = styled.img`
  width: 100%;
  height: 4rem;
  object-fit: cover;
  border-radius: 0.3rem;
`;
