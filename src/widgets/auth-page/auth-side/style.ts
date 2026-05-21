import styled from "styled-components";

interface SectionProps {
  $backgroundImage: string;
}

export const Section = styled.section<SectionProps>`
  position: relative;
  width: 50%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 2.5rem 0 clamp(4rem, 8vw, 9rem);
  box-sizing: border-box;
  background-color: #1a73e8;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  @media (max-width: 60rem) {
    width: 100%;
    min-height: 42vh;
    align-items: flex-end;
    padding: 2.5rem;
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  width: min(27rem, 100%);
  color: #ffffff;

  @media (max-width: 60rem) {
    width: 100%;
  }
`;

export const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.9rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily.calSans};
  font-size: clamp(3.15rem, 4.1vw, 4.35rem);
  line-height: 0.92;
  font-weight: 600;
  letter-spacing: -0.05em;
`;

export const Description = styled.p`
  margin: 0;
  font-size: clamp(1.15rem, 1.3vw, 1.45rem);
  font-weight: 700;
  line-height: 1.45;
  white-space: nowrap;
`;

export const SwitchButton = styled.button`
  min-width: 15rem;
  height: 3.85rem;
  padding: 0 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid rgba(255, 255, 255, 0.58);
  border-radius: 999rem;
  background-color: rgba(255, 255, 255, 0.03);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.88);
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.1875rem solid rgba(255, 255, 255, 0.35);
    outline-offset: 0.25rem;
  }

  @media (max-width: 60rem) {
    min-width: 12rem;
    height: 3.25rem;
    font-size: 1.2rem;
  }
`;
